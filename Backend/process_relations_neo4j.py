# import asyncio
# import json
# import os
# from dotenv import load_dotenv
# from groq import Groq
# from watchdog.observers import Observer
# from watchdog.events import FileSystemEventHandler
# from neo4j import GraphDatabase
# from queue import Queue

# # =============================
# # CONFIG
# # =============================
# load_dotenv()

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
# NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
# NEO4J_PASS = os.getenv("NEO4J_PASS", "password")
# NEO4J_DB = os.getenv("NEO4J_DB", "memorygraph")
# CONVERSATION_LOG = "conversation_log.json"

# if not GROQ_API_KEY:
#     raise RuntimeError("GROQ_API_KEY is missing in .env")

# # Clients
# groq_client = Groq(api_key=GROQ_API_KEY)
# neo_client = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))

# # =============================
# # HELPERS
# # =============================
# def call_groq_api(messages):
#     return groq_client.chat.completions.create(
#         model="llama3-70b-8192",
#         messages=messages
#     )

# def validate_relations(relations):
#     """Filter out invalid placeholder relations."""
#     blacklist = {"eg", "example", "relation", "info"}
#     cleaned = []
#     for r in relations:
#         relation = r.get("relation", "").lower()
#         if relation in blacklist or not relation:
#             print(f"[WARN] Skipping bad relation: {r}")
#             continue
#         cleaned.append(r)
#     return cleaned

# def store_relations_neo4j(relations):
#     relations = validate_relations(relations)
#     if not relations:
#         return
#     with neo_client.session(database=NEO4J_DB) as session:
#         for r in relations:
#             entity = r.get("entity")
#             relation = r.get("relation")
#             value = r.get("value")

#             if not (entity and relation and value):
#                 continue

#             query = f"""
#             MERGE (e:Entity {{name: $entity}})
#             MERGE (v:Value {{name: $value}})
#             MERGE (e)-[r:{relation.upper()}]->(v)
#             ON CREATE SET r.createdAt = timestamp()
#             ON MATCH SET r.updatedAt = timestamp()
#             """
#             session.run(query, entity=entity, value=value, relation=relation)
#     print(f"[INFO] Stored {len(relations)} relation(s) in Neo4j.")

# async def extract_relations_async(user_message: str, assistant_message: str):
#     SYSTEM_PROMPT = f"""
# You are a Memory-Aware Fact Extraction Agent.
# Extract factual relations from the conversation.
# Return ONLY valid JSON in the format:

# {{
#   "relations": [
#     {{"entity": "...", "relation": "...", "value": "..."}}
#   ]
# }}

# ⚠️ Rules:
# - Use clear relation labels like: name, age, gender, lives_in, works_at, studies_at, likes, dislikes, sibling_of, friend_of, etc.
# - Do NOT use placeholder words like "eg", "example", "relation", or "info".
# - Each relation must connect an entity to a value.
# - Keep it short and factual.

# Examples:
# - User: "My name is Anshul" → {{ "entity": "user", "relation": "name", "value": "Anshul" }}
# - User: "My sister lives in Pune" → {{ "entity": "sister", "relation": "lives_in", "value": "Pune" }}
# - User: "I like cricket" → {{ "entity": "user", "relation": "likes", "value": "cricket" }}

# Conversation:
# User: {user_message}
# Assistant: {assistant_message}
# """
#     try:
#         response = await asyncio.to_thread(
#             call_groq_api,
#             [{"role": "system", "content": SYSTEM_PROMPT}]
#         )
#         content = response.choices[0].message.content.strip()
#         data = json.loads(content)
#         relations = data.get("relations", [])
#         if relations:
#             print("[INFO] Extracted relations:", relations)
#             store_relations_neo4j(relations)
#     except Exception as e:
#         print(f"[WARN] Could not parse/extract relations: {e}")

# # =============================
# # FILE MONITORING
# # =============================
# class FileChangeHandler(FileSystemEventHandler):
#     def __init__(self, queue):
#         self.queue = queue

#     def on_modified(self, event):
#         if event.src_path.endswith(CONVERSATION_LOG):
#             self.queue.put(True)

# async def process_conversation_log():
#     try:
#         with open(CONVERSATION_LOG, "r", encoding="utf-8") as f:
#             data = json.load(f)
#     except (FileNotFoundError, json.JSONDecodeError):
#         with open(CONVERSATION_LOG, "w", encoding="utf-8") as f:
#             json.dump([], f)
#         return

#     if not isinstance(data, list):
#         return

#     for entry in data:
#         user_query = entry.get("user_query", "").strip()
#         assistant_response = entry.get("assistant_response", "").strip()
#         if user_query and assistant_response:
#             await extract_relations_async(user_query, assistant_response)

#     # Clear after processing
#     with open(CONVERSATION_LOG, "w", encoding="utf-8") as f:
#         json.dump([], f)
#     print("[INFO] conversation_log.json processed and cleared.")

# # =============================
# # MAIN
# # =============================
# async def main():
#     print("🚀 Watching conversation_log.json (Neo4j memory mode)")

#     event_queue = Queue()
#     observer = Observer()
#     observer.schedule(FileChangeHandler(event_queue), path=".", recursive=False)
#     observer.start()

#     try:
#         await process_conversation_log()
#         while True:
#             if not event_queue.empty():
#                 event_queue.get()
#                 await process_conversation_log()
#             await asyncio.sleep(1)
#     except KeyboardInterrupt:
#         print("Exiting...")
#     finally:
#         observer.stop()
#         observer.join()
#         neo_client.close()

# if __name__ == "__main__":
#     asyncio.run(main())

import asyncio
import json
import os
from dotenv import load_dotenv
from groq import Groq
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from neo4j import GraphDatabase
from queue import Queue

# =============================
# CONFIG
# =============================
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY1")
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASS = os.getenv("NEO4J_PASS", "password")
NEO4J_DB = os.getenv("NEO4J_DB", "memorygraph")
CONVERSATION_LOG = "conversation_log.json"

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing in .env")

# Clients
groq_client = Groq(api_key=GROQ_API_KEY)
neo_client = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))

# =============================
# HELPERS
# =============================
def call_groq_api(messages):
    return groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=messages
    )

def validate_relations(relations):
    blacklist = {"eg", "example", "relation", "info"}
    return [r for r in relations if r.get("relation", "").lower() not in blacklist and r.get("relation")]

def store_relations_neo4j(relations):
    relations = validate_relations(relations)
    if not relations:
        return

    UNIQUE_RELATIONS = {"name", "age", "gender", "lives_in", "works_at", "studies_at"}

    with neo_client.session(database=NEO4J_DB) as session:
        for r in relations:
            entity = r.get("entity")
            relation = r.get("relation")
            value = r.get("value")
            if not (entity and relation and value):
                continue

            # Delete old unique relation if exists
            if relation.lower() in UNIQUE_RELATIONS:
                session.run(
                    f"MATCH (e:Entity {{name: $entity}})-[rel:{relation.upper()}]->(:Value) DELETE rel",
                    entity=entity
                )

            # Create new relation
            session.run(
                f"""
                MERGE (v:Value {{name: $value}})
                MERGE (e:Entity {{name: $entity}})
                MERGE (e)-[r:{relation.upper()}]->(v)
                ON CREATE SET r.createdAt = timestamp()
                ON MATCH SET r.updatedAt = timestamp()
                """,
                entity=entity, value=value
            )

async def extract_relations_async(user_message: str):
    SYSTEM_PROMPT = f"""
You are a Memory-Aware Fact Extraction Agent. Your task is to read a user’s message and extract **all factual relations** mentioned in it.  
Return ONLY valid JSON in the exact format below:

{{
  "relations": [
    {{"entity": "...", "relation": "...", "value": "..."}}
  ]
}}

⚠️ RULES:
1. Extract facts **explicitly stated** in the message.
2. Each relation must have:
   - "entity": the subject (person, object, place, organization, etc.)
   - "relation": the type of relationship (use clear labels)
   - "value": the object or information the entity is related to
3. Only use short, clear relation labels, e.g.:
   - name, age, gender, lives_in, works_at, studies_at, likes, dislikes, sibling_of, friend_of, parent_of, owns, created, member_of
4. Avoid placeholder or generic words like: "example", "info", "eg", "relation"
5. Include multiple relations if the message mentions several facts.
6. If a fact is repeated, only include it once.
7. If a relation is unique for an entity (like name or age), overwrite any previous values for that entity.
8. Include dates, numbers, locations, and preferences as values where applicable.
9. If a message contains ambiguous pronouns (e.g., "she", "he", "they"), resolve them using context if possible, otherwise leave the entity as-is.
10. Do not include opinions, speculation, or assumptions.

EXAMPLES:
- Message: "My name is Anshul and I live in Mumbai."
  Output: {{
    "relations": [
      {{"entity": "user", "relation": "name", "value": "Anshul"}},
      {{"entity": "user", "relation": "lives_in", "value": "Mumbai"}}
    ]
  }}

- Message: "I like cricket and my sister likes painting."
  Output: {{
    "relations": [
      {{"entity": "user", "relation": "likes", "value": "cricket"}},
      {{"entity": "sister", "relation": "likes", "value": "painting"}}
    ]
  }}

- Message: "My father, Rajesh, works at Infosys and my mother, Sunita, is 45 years old."
  Output: {{
    "relations": [
      {{"entity": "father", "relation": "name", "value": "Rajesh"}},
      {{"entity": "father", "relation": "works_at", "value": "Infosys"}},
      {{"entity": "mother", "relation": "name", "value": "Sunita"}},
      {{"entity": "mother", "relation": "age", "value": "45"}}
    ]
  }}

Conversation message:
User: {user_message}

Remember: **Return only JSON**, do not include explanations, commentary, or extra text.
"""

    try:
        response = await asyncio.to_thread(
            call_groq_api,
            [{"role": "system", "content": SYSTEM_PROMPT}]
        )
        content = response.choices[0].message.content.strip()
        data = json.loads(content)
        relations = data.get("relations", [])
        if relations:
            print("[INFO] Extracted relations:", relations)
            store_relations_neo4j(relations)
    except Exception as e:
        print(f"[WARN] Could not parse/extract relations: {e}")

# =============================
# FILE MONITORING
# =============================
class FileChangeHandler(FileSystemEventHandler):
    def __init__(self, queue):
        self.queue = queue

    def on_modified(self, event):
        if event.src_path.endswith(CONVERSATION_LOG):
            self.queue.put(True)

async def process_conversation_log():
    try:
        with open(CONVERSATION_LOG, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        with open(CONVERSATION_LOG, "w", encoding="utf-8") as f:
            json.dump([], f)
        return

    if not isinstance(data, list):
        return

    for entry in data:
        user_query = entry.get("user_query", "").strip()
        if user_query:
            await extract_relations_async(user_query)

    # Clear after processing
    with open(CONVERSATION_LOG, "w", encoding="utf-8") as f:
        json.dump([], f)
    print("[INFO] conversation_log.json processed and cleared.")

# =============================
# MAIN LOOP
# =============================
async def main():
    print("🚀 Watching conversation_log.json (Neo4j memory mode)")

    event_queue = Queue()
    observer = Observer()
    observer.schedule(FileChangeHandler(event_queue), path=".", recursive=False)
    observer.start()

    try:
        while True:
            if not event_queue.empty():
                event_queue.get()
                await process_conversation_log()
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        observer.stop()
        observer.join()
        neo_client.close()

if __name__ == "__main__":
    asyncio.run(main())
