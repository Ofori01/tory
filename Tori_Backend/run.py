import uvicorn


# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
#
# # Create the FastAPI app
# app = FastAPI()
#
# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # UI origin
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
# # Import your routes
# import app.main  # make sure this defines endpoints and uses `app` above


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="localhost", port=8000, reload=False)

