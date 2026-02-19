
# Tori Backend

Tori is a unified backend system for Raspberry Pi, built with FastAPI. It handles:

- System settings API (`GET`/`PATCH`)
- Live server logs via Server-Sent Events (SSE)
- Camera streaming and MP4 recording
- Automatic cleanup of recordings older than 7 days

## 📦 Requirements

- Python 3.7+
- OpenCV (`opencv-python`)
- Raspberry Pi OS (Debian Bookworm or similar)

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
sudo apt update
sudo apt install python3 python3-pip python3-opencv -y
pip3 install -r requirements.txt
```

### 2. Start the Server

```bash
python3 run.py
```

Or install as a service using systemd:

```bash
sudo cp systemd/recording-server.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable recording-server
sudo systemctl start recording-server
```

### 3. Enable Cleanup Timer

```bash
sudo cp systemd/recording-cleanup.* /etc/systemd/system/
sudo systemctl enable recording-cleanup.timer
sudo systemctl start recording-cleanup.timer
```

---

## 🧪 API Endpoints

### 🔧 Settings API

- `GET /settings` – Get current settings
- `PATCH /settings` – Update system settings

### 📜 Logs API

- `GET /logs?level=INFO|ERROR` – SSE stream of log messages
- Levels:
  - `INFO` – All logs
  - `ERROR` – Only warnings and errors

### 🎥 Camera API

- `GET /camera/front` – Returns mock WebRTC stream URL
- `GET /camera/back` – (Optional second camera)

### ⏪ Recordings API

- `GET /recordings/file?camera=front&timestamp=YYYY-MM-DDTHH:MM:SS`
  - Returns a 10-second MP4 video segment
  - `timestamp` is ISO-8601 format
  - Returns 404 if no video found

---

## 🧹 Cleanup

To manually clean recordings older than 7 days:

```bash
python3 cleanup_old_recordings.py
```

Runs daily via `recording-cleanup.timer`.

---

## 🛠 Structure

```
Tori/
├── app/                # FastAPI app
├── recordings/         # Saved camera segments
├── static/             # Frontend build (React)
├── systemd/            # systemd service and timer files
├── run.py              # Launch script
├── cleanup_old_recordings.py
├── requirements.txt
```

---

## 👋 Author

Built for Raspberry Pi deployments with offline, reliable video capture and telemetry in mind.
