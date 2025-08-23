import asyncio
import threading
import time
import json
from mem0 import Memory
from groq import Groq
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from queue import Queue
import os
from dotenv import load_dotenv

# =============================
# CONFIG
# =============================
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
QUADRANT_HOST = "localhost"
CONVERSATION_LOG = "conversation_log.json"

config = {
    "version": "v1.1",
    "embedder": {
        "provider": "huggingface",
        "config": {"model": "sentence-transformers/all-MiniLM-L6-v2"},
    },
    "llm": {
        "provider": "groq",
        "config": {"api_key": GROQ_API_KEY, "model": "llama3-70b-8192"},
    },
    "vector_store": {
        "provider": "qdrant",
        "config": {
            "host": QUADRANT_HOST,
            "port": 6333,
            "collection_name": "mem0",
            "embedding_model_dims": 384,
        },
    },
}

mem_client = Memory.from_config(config)
groq_client = Groq(api_key=GROQ_API_KEY)
client = QdrantClient(host=QUADRANT_HOST, port=6333)
collection_name = "mem0"

# =============================
# BACKGROUND QDRANT COLLECTION CHECK
# =============================
def ensure_qdrant_collection():
    try:
        collections = client.get_collections().collections
        if collection_name not in [c.name for c in collections]:
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE),
            )
            print(f"[INFO] Created new Qdrant collection: {collection_name}")
        else:
            print(f"[INFO] Using existing Qdrant collection: {collection_name}")
    except Exception as e:
        print(f"[WARN] Background Qdrant check failed: {e}")
        pass

threading.Thread(target=ensure_qdrant_collection, daemon=True).start()

# =============================
# MEMORY BUFFER
# =============================
memory_buffer = []
BUFFER_SIZE = 5
local_cache = []  # keep last 10 in RAM

def add_memory_buffered(messages, user_id):
    memory_buffer.append((messages, user_id))
    local_cache.append(messages[-1]["content"])  # add assistant reply to cache
    if len(local_cache) > 10:
        local_cache.pop(0)

    if len(memory_buffer) >= BUFFER_SIZE:
        for msgs, uid in memory_buffer:
            mem_client.add(msgs, user_id=uid)
        memory_buffer.clear()
        print("[INFO] Flushed memory buffer to Qdrant")

# =============================
# HELPERS
# =============================
def call_groq_api(messages):
    return groq_client.chat.completions.create(
        model="llama3-70b-8192", messages=messages
    )

async def search_memories_async(query, user_id="p123", limit=10):
    try:
        return await asyncio.to_thread(mem_client.search, query=query, user_id=user_id, limit=limit)
    except Exception as e:
        print(f"[WARN] Error searching memories: {e}")
        return {"results": []}

# =============================
# FILE MONITORING
# =============================
class FileChangeHandler(FileSystemEventHandler):
    def __init__(self, event_queue):
        self.event_queue = event_queue

    def on_modified(self, event):
        if not event.is_directory and event.src_path.endswith(CONVERSATION_LOG):
            self.event_queue.put_nowait(True)  # Signal file change

    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith(CONVERSATION_LOG):
            self.event_queue.put_nowait(True)  # Handle atomic saves

    def on_moved(self, event):
        if not event.is_directory and event.dest_path.endswith(CONVERSATION_LOG):
            self.event_queue.put_nowait(True)  # Handle renames

async def process_conversation_log():
    try:
        with open(CONVERSATION_LOG, 'r') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []
        with open(CONVERSATION_LOG, 'w') as f:
            json.dump(data, f)
        return False  # Indicate no processing occurred

    if not data:
        return False  # No data to process

    # Process each entry
    for entry in data:
        user_id = entry.get("user_id", "p123")
        user_query = entry.get("user_query", "")
        assistant_response = entry.get("assistant_response", "")
        if user_query and assistant_response:
            await extract_relations_async(user_query, assistant_response, user_id)
            print(f"[INFO] Processed query: {user_query}")

    # Clear processed entries
    with open(CONVERSATION_LOG, 'w') as f:
        json.dump([], f)
    print("[INFO] Cleared processed entries from conversation_log.json")
    return True  # Indicate processing occurred

async def extract_relations_async(user_message: str, assistant_message: str, user_id: str = "p123"):
    # Run search in parallel if needed
    mem_task = asyncio.create_task(search_memories_async(user_message, user_id))
    mem_result = await mem_task

    # Handle memory
    top_memories = mem_result.get("results", [])[:10]
    memory_text = "\n".join([m["memory"] for m in top_memories] + local_cache)

    # System prompt for extraction
    SYSTEM_PROMPT = f"""
    You are a Memory-Aware Fact Extraction Agent.
    Your task is to:
    Extract any new or updated facts as 'relations' (e.g., knowledge graph triples like entity-relation-value) from the following conversation.
    Use the past context and current date (August 16, 2025) for accuracy.
    Conversation:
    User: {user_message}
    Assistant: {assistant_message}
       Examples: 
       - 'My name is ANSHUL' → {{"entity": "user", "relation": "name", "value": "ANSHUL"}}
       - 'My sister's name is Priya' → {{"entity": "sister", "relation": "name", "value": "Priya"}}
    Output ONLY in this strict JSON format:
    {{
      "relations": [
        {{"entity": "example_entity", "relation": "example_relation", "value": "example_value"}},
        ...
      ]
    }}

    Past context (Qdrant + Cache):
    {memory_text}

    If no new relations are identified, use an empty list for 'relations'. Ensure the output is valid JSON with no extra text.
    """

    # Call LLM with prompt
    final_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
    ]

    final_result = await asyncio.to_thread(call_groq_api, final_messages)
    response_content = final_result.choices[0].message.content
    print(f"[DEBUG] Raw LLM response: {response_content}")  # Add debugging

    # Store only relations
    try:
        data = json.loads(response_content)
        relations = data.get("relations", [])
        if relations:
            mem_client.add([{"role": "system", "content": str(relations)}], user_id=user_id)
            print(f"[INFO] Stored relations: {relations}")
        # Add to local cache (using assistant message)
        local_cache.append(assistant_message)
        if len(local_cache) > 10:
            local_cache.pop(0)
        # Add to memory buffer
        add_memory_buffered([
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": assistant_message}
        ], user_id)
    except json.JSONDecodeError as e:
        print(f"[WARN] JSON parsing failed: {e}. Raw response: {response_content}")
        pass

# =============================
# MAIN LOOP
# =============================
async def main():
    print("🚀 Memory Chat Agent started. Monitoring conversation_log.json. Ctrl+C to exit.\n")
    
    # Set up file monitoring
    event_queue = Queue()
    event_handler = FileChangeHandler(event_queue)
    observer = Observer()
    observer.schedule(event_handler, path=".", recursive=False)
    observer.start()

    try:
        # Initial processing of existing log
        await process_conversation_log()
        
        # Main loop: process file changes or wait
        while True:
            if not event_queue.empty():
                event_queue.get()  # Consume the event
                processed = await process_conversation_log()
                if not processed:
                    print("[INFO] No new data in conversation_log.json, waiting...")
            await asyncio.sleep(1)  # Sleep to prevent busy-waiting
    except KeyboardInterrupt:
        print("\nExiting...")
        observer.stop()
    finally:
        observer.join()

if __name__ == "__main__":
    asyncio.run(main())