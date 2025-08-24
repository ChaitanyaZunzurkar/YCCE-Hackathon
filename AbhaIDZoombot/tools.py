import requests
import subprocess
from datetime import datetime
from zoneinfo import ZoneInfo
from WebSearch import combined_search
import os
from dotenv import load_dotenv
import smtplib
import uuid
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ---------- CONFIG (HARDCODED) ----------
EMAIL_ADDRESS = "anshulnparate@gmail.com"        # replace with your Gmail
EMAIL_PASSWORD = "Stdio.html"    # Gmail App Password (not real password)

PATIENT_EMAIL = "anshulnparate@gmail.com"
DOCTOR_EMAIL = "cocanshulnparate@gmail.com"

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

# ---------- HELPERS ----------

def create_meet_link():
    """Generate a unique Jitsi meeting link."""
    room = str(uuid.uuid4())
    return f"https://meet.jit.si/{room}"

def send_email(to_email, subject, body):
    """Send email using Gmail SMTP (hardcoded credentials)."""
    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")

# ---------- MAIN FUNCTION ----------

def book_appointment(patient_name, doctor_name, patient_phone, doctor_phone, date_time):
    """Book an appointment: create meet link, notify patient & doctor via Email."""
    meet_link = create_meet_link()

    # Message content
    patient_msg = f"Hi {patient_name}, your appointment with {doctor_name} is booked at {date_time}. Join here: {meet_link}"
    doctor_msg = f"📅 New appointment booked!\nPatient: {patient_name}\nTime: {date_time}\nMeeting link: {meet_link}"

    # Send emails (hardcoded recipients)
    send_email(PATIENT_EMAIL, "📅 Appointment Confirmation", patient_msg)
    send_email(DOCTOR_EMAIL, "📅 New Appointment Scheduled", doctor_msg)

    # Return confirmation
    return {
        "status": "success",
        "patient": patient_name,
        "doctor": doctor_name,
        "time": date_time,
        "meeting_link": meet_link,
        "notified_via": ["email_patient", "email_doctor"]
    }

# 🔹 Example Test Call
# book_appointment("Anshul", "Dr. Sharma", "NA", "NA", "2025-08-23 14:00")


available_tools = {
    
    "compiled_websearch": {"fn": compiled_websearch, "description": "Web answers for general queries."},
    "run_command": {"fn": run_command, "description": "Execute a terminal command (15s timeout)."},
    "book_appointment" : {"fn": book_appointment, "description": "Book appontmnet tool sms doctor user and create meet link "},
}
