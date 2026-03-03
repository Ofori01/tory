import cv2
import os
import numpy as np
import subprocess
import threading
import time
from datetime import datetime
import asyncio

CAMERA_INDEX = 0
SEGMENT_DURATION = 10  # seconds
FPS = 20.0


def _transcode_to_h264(src: str, logger) -> None:
    """Re-encode an mp4v file to H.264 so every browser can play it.
    Always called in a daemon thread — never blocks the event loop or recording.
    """
    tmp = src + ".tmp.mp4"
    try:
        subprocess.run(
            [
                "ffmpeg", "-y", "-i", src,
                "-c:v", "libx264",
                "-preset", "ultrafast",
                "-movflags", "+faststart",
                tmp,
            ],
            check=True,
            capture_output=True,
        )
        os.replace(tmp, src)
        logger.info(f"Transcoded to H.264: {src}")
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg transcode failed for {src}: {e.stderr.decode()}")
        if os.path.exists(tmp):
            os.remove(tmp)
    except Exception as e:
        logger.error(f"Transcode error for {src}: {e}")
        if os.path.exists(tmp):
            os.remove(tmp)


def _recording_loop(logger) -> None:
    """Runs in a dedicated OS thread so cap.read() never blocks the event loop.
    This ensures full frame rate regardless of how busy the asyncio loop is.
    """
    logger.info("Camera recording thread started.")

    while True:
        cap = None
        try:
            cap = cv2.VideoCapture(CAMERA_INDEX)
            if not cap.isOpened():
                logger.error("Camera could not be opened.")
                time.sleep(5)
                continue

            logger.info("Camera opened. Waiting for valid frames...")

            ret, test_frame = cap.read()
            if not ret or test_frame is None or not np.any(test_frame):
                logger.error("No valid frames received from camera. Skipping.")
                cap.release()
                time.sleep(5)
                continue

            height, width = test_frame.shape[:2]
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')

            while True:
                now = datetime.now()
                date_str = now.strftime("%Y-%m-%d")
                time_str = now.strftime("%H-%M-%S")
                folder = f"recordings/front/{date_str}"
                os.makedirs(folder, exist_ok=True)
                filename = f"{folder}/{time_str}.mp4"

                out = None
                frame_written = False
                start_time = datetime.now()

                while (datetime.now() - start_time).total_seconds() < SEGMENT_DURATION:
                    ret, frame = cap.read()
                    if not ret or frame is None or not np.any(frame):
                        logger.warning("Dropped/blank frame, skipping...")
                        continue

                    if out is None:
                        out = cv2.VideoWriter(filename, fourcc, FPS, (width, height))

                    out.write(frame)
                    frame_written = True

                if out:
                    out.release()

                if not frame_written:
                    if os.path.exists(filename):
                        os.remove(filename)
                        logger.warning(f"No real frames written. Deleted: {filename}")
                else:
                    # Transcode in a separate daemon thread — recording continues immediately
                    t = threading.Thread(
                        target=_transcode_to_h264,
                        args=(filename, logger),
                        daemon=True,
                    )
                    t.start()

        except Exception as e:
            logger.error(f"Exception in recording loop: {e}")
        finally:
            if cap:
                try:
                    cap.release()
                except Exception:
                    pass
            time.sleep(1)


async def start_recording_loop(logger) -> None:
    """Launch the blocking recording loop in a thread pool executor so it
    never blocks the asyncio event loop.
    """
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _recording_loop, logger)
