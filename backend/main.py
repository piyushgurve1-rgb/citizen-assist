from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
class ChatRequest(BaseModel):
    message: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "CitizenAssist backend is running"
    }
@app.post("/chat")
def chat(request: ChatRequest):
    message = request.message.lower()

    if "pm-kisan" in message or "pm kisan" in message:
        reply = (
            "PM-KISAN is a government scheme for eligible farmer families. "
            "I can help you with documents, eligibility and application steps."
        )

    elif "ayushman" in message:
        reply = (
            "Ayushman Bharat is a government healthcare scheme. "
            "I can help you with eligibility, documents and application information."
        )

    elif "passport" in message:
        reply = (
            "I can help you with Passport application information, "
            "required documents, eligibility and application steps."
        )

    elif "driving licence" in message or "driving license" in message:
        reply = (
            "I can help you with Driving Licence information, "
            "required documents, eligibility and application steps."
        )

    elif "scholarship" in message:
        reply = (
            "I can help you with Scholarship information, "
            "eligibility, required documents and application steps."
        )

    else:
        reply = (
            "I can help you with government services such as PM-KISAN, "
            "Ayushman Bharat, Passport, Driving Licence and Scholarships. "
            "Please mention the service you need."
        )

    return {
        "reply": reply
    }