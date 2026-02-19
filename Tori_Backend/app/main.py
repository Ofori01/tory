from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.api import settings, logs, camera
from app.core.logger import setup_logger
from app.core.camera_handler import start_recording_loop
import asyncio

app = FastAPI()

# CORS (if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(settings.router)
app.include_router(logs.router)
app.include_router(camera.router)

# Setup logging
logger = setup_logger()

@app.on_event("startup")
async def startup_event():
    logger.info("Tori server starting up...")
    loop = asyncio.get_event_loop()
    loop.create_task(start_recording_loop(logger))
    logger.info("Recording loop started.")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Tori server shutting down...")
