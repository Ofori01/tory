from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from datetime import datetime, timedelta
import os
from app.core.logger import setup_logger

router = APIRouter()
logger = setup_logger()

ALLOWED_CAMERAS = ["front", "back"]

@router.get("/recordings")
async def list_recordings(camera: str = "front"):
    camera = camera.lower()
    if camera not in ALLOWED_CAMERAS:
        raise HTTPException(status_code=400, detail=f"Invalid camera. Must be one of: {ALLOWED_CAMERAS}")

    base_folder = f"recordings/{camera}"
    logger.info(f"GET /recordings?camera={camera}")

    if not os.path.exists(base_folder):
        return []

    results = []
    for date_dir in sorted(os.listdir(base_folder), reverse=True):
        date_path = os.path.join(base_folder, date_dir)
        if not os.path.isdir(date_path):
            continue
        try:
            datetime.strptime(date_dir, "%Y-%m-%d")
        except ValueError:
            continue
        for filename in sorted(os.listdir(date_path), reverse=True):
            if not filename.endswith(".mp4"):
                continue
            time_str = filename[:-4]  # strip .mp4
            try:
                dt = datetime.strptime(f"{date_dir} {time_str}", "%Y-%m-%d %H-%M-%S")
            except ValueError:
                continue
            rec_id = f"{camera}_{date_dir}T{time_str}"
            results.append({
                "id": rec_id,
                "camera": camera,
                "timestamp": dt.isoformat(),
            })

    logger.info(f"Returning {len(results)} recordings for camera={camera}")
    return results


@router.get("/camera/{position}")
async def get_camera_stream(position: str):
    logger.info(f"GET /camera/{position} called")
    if position.lower() not in ["front", "back"]:
        logger.error("Invalid camera position requested.")
        raise HTTPException(status_code=400, detail="Invalid camera position")
    response = {
        "Camera": position.capitalize(),
        "WebRTCUrl": f"webrtc://192.168.1.10/stream/{position}_camera"
    }
    logger.info(f"Returning mock WebRTC URL for {position} camera")
    return response

@router.get("/recordings/file")
async def get_recording_file(camera: str, timestamp: str):
    logger.info(f"GET /recordings/file for camera={camera}, timestamp={timestamp}")

    try:
        dt = datetime.fromisoformat(timestamp)
    except ValueError:
        logger.error(f"Invalid timestamp format: {timestamp}")
        raise HTTPException(status_code=400, detail="Invalid timestamp format")

    date_folder = f"recordings/{camera}/{dt.strftime('%Y-%m-%d')}"
    if not os.path.exists(date_folder):
        logger.warning(f"No recordings found for date: {date_folder}")
        raise HTTPException(status_code=404, detail="No recordings found for that date.")

    # Try exact match first
    exact_file = f"{date_folder}/{dt.strftime('%H-%M-%S')}.mp4"
    if os.path.exists(exact_file):
        logger.info(f"Returning exact recording: {exact_file}")
        return FileResponse(exact_file, media_type="video/mp4")

    # Fallback: try last 10 seconds
    for offset in range(1, 11):
        fallback_time = dt - timedelta(seconds=offset)
        fallback_file = f"{date_folder}/{fallback_time.strftime('%H-%M-%S')}.mp4"
        if os.path.exists(fallback_file):
            logger.info(f"Returning fallback recording: {fallback_file}")
            return FileResponse(fallback_file, media_type="video/mp4")

    logger.warning(f"No recording found within 10 seconds before: {timestamp}")
    raise HTTPException(status_code=404, detail="Recording not available for the requested timestamp.")

