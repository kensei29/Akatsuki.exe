import os
import google.generativeai as genai
from dotenv import load_dotenv
from typing import List

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")
chat_sessions = {}

def chat_with_gemini(user_id: str, message: str) -> str:
    """Handles Gemini conversational memory per user"""
    if user_id not in chat_sessions:
        chat_sessions[user_id] = model.start_chat(history=[])

    chat = chat_sessions[user_id]
    response = chat.send_message(message)
    return response.text
