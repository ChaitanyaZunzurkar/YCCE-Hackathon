import json
import asyncio

from InteligentBot.client_config import client
from .tools import available_tools
from .prompts import system_prompt
from . import memory  # Neo4j backend

MAX_MESSAGES = 10
messages = [{"role": "system", "content": system_prompt}]
CONVERSATION_LOG = "conversation_log.json"

# ---- Logging Helper ----
def log_message(level: str, message: str):
    logos = {
        "info": "🟢 [GROQ INFO]",
        "warn": "🟡 [GROQ WARN]",
        "error": "🔴 [GROQ ERROR]",
        "ask": "❓ [GROQ ASK]",
        "brain": "🧠 [GROQ PLAN]",
        "bot": "🤖 [GROQ BOT]",
        "mem": "📚 [GROQ MEMORY]"
    }
    prefix = logos.get(level.lower(), "ℹ️ [GROQ]")
    print(f"{prefix} {message}")

log_message("info", "Welcome to Groq AI! Type your questions below (Ctrl+C to exit).")

# ---- Conversation History ----
def trim_history(msgs, max_len=MAX_MESSAGES):
    if len(msgs) <= max_len:
        return msgs
    return [msgs[0]] + msgs[-(max_len-1):]

# ---- Conversation Logger ----
def append_to_conversation_log(user_query, assistant_response):
    """Append user query and assistant response to the JSON log file."""
    log_entry = {
        "timestamp": asyncio.get_event_loop().time(),
        "user_query": user_query,
        "assistant_response": assistant_response
    }
    
    try:
        try:
            with open(CONVERSATION_LOG, "r") as f:
                log_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            log_data = []
        
        log_data.append(log_entry)
        
        with open(CONVERSATION_LOG, "w") as f:
            json.dump(log_data, f, indent=2)
        log_message("info", f"Logged conversation to {CONVERSATION_LOG}")
    except Exception as e:
        log_message("warn", f"Failed to log conversation: {e}")

# ---- Helper: Inject Neo4j Memories ----
async def inject_memories(user_query):
    mem_result = await memory.search_memories_async(user_query)
    top_memories = mem_result[:10]

    # Structured JSON for logging or other use
    structured = [{"entity": m["entity"], "relation": m["relation"], "value": m["value"]} for m in top_memories]

    # Build memory text from entity-relation-value
    memory_text = "\n".join([f"{m['entity']} {m['relation']} {m['value']}" for m in top_memories] + memory.local_cache)

    if structured:
        log_message("mem", f"Retrieved memories: {json.dumps(structured, indent=2)}")

    # Update system prompt with memory context
    enhanced_system_prompt = system_prompt + f"\n\nPast context (Neo4j + Cache):\n{memory_text}"
    messages[0] = {"role": "system", "content": enhanced_system_prompt}

    return structured

# ---- Main Loop ----
async def main_loop():
    global messages
    while True:
        user_query = input(">> ").strip()
        if not user_query:
            log_message("warn", "Empty input ignored.")
            continue
        
        await inject_memories(user_query)

        messages.append({"role": "user", "content": user_query})
        messages = trim_history(messages)

        while True:
            try:
                completion = client.chat.completions.create(
                    model="llama3-70b-8192",
                    response_format={"type": "json_object"},
                    messages=messages,
                    max_tokens=700,
                    temperature=0.4,
                )
                raw = completion.choices[0].message.content
                parsed = json.loads(raw)
            except json.JSONDecodeError:
                messages.append({"role": "user", "content": "Return ONE valid JSON object matching the schema."})
                messages = trim_history(messages)
                continue

            messages.append({"role": "assistant", "content": json.dumps(parsed)})
            messages = trim_history(messages)

            step = (parsed.get("step") or "").lower()

            if step == "plan":
                log_message("brain", parsed.get("content", "").strip() or "Planning...")
                messages.append({"role": "user", "content": "Proceed to the next step."})
                messages = trim_history(messages)
                continue

            if step == "ask_user":
                q = (parsed.get("question") or "").strip()
                log_message("ask", q if q else "I need clarification.")
                answer = input("> ").strip()
                if not answer:
                    log_message("warn", "Empty input ignored.")
                    continue
                messages.append({"role": "user", "content": answer})
                messages = trim_history(messages)
                continue

            if step == "action":
                tool_name = (parsed.get("function") or "").strip()
                tool_input = (parsed.get("input") or "").strip()
                if tool_name in available_tools:
                    try:
                        output = available_tools[tool_name]["fn"](tool_input)
                    except Exception as e:
                        output = f"Tool error: {e}"
                else:
                    output = f"Unknown tool: {tool_name}"

                messages.append({"role": "assistant", "content": json.dumps({"step": "observe", "output": output})})
                messages = trim_history(messages)
                continue

            if step == "output":
                content = parsed.get('content', '').strip()
                log_message("bot", content)
                
                append_to_conversation_log(user_query, content)
                
                memory.local_cache.append(content)
                if len(memory.local_cache) > 10:
                    memory.local_cache.pop(0)
                
                break

            log_message("error", "Unexpected step, ending turn.")
            break

# ---- Single-turn API function ----
async def process_query(user_query: str, pdf_text: str = ""):
    global messages
    logs = []

    # Merge PDF text if available
    if pdf_text:
        user_query = f"{user_query}\n\n[PDF Content]\n{pdf_text}"

    await inject_memories(user_query)

    messages.append({"role": "user", "content": user_query})
    messages = trim_history(messages)

    while True:
        try:
            completion = client.chat.completions.create(
                model="llama3-70b-8192",
                response_format={"type": "json_object"},
                messages=messages,
                max_tokens=700,
                temperature=0.4,
            )
            raw = completion.choices[0].message.content
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            messages.append({"role": "user", "content": "Return ONE valid JSON object matching the schema."})
            messages = trim_history(messages)
            continue

        messages.append({"role": "assistant", "content": json.dumps(parsed)})
        messages = trim_history(messages)

        step = (parsed.get("step") or "").lower()

        if step == "plan":
            logs.append({"level": "brain", "message": parsed.get("content", "").strip() or "Planning..."})
            messages.append({"role": "user", "content": "Proceed to next step."})
            messages = trim_history(messages)
            continue

        if step == "ask_user":
            q = (parsed.get("question") or "").strip()
            logs.append({"level": "ask", "message": q if q else "I need clarification."})
            return {"status": "ask_user", "question": q, "logs": logs}

        if step == "action":
            tool_name = (parsed.get("function") or "").strip()
            tool_input = (parsed.get("input") or "").strip()
            if tool_name in available_tools:
                try:
                    output = available_tools[tool_name]["fn"](tool_input)
                except Exception as e:
                    output = f"Tool error: {e}"
            else:
                output = f"Unknown tool: {tool_name}"

            messages.append({"role": "assistant", "content": json.dumps({"step": "observe", "output": output})})
            messages = trim_history(messages)
            continue

        if step == "output":
            content = parsed.get("content", "").strip()
            logs.append({"level": "bot", "message": content})

            append_to_conversation_log(user_query, content)

            memory.local_cache.append(content)
            if len(memory.local_cache) > 10:
                memory.local_cache.pop(0)

            return {"status": "done", "response": content, "logs": logs}

        logs.append({"level": "error", "message": "Unexpected step"})
        return {"status": "error", "logs": logs}

if __name__ == "__main__":
    asyncio.run(main_loop())