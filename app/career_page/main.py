from fastapi import FastAPI
from app.career_page.routes.chat_route import router as chat_router
from app.career_page.routes.guidance_route import router as guidance_router

app = FastAPI(
    title="AI Career Guidance",
    description="LLM-powered smart career guidance platform",
    version="1.0.0"
)

app.include_router(chat_router)
app.include_router(guidance_router)
