import cv2
import os
import numpy as np
from datetime import datetime
import asyncio

CAMERA_INDEX = 0
SEGMENT_DURATION = 10  # seconds
FPS = 20.0

async def start_recording_loop(logger):
    logger.info("Camera recording loop started.")

    while True:
        try:
            cap = cv2.VideoCapture(CAMERA_INDEX)
            if not cap.isOpened():
                logger.error("Camera could not be opened.")
                await asyncio.sleep(5)
                continue

            logger.info("Camera opened. Waiting for valid frames...")

            ret, test_frame = cap.read()
            if not ret or test_frame is None or not np.any(test_frame):
                logger.error("No valid frames received from camera. Skipping segment.")
                cap.release()
                await asyncio.sleep(5)
                continue

            height, width = test_frame.shape[:2]
            fourcc = cv2.VideoWriter_fourcc(*'avc1')

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
                        logger.warning("Dropped frame or blank frame received. Skipping...")
                        await asyncio.sleep(0)
                        continue

                    if out is None:
                        out = cv2.VideoWriter(filename, fourcc, FPS, (width, height))

                    out.write(frame)
                    frame_written = True
                    await asyncio.sleep(0)

                if out:
                    out.release()

                if not frame_written:
                    if os.path.exists(filename):
                        os.remove(filename)
                        logger.warning(f"No real frames written. Deleted: {filename}")
                    else:
                        logger.info("No frames. No file created.")

        except Exception as e:
            logger.error(f"Exception in recording loop: {e}")

        finally:
            try:
                cap.release()
            except Exception:
                pass
            await asyncio.sleep(1)
