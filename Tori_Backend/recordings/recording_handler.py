import os
import shutil
import time
import logging
from pyudev import Context, Monitor

SOURCE_FOLDER = "/home/pi/videos"
VIDEO_EXTENSIONS = (".mp4", ".avi", ".mov", ".mkv")

def get_mount_point(device):
    """Get the mount point of the USB device."""
    with open("/proc/mounts", "r") as f:
        for line in f:
            parts = line.split()
            if device in parts[0]:
                return parts[1]
    return None

def copy_videos_to_usb(mount_point):
    logging.info(f"Copying videos to {mount_point}...")
    for filename in os.listdir(SOURCE_FOLDER):
        if filename.lower().endswith(VIDEO_EXTENSIONS):
            src = os.path.join(SOURCE_FOLDER, filename)
            dst = os.path.join(mount_point, filename)
            logging.info(f"Copying {src} -> {dst}")
            try:
                shutil.copy2(src, dst)
            except Exception as e:
                logging.warning(f"Failed to copy {src}: {e}")
    logging.info("✅ Copy complete.")

def monitor_usb():
    context = Context()
    monitor = Monitor.from_netlink(context)
    monitor.filter_by(subsystem='block', device_type='partition')

    logging.info("🔌 USB monitor started, waiting for devices...")

    for device in iter(monitor.poll, None):
        if device.action == 'add':
            logging.info(f"Device added: {device.device_node}")
            time.sleep(2)  # Let OS mount

            mount_point = get_mount_point(device.device_node)
            if mount_point:
                logging.info(f"USB mounted at: {mount_point}")
                copy_videos_to_usb(mount_point)
            else:
                logging.warning("⚠️  USB device not mounted, skipping.")
