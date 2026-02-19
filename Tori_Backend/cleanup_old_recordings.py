from datetime import datetime, timedelta
import os
import shutil

def cleanup_old_recordings(base_path="recordings", days=7):
    cutoff_date = datetime.now().date() - timedelta(days=days)
    for camera in ["front", "back"]:
        cam_path = os.path.join(base_path, camera)
        if not os.path.exists(cam_path):
            continue
        for folder in os.listdir(cam_path):
            folder_path = os.path.join(cam_path, folder)
            try:
                folder_date = datetime.strptime(folder, "%Y-%m-%d").date()
                if folder_date < cutoff_date:
                    shutil.rmtree(folder_path)
                    print(f"Deleted old folder: {folder_path}")
            except ValueError:
                continue  # Skip non-date folders

if __name__ == "__main__":
    cleanup_old_recordings()



