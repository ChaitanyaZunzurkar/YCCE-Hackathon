import logging
from fastapi import FastAPI, Depends, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from datetime import datetime
from InteligentBot.InteligentBot import process_query
from db import get_db
from models import BotInteraction
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
import PyPDF2
from typing import Optional

# ----------------- Logging Setup -----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ----------------- FastAPI App -----------------
app = FastAPI(title="Groq Memory-Aware AI")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Background Wakeup Task -----------------
async def wakeup():
    while True:
        await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(wakeup())

# ----------------- Pydantic Models -----------------
class QueryRequest(BaseModel):
    user_query: str
    user_id: str = "p123"

class QueryResponse(BaseModel):
    status: str
    response: str = ""
    question: str = ""
    step: str = ""
    logs: list = []

# ----------------- Utility -----------------
def current_timestamp():
    return datetime.now().isoformat()

# ----------------- Endpoints -----------------
@app.options("/ask")
async def options_ask(request: Request):
    return Response(status_code=200)

@app.post("/ask", response_model=QueryResponse)
async def ask_agent(
    user_query: str = Form(...),
    user_id: str = Form("p123"),
    pdf_file: Optional[UploadFile] = File(None),
    db=Depends(get_db)
):
    try:
        # ----------------- PDF Extraction -----------------
        pdf_text = ""
        if pdf_file:
            logger.info(f"Processing PDF: {pdf_file.filename}")
            pdf_reader = PyPDF2.PdfReader(pdf_file.file)
            pdf_text = "\n".join([page.extract_text() or "" for page in pdf_reader.pages])

            # ----------------- PRINT PDF CONTENT -----------------
            print("----- PDF CONTENT START -----")
            print(pdf_text)
            print("----- PDF CONTENT END -----")
    # ------------------------------------------------------

        # --------------------------------------------------

        logger.info(f"Processing query: {user_query} for user: {user_id}")

        # Pass PDF text (if available) into your query processor
        result = await process_query(user_query, pdf_text=pdf_text)

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
def read_root():
    return {"message": "Hello from FastAPI!"}
