import requests
import subprocess
from datetime import datetime
from zoneinfo import ZoneInfo
from .WebSearch import combined_search

def run_command(command: str):
    command = (command or "").strip()
    if not command:
        return "No command provided."
    try:
        output = subprocess.check_output(
            command, shell=True, text=True,
            stderr=subprocess.STDOUT, timeout=15
        )
        return output.strip()
    except subprocess.TimeoutExpired:
        return "Command timed out after 15s."
    except subprocess.CalledProcessError as e:
        return f"Command failed:\n{e.output}"

def get_weather(city: str):
    city = (city or "").strip()
    if not city:
        return "Please provide a city."
    url = f"https://wttr.in/{city}?format=%C+%t"
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            return f"The weather in {city} is {r.text}."
        return f"Weather lookup failed with status {r.status_code}."
    except requests.RequestException as e:
        return f"Weather lookup error: {e}"

def compiled_websearch(query: str) -> str:
    query = (query or "").strip()
    if not query:
        return "Please provide a query."
    results = combined_search(query)
    return results.get("answer", "No answer available.")

def get_time(place_or_tz: str) -> str:
    s = (place_or_tz or "").strip().lower()
    if not s:
        return "Please provide a place or timezone."
    if any(k in s for k in ["india", "ist", "kolkata", "delhi", "mumbai", "nagpur"]):
        tz = "Asia/Kolkata"
    elif "/" in s:
        tz = place_or_tz.strip()
    else:
        tz = "UTC"
    try:
        now = datetime.now(ZoneInfo(tz))
        return f"Current time in {tz} is {now.strftime('%Y-%m-%d %H:%M:%S')}."
    except Exception:
        now = datetime.utcnow()
        return f"Unknown timezone. UTC time is {now.strftime('%Y-%m-%d %H:%M:%S')}."

available_tools = {
    "get_weather": {"fn": get_weather, "description": "Return current weather for a city."},
    "compiled_websearch": {"fn": compiled_websearch, "description": "Web answers for general queries."},
    #"run_command": {"fn": run_command, "description": "Execute a terminal command (15s timeout)."},
    "get_time": {"fn": get_time, "description": "Get current time by city hint or timezone."},
}
