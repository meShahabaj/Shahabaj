from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import (
    test_router,
    image_editor_router,
    salary_predictor_router,
    chatbot_router,
    face_extractor_router,
    rps_router,
    number_identifier_router,
)

import os

app = FastAPI()


@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"status": "ok"}

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("Registered routes:")
for route in app.routes:
    print(route.path)

# Include FastAPI routers (equivalent to Flask blueprints)
app.include_router(test_router)
app.include_router(image_editor_router)
app.include_router(face_extractor_router)
app.include_router(salary_predictor_router)
app.include_router(chatbot_router)
app.include_router(number_identifier_router)
app.include_router(rps_router)

# For local development
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
