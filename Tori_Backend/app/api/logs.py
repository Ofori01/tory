from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.core.logger import log_queue, setup_logger
import asyncio

router = APIRouter()
logger = setup_logger()

async def log_stream(level: str):
    levels = ["DEBUG", "INFO", "WARNING", "ERROR"]
    target_levels = levels if level.upper() == "INFO" else ["WARNING", "ERROR"]

    while True:
        try:
            message = log_queue.get(timeout=1)
            if any(message.startswith(f"[{lvl}]") for lvl in target_levels):
                yield f"data: {message}\n\n"
        except Exception:
            await asyncio.sleep(0.1)

@router.get("/logs")
async def get_logs(level: str = "INFO"):
    logger.info(f"GET /logs?level={level} stream started")
    return StreamingResponse(log_stream(level), media_type="text/event-stream")

