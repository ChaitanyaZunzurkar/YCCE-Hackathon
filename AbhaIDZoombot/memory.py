import asyncio
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY3")

# Clients
groq_client = Groq(api_key=GROQ_API_KEY)
local_cache = []

# LLM call
def call_groq_api(messages):
    return groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=messages
    )

# Chat function with local memory cache
async def chat_async(message: str):
    # Add cache context if available
    memory_text = "\n".join(local_cache[-5:]) if local_cache else "No previous memory."

    # Inject memory into system prompt
    final_prompt = [
        {"role": "system", "content": f"You are a memory-aware assistant. Use these previous memories if relevant:\n{memory_text}"},
        {"role": "user", "content": message},
    ]

    # Call Groq API
    final_result = await asyncio.to_thread(call_groq_api, final_prompt)
    reply = final_result.choices[0].message.content

    # Update local cache
    local_cache.append(f"User: {message} -> Bot: {reply}")
    if len(local_cache) > 20:  # keep last 20 exchanges
        local_cache.pop(0)

    return reply

# Main loop
async def main():
    print("🚀 Memory Chat Agent started. Ctrl+C to exit.\n")

    while True:
        try:
            user_input = input(">> ")
            if not user_input.strip():
                continue
            reply = await chat_async(user_input)
            print("BOT:", reply)
        except KeyboardInterrupt:
            print("\n[EXIT]")
            break

if __name__ == "__main__":
    asyncio.run(main())
