from fastapi import APIRouter, HTTPException, Request
import json
import os
from app.core.logger import setup_logger

router = APIRouter()
logger = setup_logger()
SETTINGS_FILE = "settings.json"

@router.get("/settings")
async def get_settings():
    logger.info("GET /settings called")
    if not os.path.exists(SETTINGS_FILE):
        logger.error("Settings file not found.")
        raise HTTPException(status_code=500, detail="Settings file not found.")
    with open(SETTINGS_FILE, "r") as f:
        data = json.load(f)
    logger.info("Settings successfully returned")
    return data

@router.patch("/settings")
async def patch_settings(payload: dict, request: Request):
    logger.info("PATCH /settings called")
    logger.debug(f"Received payload: {payload}")
    if not os.path.exists(SETTINGS_FILE):
        logger.error("Settings file not found.")
        raise HTTPException(status_code=500, detail="Settings file not found.")
    with open(SETTINGS_FILE, "r") as f:
        current = json.load(f)

    def deep_update(original, updates):
        for key, value in updates.items():
            if isinstance(value, dict) and key in original:
                deep_update(original[key], value)
            else:
                original[key] = value

    deep_update(current, payload)

    with open(SETTINGS_FILE, "w") as f:
        json.dump(current, f, indent=2)

    logger.info("Settings successfully updated")
    return {"Status": "Success"}
