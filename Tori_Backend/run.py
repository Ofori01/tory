import uvicorn
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CERT_DIR = os.path.join(BASE_DIR, "..", "frontend", "cert")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="localhost",
        port=8000,
        reload=False,
        ssl_keyfile=os.path.join(CERT_DIR, "cert.key"),
        ssl_certfile=os.path.join(CERT_DIR, "cert.crt"),
    )

