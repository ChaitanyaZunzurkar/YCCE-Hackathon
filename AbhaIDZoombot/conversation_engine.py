import json
import asyncio
import os
from client_config import client
from WebSearch import combined_search
from tools import available_tools
from prompts import system_prompt

# ... all the code you pasted earlier ...

async def process_query(user_query: str, pdf_text: str = ""):
    # keep same as before
    ...
