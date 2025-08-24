import asyncio
import logging
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

from conversation_engine import process_query  # 👈 your pipeline file

# -------- Logger --------
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# -------- FastAPI App --------
app = FastAPI(title="Groq AI Chat API", version="1.0")

# -------- Database --------
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["groq_ai"]

# -------- Response Model --------
class QueryResponse(BaseModel):
    status: str
    response: str
    question: str
    step: str
    logs: list

def current_timestamp():
    return datetime.utcnow().isoformat()

# -------- API Endpoint --------
@app.post("/query", response_model=QueryResponse)
async def query_endpoint(
    user_query: str = Form(...),
    pdf_file: UploadFile | None = None
):
    try:
        user_id = "p123"  # 👈 Hardcoded user ID

        pdf_text = ""
        if pdf_file:
            pdf_text = (await pdf_file.read()).decode("utf-8", errors="ignore")

        # Run your query pipeline
        result = await process_query(user_query, pdf_text)

        if result.get("status") == "ask_user":
            bot_response = result.get("question") or ""
            user_question = user_query
        else:
            bot_response = result.get("response") or ""
            user_question = user_query

        # Save interaction to DB
        interaction = {
            "user_id": user_id,
            "question": user_question,
            "response": bot_response,
            "status": result.get("status", "done"),
            "step": result.get("status", "output"),
            "pdf_used": bool(pdf_file),
            "timestamp": current_timestamp(),
        }

        await db["interactions"].insert_one(interaction)
        logger.info(f"Interaction saved for user: {user_id}")

        return QueryResponse(
            status=result.get("status", "done"),
            response=bot_response,
            question=user_question,
            step=result.get("status", "output"),
            logs=[current_timestamp()]
        )

    except Exception as e:
        logger.exception(f"Error processing query: {str(e)}")
        return QueryResponse(
            status="error",
            response="An error occurred while processing your request.",
            question=user_query,
            step="error",
            logs=[current_timestamp()]
        )

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI!"}
