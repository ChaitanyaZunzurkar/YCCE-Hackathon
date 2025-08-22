# import asyncio
# import threading
# import time
# from mem0 import Memory
# from groq import Groq
# from qdrant_client import QdrantClient
# from qdrant_client.http.models import Distance, VectorParams
# import os
# from dotenv import load_dotenv
# from neo4j import GraphDatabase

# NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
# NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
# NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")
 
# neo_driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# # =============================
# # CONFIG
# # =============================
# load_dotenv()
# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# QUADRANT_HOST = "localhost"

# config = {
#     "version": "v1.1",
#     "embedder": {
#         "provider": "huggingface",
#         "config": {"model": "sentence-transformers/all-MiniLM-L6-v2"},
#     },
#     "llm": {
#         "provider": "groq",
#         "config": {"api_key": GROQ_API_KEY, "model": "llama3-70b-8192"},
#     },
#     "vector_store": {
#         "provider": "qdrant",
#         "config": {
#             "host": QUADRANT_HOST,
#             "port": 6333,
#             "collection_name": "mem0",
#             "embedding_model_dims": 384,
#         },
#     },
# }

# # mem_client = Memory.from_config(config)
# groq_client = Groq(api_key=GROQ_API_KEY)
# # client = QdrantClient(host=QUADRANT_HOST, port=6333)
# # collection_name = "mem0"

# # =============================
# # BACKGROUND Neo4j COLLECTION CHECK
# # =============================


# # # =============================
# # # BACKGROUND QDRANT COLLECTION CHECK
# # # =============================
# # def ensure_qdrant_collection():
# #     try:
# #         collections = client.get_collections().collections
# #         if collection_name not in [c.name for c in collections]:
# #             client.create_collection(
# #                 collection_name=collection_name,
# #                 vectors_config=VectorParams(size=384, distance=Distance.COSINE),
# #             )
# #             print(f"[INFO] Created new Qdrant collection: {collection_name}")
# #         else:
# #             print(f"[INFO] Using existing Qdrant collection: {collection_name}")
# #     except Exception as e:
# #         print(f"[WARN] Background Qdrant check failed: {e}")

# # threading.Thread(target=ensure_qdrant_collection, daemon=True).start()

# # # =============================
# # # MEMORY BUFFER
# # # =============================
# # memory_buffer = []
# # BUFFER_SIZE = 5
# # local_cache = []  # keep last 10 in RAM

# # def add_memory_buffered(messages, user_id):
# #     memory_buffer.append((messages, user_id))
# #     local_cache.append(messages[-1]["content"])  # add assistant reply to cache
# #     if len(local_cache) > 10:
# #         local_cache.pop(0)

# #     if len(memory_buffer) >= BUFFER_SIZE:
# #         for msgs, uid in memory_buffer:
# #             mem_client.add(msgs, user_id=uid)
# #         memory_buffer.clear()
# #         print("[INFO] Flushed memory buffer to Qdrant")

# local_cache = []  # keep last 10 in RAM

# # =============================
# # HELPERS
# # =============================
# def call_groq_api(messages):
#     return groq_client.chat.completions.create(
#         model="llama3-70b-8192", messages=messages
#     )

# async def search_memories_async(query, user_id="p123", limit=10):
#     def run_query(tx):
#         result = tx.run(
#             """
#             CALL db.index.fulltext.queryNodes("memoryIndex", $query)
#             YIELD node, score
#             RETURN node.content AS memory
#             ORDER BY score DESC
#             LIMIT $limit
#             """,
#             query=query,
#             limit=limit,
#         )
#         return [record["memory"] for record in result]

#     try:
#         with neo_driver.session() as session:
#             results = await asyncio.to_thread(session.read_transaction, run_query)
#             return {"results": [{"memory": r} for r in results]}
#     except Exception as e:
#         print(f"[WARN] Neo4j memory search error: {e}")
#         return {"results": []}

# # =============================
# # CHAT FUNCTION
# # =============================
# async def chat_async(message: str):
#     # Run search + LLM in parallel
#     mem_task = asyncio.create_task(search_memories_async(message))
#     llm_task = asyncio.create_task(asyncio.to_thread(call_groq_api, [
#         {"role": "system", "content": "You are a memory-aware agent."},
#         {"role": "user", "content": message},
#     ]))

#     mem_result, result = await asyncio.gather(mem_task, llm_task)

#     # Handle memory
#     top_memories = mem_result.get("results", [])[:10]
#     memory_text = "\n".join([m["memory"] for m in top_memories] + local_cache)

#     # Final system prompt (with memories)
#     SYSTEM_PROMPT = f"""
#     You are a Memory-Aware Fact Extraction Agent.
#     Past context (Qdrant + Cache):
#     {memory_text}
#     """

#     # Re-call LLM with memory context
#     final_messages = [
#         {"role": "system", "content": SYSTEM_PROMPT},
#         {"role": "user", "content": message},
#     ]

#     final_result = await asyncio.to_thread(call_groq_api, final_messages)
#     response_content = final_result.choices[0].message.content

#     # -----------------------------
#     # STORE ONLY RELATIONS
#     # -----------------------------
#     try:
#         data = json.loads(response_content)
#         relations = data.get("relations", [])  # adjust according to your LLM schema
#         if relations:
#             # store as Memory
#             mem_client.add([{"role": "system", "content": str(relations)}], user_id="p123")
#             print(f"[INFO] Stored relations: {relations}")
#     except Exception as e:
#         print(f"[WARN] Could not extract relations: {e}")

#     # Add full response to local cache (optional)
#     local_cache.append(response_content)
#     if len(local_cache) > 10:
#         local_cache.pop(0)

#     return response_content



# # =============================
# # MAIN LOOP
# # =============================
# async def main():
#     print("🚀 Memory Chat Agent started. Type messages. Ctrl+C to exit.\n")
#     while True:
#         try:
#             message = input(">> ")
#             response = await chat_async(message)
#             print("BOT:", response)
#         except KeyboardInterrupt:
#             print("\nExiting...")
#             break

# if __name__ == "__main__":
#     import asyncio
#     asyncio.run(main())
import asyncio
import os
from dotenv import load_dotenv
from neo4j import GraphDatabase
from groq import Groq

# Load environment
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "system123")
NEO4J_DB = "memorygraph"

# Clients
neo_driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
groq_client = Groq(api_key=GROQ_API_KEY)
local_cache = []

# LLM call
def call_groq_api(messages):
    return groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=messages
    )

# Search Neo4j graph memories
async def search_memories_async(query, limit=10):
    def run_query(tx):
        # Case: asking for "my name"
        if "my name" in query.lower():
            result = tx.run("""
                MATCH (e:Entity {name:'user'})-[r]->(v:Value)
                WHERE type(r) = "NAME"
                RETURN e.name AS entity, type(r) AS relation, v.name AS value
                LIMIT $limit
            """, limit=limit)

            memories = [
                {
                    "entity": record["entity"],
                    "relation": record["relation"],
                    "value": record["value"]
                }
                for record in result
            ]
            print("[DEBUG] Found name in Neo4j:", memories)
            return memories

        # General fallback search
        result = tx.run("""
            MATCH (e:Entity)-[r]->(v:Value)
            RETURN e.name AS entity, type(r) AS relation, v.name AS value
            LIMIT $limit
        """, limit=limit)

        memories = [
            {
                "entity": record["entity"],
                "relation": record["relation"],
                "value": record["value"]
            }
            for record in result
        ]
        print("[DEBUG] Fallback memories:", memories)
        return memories

    try:
        with neo_driver.session(database=NEO4J_DB) as session:
            return await asyncio.to_thread(session.read_transaction, run_query)
    except Exception as e:
        print(f"[WARN] Neo4j memory search error: {e}")
        return []

# Chat function
async def chat_async(message: str):
    # Search memory + call LLM in parallel
    mem_task = asyncio.create_task(search_memories_async(message))
    llm_task = asyncio.create_task(asyncio.to_thread(call_groq_api, [
        {"role": "system", "content": "You are a memory-aware assistant."},
        {"role": "user", "content": message},
    ]))

    top_memories, _ = await asyncio.gather(mem_task, llm_task)

    # Convert structured memories into readable sentences
    memory_text = "\n".join(
        f"{m['entity']} {m['relation'].lower()} {m['value']}" for m in top_memories
    )

    # Inject memories into final prompt
    final_prompt = [
        {"role": "system", "content": f"Use these memories if relevant:\n{memory_text}"},
        {"role": "user", "content": message},
    ]

    final_result = await asyncio.to_thread(call_groq_api, final_prompt)
    reply = final_result.choices[0].message.content

    # Update local cache
    local_cache.append(reply)
    if len(local_cache) > 10:
        local_cache.pop(0)

    return reply

# Main loop
async def main():
    print("🚀 Memory Chat Agent started. Ctrl+C to exit.\n")
    print("[INFO] Make sure this index exists in Neo4j:\n"
          "CREATE FULLTEXT INDEX entityIndex FOR (e:Entity) ON EACH [e.name];\n")

    while True:
        try:
            user_input = input(">> ")
            reply = await chat_async(user_input)
            print("BOT:", reply)
        except KeyboardInterrupt:
            print("\n[EXIT]")
            break

if __name__ == "__main__":
    asyncio.run(main())
