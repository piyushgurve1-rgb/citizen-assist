from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from groq import Groq
import sqlite3
import hashlib
import secrets
import os


app = FastAPI()
load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
groq_api_key = os.getenv("GROQ_API_KEY")

gemini_client = genai.Client(api_key=gemini_api_key)
groq_client = Groq(api_key=groq_api_key)

DB_NAME = "citizenassist.db"
# -------------------- Local Knowledge Base --------------------

LOCAL_SERVICES = {
    "pan": {
        "documents": (
            "PAN card ke liye identity proof, address proof aur date of birth "
            "proof ki zarurat hoti hai. Aadhaar card kai cases me in proofs "
            "ke liye use kiya ja sakta hai."
        ),
        "apply": (
            "PAN card ke liye online application Protean (NSDL), UTIITSL "
            "ya Income Tax e-Filing ke official services ke through ki ja sakti hai."
        ),
        "general": (
            "PAN ek 10-character alphanumeric Permanent Account Number hai "
            "jo Income Tax Department issue karta hai."
        )
    },

    "aadhaar": {
        "documents": (
            "Aadhaar enrolment ke liye identity aur address proof jaise "
            "valid supporting documents ki zarurat ho sakti hai. "
            "Latest requirements UIDAI ke official portal par verify karein."
        ),
        "apply": (
            "Naya Aadhaar banwane ke liye authorized Aadhaar enrolment centre "
            "par jaana hota hai. Biometric details aur required documents "
            "verify kiye jaate hain."
        ),
        "general": (
            "Aadhaar UIDAI dwara issue kiya gaya 12-digit identification number hai."
        )
    },

    "voter": {
        "documents": (
            "Voter registration ke liye identity proof, age proof aur "
            "residence proof jaise documents ki zarurat ho sakti hai."
        ),
        "apply": (
            "Naye voter registration ke liye Election Commission ke official "
            "voter services portal par Form 6 ke through application ki ja sakti hai."
        ),
        "general": (
            "Voter ID ya EPIC Election Commission of India dwara registered "
            "electors ko issue kiya jaata hai."
        )
    },

    "passport": {
        "documents": (
            "Passport application me identity, address aur date-of-birth "
            "proof jaise documents required ho sakte hain."
        ),
        "apply": (
            "Passport ke liye Passport Seva portal par registration karke "
            "application submit ki ja sakti hai."
        ),
        "general": (
            "Passport ek government-issued travel document hai jo international "
            "travel ke liye use hota hai."
        )
    },

    "driving licence": {
        "documents": (
            "Driving Licence application ke liye identity, address aur age "
            "proof jaise documents required ho sakte hain."
        ),
        "apply": (
            "Driving Licence ke liye Parivahan/Sarathi portal ke through "
            "application process start ki ja sakti hai."
        ),
        "general": (
            "Driving Licence kisi vyakti ko specified category ke motor vehicle "
            "ko legally drive karne ki permission deta hai."
        )
    },

    "income certificate": {
        "documents": (
            "Income Certificate ke liye identity proof, address proof aur "
            "income-related supporting documents required ho sakte hain. "
            "Requirements state ke according change ho sakti hain."
        ),
        "apply": (
            "Income Certificate ke liye apne state ke official e-District "
            "ya revenue portal par application process check karein."
        ),
        "general": (
            "Income Certificate kisi vyakti ya family ki declared income "
            "ko officially establish karne ke liye use hota hai."
        )
    },

    "caste certificate": {
        "documents": (
            "Caste Certificate ke liye identity proof, address proof aur "
            "caste-related supporting documents required ho sakte hain. "
            "Exact requirements state ke according change hoti hain."
        ),
        "apply": (
            "Caste Certificate ke liye apne state ke official e-District "
            "ya revenue portal par application karein."
        ),
        "general": (
            "Caste Certificate kisi vyakti ki officially recorded caste "
            "category ko establish karta hai."
        )
    }
}

def get_local_answer(message, language):
    message = message.lower()

    service = None

    # Service detection
    if "pan" in message:
        service = "pan"

    elif "aadhaar" in message or "aadhar" in message:
        service = "aadhaar"

    elif "voter" in message:
        service = "voter"

    elif "passport" in message:
        service = "passport"

    elif "driving licence" in message or "driving license" in message:
        service = "driving licence"

    elif "income certificate" in message:
        service = "income certificate"

    elif "caste certificate" in message:
        service = "caste certificate"

    # Service not found
    if not service:
        if language == "hi-IN":
            return (
                "कृपया किसी सरकारी सेवा का नाम बताएं, जैसे PAN, "
                "Aadhaar, Voter ID, Passport, Driving Licence, "
                "Income Certificate या Caste Certificate."
            )

        elif language == "mr-IN":
            return (
                "कृपया सरकारी सेवेचे नाव सांगा, जसे PAN, Aadhaar, "
                "Voter ID, Passport, Driving Licence, Income Certificate "
                "किंवा Caste Certificate."
            )

        return (
            "Please mention a government service such as PAN, Aadhaar, "
            "Voter ID, Passport, Driving Licence, Income Certificate "
            "or Caste Certificate."
        )

    data = LOCAL_SERVICES[service]

    # Document question
    if (
        "document" in message
        or "documents" in message
        or "proof" in message
        or "दस्तावेज" in message
        or "कागज" in message
        or "कागदपत्र" in message
    ):
        return data["documents"]

    # Application / process question
    if (
        "apply" in message
        or "application" in message
        or "how" in message
        or "process" in message
        or "step" in message
        or "steps" in message
        or "आवेदन" in message
        or "कैसे" in message
        or "कसे" in message
    ):
        return data["apply"]

    # General question
    return data["general"]


# -------------------- Models --------------------

class ChatRequest(BaseModel):
    message: str
    language: str = "en-IN"
    service: str | None = None


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# -------------------- Database --------------------

def get_connection():
    return sqlite3.connect(DB_NAME)


def init_db():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


def hash_password(password, salt):
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100000
    ).hex()


init_db()

# -------------------- AI Response --------------------

def generate_ai_response(prompt, message="", language="en-IN"):
    # 1. Groq - Primary
    try:
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=700,
            timeout=5
        )

        answer = response.choices[0].message.content

        if answer:
            print("AI Provider: Groq")
            return answer

    except Exception as e:
        print("Groq failed:", type(e).__name__)

    # 2. Gemini 3.5 Flash-Lite - Secondary
    try:
        response = gemini_client.interactions.create(
            model="gemini-3.5-flash-lite",
            input=prompt
        )

        if response.output_text:
            print("AI Provider: Gemini 3.5 Flash-Lite")
            return response.output_text

    except Exception as e:
        print("Gemini Flash-Lite failed:", type(e).__name__)

    # 3. Gemini 3.8 Flash - Last AI fallback
    try:
        response = gemini_client.interactions.create(
            model="gemini-3.8-flash",
            input=prompt,
            timeout=2
        )

        if response.output_text:
            print("AI Provider: Gemini 3.8 Flash")
            return response.output_text

    except Exception as e:
        print("Gemini 3.8 failed:", type(e).__name__)

    # 4. Final local fallback
    print("AI Provider: Local fallback")
    return get_local_answer(message, language)


# -------------------- CORS --------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# -------------------- Home --------------------

@app.get("/")
def home():
    return {
        "message": "CitizenAssist backend is running"
    }


# -------------------- Register --------------------

@app.post("/register")
def register(request: RegisterRequest):

    name = request.name.strip()
    email = request.email.strip().lower()
    password = request.password

    if not name or not email or not password:
        return {
            "success": False,
            "message": "All fields are required."
        }

    if len(password) < 6:
        return {
            "success": False,
            "message": "Password must be at least 6 characters."
        }

    salt = secrets.token_bytes(16)
    password_hash = hash_password(password, salt)

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users
            (name, email, password_hash, salt)
            VALUES (?, ?, ?, ?)
            """,
            (
                name,
                email,
                password_hash,
                salt.hex()
            )
        )

        connection.commit()

    except sqlite3.IntegrityError:
        connection.close()

        return {
            "success": False,
            "message": "An account with this email already exists."
        }

    connection.close()

    return {
        "success": True,
        "message": "Account created successfully."
    }


# -------------------- Login --------------------

@app.post("/login")
def login(request: LoginRequest):

    email = request.email.strip().lower()
    password = request.password

    if not email or not password:
        return {
            "success": False,
            "message": "Email and password are required."
        }

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT name, password_hash, salt
        FROM users
        WHERE email = ?
        """,
        (email,)
    )

    user = cursor.fetchone()
    connection.close()

    if user is None:
        return {
            "success": False,
            "message": "Invalid email or password."
        }

    name, saved_hash, saved_salt = user

    salt = bytes.fromhex(saved_salt)
    password_hash = hash_password(password, salt)

    if password_hash != saved_hash:
        return {
            "success": False,
            "message": "Invalid email or password."
        }

    return {
    "success": True,
    "message": "Login successful.",
    "name": name,
    "email": email
}


# -------------------- Official Websites --------------------

def get_website(message):

    if "pm-kisan" in message or "pm kisan" in message:
        return "https://pmkisan.gov.in/"

    if "ayushman" in message:
        return "https://nha.gov.in/"

    if "passport" in message:
        return "https://www.passportindia.gov.in/"

    if "driving licence" in message or "driving license" in message:
        return "https://parivahan.gov.in/"

    if "scholarship" in message:
        return "https://scholarships.gov.in/"

    return None


# -------------------- Chat Helpers --------------------

def is_step_question(message):
    words = [
        "step",
        "steps",
        "apply",
        "application",
        "process",
        "how",
        "kaise"
    ]

    return any(word in message for word in words)



    
# -------------------- Chat --------------------

@app.post("/chat")
def chat(request: ChatRequest):

    message = request.message.strip().lower()
    language = request.language
    # Hindi / Marathi voice intent normalization
    message = (
        message
        .replace("स्टेप्स", "steps")
        .replace("स्टेप", "step")
        .replace("प्रक्रिया", "process")
        .replace("आवेदन कैसे करें", "how apply")
        .replace("कैसे आवेदन करें", "how apply")
        .replace("कैसे करें", "how")
        .replace("कैसे", "how")
        .replace("दस्तावेज़", "documents")
        .replace("दस्तावेज", "documents")
        .replace("कागज़", "documents")
        .replace("कागज", "documents")
        .replace("पात्रता", "eligibility")
        .replace("पात्र", "eligible")
        .replace("कागदपत्रे", "documents")
        .replace("कागदपत्र", "documents")
        .replace("कसे करायचे", "how")
        .replace("कसे", "how")
    )

    if request.service:
        message = request.service.lower() + " " + message

    # PAN number format question
    if (
        "pan number kitne" in message
        or "pan kitne" in message
        or "pan format" in message
        or "pan characters" in message
        or "pan digits" in message
    ):

        if language == "hi-IN":
            reply = (
                "PAN number आमतौर पर 10 characters का होता है, "
                "जिसमें letters और numbers शामिल होते हैं।"
            )

        elif language == "mr-IN":
            reply = (
                "PAN number साधारणपणे 10 characters चा असतो, "
                "ज्यामध्ये letters आणि numbers असतात."
            )

        else:
            reply = (
                "A PAN number is generally 10 characters long "
                "and contains both letters and numbers."
            )

        return {
            "reply": reply
        }

    website_requested = (
        "official website" in message
        or "official site" in message
        or "website" in message
    )

    if website_requested:

        website = get_website(message)

        if website:
            return {
                "reply": f"Official website: {website}"
            }

        return {
            "reply": "Please mention the government service whose official website you need."
        }

    # General questions → Gemini AI
    prompt = f"""
You are CitizenAssist, a government-service assistant for Indian citizens.

User language: {language}

Answer ONLY the user's actual question.

Rules:
- Stay strictly on the asked topic.
- Do not introduce another government service unless the user asks about it.
- Keep the answer short and practical.
- Use simple language.
- If steps are needed, give numbered steps.
- If documents are asked, give only the relevant documents.
- Do not invent fees, deadlines, eligibility rules, or official links.
- Never guess eligibility criteria, income limits, benefit amounts,
  document requirements, or deadlines.
- Never invent numerical limits or amounts.
- If information may be outdated or uncertain, tell the user to verify it
  on the relevant official government website.
- Do not answer multiple possible interpretations of the question.
- Do not add unrelated information.
- When the user asks about eligibility, explain the applicable eligibility
  criteria directly instead of only telling them how to check eligibility.
- If the exact eligibility criteria are not available or cannot be verified,
  clearly say that and direct the user to the official government source.
  - For eligibility questions, answer only with eligibility criteria.
- Do not include documents, application steps, benefits, fees, or deadlines
  unless the user specifically asks for them.
- Treat eligibility criteria as factual information that must be verified;
  if the exact current criteria are uncertain, say so instead of guessing.
  Verified information rule:
- For government-service eligibility, use only eligibility facts explicitly provided
  in the conversation/context.
- If a specific eligibility fact is not provided, do not guess or invent it.
- Do not add land limits, income limits, Aadhaar requirements, exclusions,
  benefit amounts, or other numerical criteria from memory.
- If verified information is insufficient, say that the exact current eligibility
  should be checked on the official government portal.
User question:
{message}
"""

    reply = generate_ai_response(
    prompt,
    message=message,
    language=language
)

    return {
        "reply": reply
    }
