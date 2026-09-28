from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import hashlib
import secrets


app = FastAPI()

DB_NAME = "citizenassist.db"


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
        "name": name
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


def service_reply(message, language):

    # =====================================================
    # ENGLISH
    # =====================================================

    if language == "en-IN":

        if "pm-kisan" in message or "pm kisan" in message:

            if "document" in message:
                return (
                    "For PM-KISAN, you may need Aadhaar, "
                    "bank account details and land-related information."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "PM-KISAN benefits are available to eligible farmer "
                    "families. Check the official PM-KISAN portal for "
                    "the latest eligibility rules."
                )

            if is_step_question(message):
                return (
                    "PM-KISAN application steps:\n\n"
                    "1. Check your eligibility.\n"
                    "2. Keep Aadhaar, mobile and bank details ready.\n"
                    "3. Complete registration on the official portal.\n"
                    "4. Complete eKYC if required.\n"
                    "5. Check your beneficiary and payment status."
                )

            return (
                "PM-KISAN is a government scheme for eligible farmer "
                "families. You can ask about documents, eligibility "
                "or the application process."
            )

        if "ayushman" in message:

            if "document" in message:
                return (
                    "Ayushman Bharat may require identity and "
                    "eligibility-related documents. Check the official "
                    "portal for the current requirements."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "Ayushman Bharat eligibility depends on the applicable "
                    "beneficiary category and government records."
                )

            if is_step_question(message):
                return (
                    "First check your eligibility. Then use the available "
                    "beneficiary or registration service through the official portal."
                )

            return (
                "Ayushman Bharat is a government healthcare scheme. "
                "You can ask about documents, eligibility or application steps."
            )

        if "passport" in message:

            if "document" in message:
                return (
                    "Passport applications may require identity, address "
                    "and date-of-birth documents. Check Passport Seva "
                    "for the exact document list."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "Indian citizens can apply for a passport according "
                    "to the applicable passport rules."
                )

            if is_step_question(message):
                return (
                    "Passport application steps:\n\n"
                    "1. Fill the online application.\n"
                    "2. Submit the required details and documents.\n"
                    "3. Pay the applicable fee.\n"
                    "4. Book an appointment.\n"
                    "5. Complete the verification process."
                )

            return (
                "I can help with passport documents, eligibility "
                "and the application process."
            )

        if "driving licence" in message or "driving license" in message:

            if "document" in message:
                return (
                    "A Driving Licence application may require identity, "
                    "address and age-related documents. Check Parivahan "
                    "for the current requirements."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "Driving Licence eligibility depends on age, "
                    "vehicle category and applicable transport rules."
                )

            if is_step_question(message):
                return (
                    "Driving Licence application steps:\n\n"
                    "1. Open the official Parivahan portal.\n"
                    "2. Enter the required details.\n"
                    "3. Complete the learner licence process if required.\n"
                    "4. Complete the driving test process.\n"
                    "5. Check your application status."
                )

            return (
                "I can help with Driving Licence documents, "
                "eligibility and application steps."
            )

        if "scholarship" in message:

            if "document" in message:
                return (
                    "Scholarship applications may require Aadhaar, "
                    "academic records, bank details and category or "
                    "income-related documents."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "Scholarship eligibility depends on the scheme, "
                    "course, academic performance, income and category."
                )

            if is_step_question(message):
                return (
                    "Scholarship application steps:\n\n"
                    "1. Check the eligibility criteria.\n"
                    "2. Register on the relevant portal.\n"
                    "3. Fill in the application form.\n"
                    "4. Upload the required documents.\n"
                    "5. Submit the form and track the status."
                )

            return (
                "I can help with scholarship documents, eligibility "
                "and application steps."
            )

        return (
            "I can help with PM-KISAN, Ayushman Bharat, Passport, "
            "Driving Licence and Scholarships. "
            "Please mention the service you need."
        )

    # =====================================================
    # HINDI
    # =====================================================

    if language == "hi-IN":

        if "pm-kisan" in message or "pm kisan" in message:

            if "document" in message:
                return (
                    "PM-KISAN के लिए आमतौर पर आधार, बैंक खाते की जानकारी "
                    "और भूमि से संबंधित जानकारी की आवश्यकता हो सकती है।"
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "PM-KISAN का लाभ पात्र किसान परिवारों को मिल सकता है। "
                    "नवीनतम पात्रता के लिए आधिकारिक पोर्टल देखें।"
                )

            if is_step_question(message):
                return (
                    "PM-KISAN आवेदन के मुख्य चरण:\n\n"
                    "1. अपनी पात्रता जांचें।\n"
                    "2. आधार, मोबाइल और बैंक विवरण तैयार रखें।\n"
                    "3. आधिकारिक पोर्टल पर रजिस्ट्रेशन करें।\n"
                    "4. आवश्यक eKYC पूरा करें।\n"
                    "5. लाभार्थी और भुगतान की स्थिति देखें।"
                )

            return (
                "PM-KISAN पात्र किसान परिवारों के लिए सरकारी योजना है। "
                "आप दस्तावेज, पात्रता या आवेदन प्रक्रिया के बारे में पूछ सकते हैं।"
            )

        if "ayushman" in message:

            if "document" in message:
                return (
                    "आयुष्मान भारत के लिए पहचान और पात्रता से जुड़े "
                    "दस्तावेजों की आवश्यकता हो सकती है। सही जानकारी "
                    "आधिकारिक पोर्टल पर जांचें।"
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "आयुष्मान भारत की पात्रता लाभार्थी श्रेणी "
                    "और सरकारी रिकॉर्ड पर निर्भर करती है।"
                )

            if is_step_question(message):
                return (
                    "पहले आयुष्मान भारत के लिए अपनी पात्रता जांचें। "
                    "इसके बाद उपलब्ध लाभार्थी या पंजीकरण सेवा का उपयोग करें।"
                )

            return (
                "आयुष्मान भारत एक सरकारी स्वास्थ्य योजना है। "
                "आप दस्तावेज, पात्रता या आवेदन प्रक्रिया के बारे में पूछ सकते हैं।"
            )

        if "passport" in message:

            if "document" in message:
                return (
                    "पासपोर्ट आवेदन के लिए पहचान, पता और जन्मतिथि से जुड़े "
                    "दस्तावेजों की आवश्यकता हो सकती है। सही सूची के लिए "
                    "Passport Seva पोर्टल देखें।"
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "भारतीय नागरिक लागू पासपोर्ट नियमों के अनुसार "
                    "पासपोर्ट के लिए आवेदन कर सकते हैं।"
                )

            if is_step_question(message):
                return (
                    "पासपोर्ट आवेदन के मुख्य चरण:\n\n"
                    "1. ऑनलाइन आवेदन भरें।\n"
                    "2. आवश्यक जानकारी और दस्तावेज जमा करें।\n"
                    "3. शुल्क का भुगतान करें।\n"
                    "4. अपॉइंटमेंट बुक करें।\n"
                    "5. सत्यापन प्रक्रिया पूरी करें।"
                )

            return (
                "मैं पासपोर्ट के दस्तावेज, पात्रता और आवेदन प्रक्रिया "
                "में मदद कर सकता हूं।"
            )

        if "driving licence" in message or "driving license" in message:

            if "document" in message:
                return (
                    "ड्राइविंग लाइसेंस के लिए पहचान, पता और उम्र से जुड़े "
                    "दस्तावेजों की आवश्यकता हो सकती है। सही जानकारी के लिए "
                    "Parivahan पोर्टल देखें।"
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "ड्राइविंग लाइसेंस की पात्रता उम्र, वाहन श्रेणी "
                    "और लागू परिवहन नियमों पर निर्भर करती है।"
                )

            if is_step_question(message):
                return (
                    "ड्राइविंग लाइसेंस आवेदन के मुख्य चरण:\n\n"
                    "1. आधिकारिक Parivahan पोर्टल खोलें।\n"
                    "2. आवश्यक जानकारी भरें।\n"
                    "3. जरूरत होने पर लर्नर लाइसेंस प्रक्रिया पूरी करें।\n"
                    "4. आवश्यक ड्राइविंग टेस्ट पूरा करें।\n"
                    "5. आवेदन का स्टेटस देखें।"
                )

            return (
                "मैं ड्राइविंग लाइसेंस के दस्तावेज, पात्रता "
                "और आवेदन प्रक्रिया में मदद कर सकता हूं।"
            )

        if "scholarship" in message:

            if "document" in message:
                return (
                    "स्कॉलरशिप के लिए आधार, शैक्षणिक रिकॉर्ड, बैंक विवरण "
                    "और आय या श्रेणी से जुड़े दस्तावेजों की आवश्यकता हो सकती है।"
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "स्कॉलरशिप की पात्रता योजना, कोर्स, शैक्षणिक प्रदर्शन, "
                    "आय और श्रेणी जैसे नियमों पर निर्भर करती है।"
                )

            if is_step_question(message):
                return (
                    "स्कॉलरशिप आवेदन के मुख्य चरण:\n\n"
                    "1. पात्रता जांचें।\n"
                    "2. संबंधित पोर्टल पर रजिस्ट्रेशन करें।\n"
                    "3. आवेदन फॉर्म भरें।\n"
                    "4. आवश्यक दस्तावेज अपलोड करें।\n"
                    "5. आवेदन जमा करके स्टेटस देखें।"
                )

            return (
                "मैं स्कॉलरशिप के दस्तावेज, पात्रता "
                "और आवेदन प्रक्रिया में मदद कर सकता हूं।"
            )

        return (
            "मैं PM-KISAN, आयुष्मान भारत, पासपोर्ट, ड्राइविंग लाइसेंस "
            "और स्कॉलरशिप जैसी सरकारी सेवाओं में मदद कर सकता हूं।"
        )

    # =====================================================
    # MARATHI
    # =====================================================

    if language == "mr-IN":

        if "pm-kisan" in message or "pm kisan" in message:

            if "document" in message:
                return (
                    "PM-KISAN साठी आधार, बँक खात्याची माहिती "
                    "आणि जमिनीशी संबंधित माहिती आवश्यक असू शकते."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "PM-KISAN चा लाभ पात्र शेतकरी कुटुंबांना मिळू शकतो. "
                    "अधिकृत पोर्टलवर नवीनतम पात्रता तपासा."
                )

            if is_step_question(message):
                return (
                    "PM-KISAN अर्जाचे मुख्य टप्पे:\n\n"
                    "1. तुमची पात्रता तपासा.\n"
                    "2. आधार, मोबाइल आणि बँक तपशील तयार ठेवा.\n"
                    "3. अधिकृत पोर्टलवर नोंदणी करा.\n"
                    "4. आवश्यक eKYC पूर्ण करा.\n"
                    "5. लाभार्थी आणि पेमेंट स्टेटस तपासा."
                )

            return (
                "PM-KISAN ही पात्र शेतकरी कुटुंबांसाठी सरकारी योजना आहे. "
                "तुम्ही कागदपत्रे, पात्रता किंवा अर्ज प्रक्रियेबद्दल विचारू शकता."
            )

        if "ayushman" in message:

            if "document" in message:
                return (
                    "आयुष्मान भारतासाठी ओळख आणि पात्रतेशी संबंधित "
                    "कागदपत्रांची आवश्यकता असू शकते."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "आयुष्मान भारताची पात्रता लाभार्थी श्रेणी "
                    "आणि सरकारी नोंदींवर अवलंबून असते."
                )

            if is_step_question(message):
                return (
                    "प्रथम आयुष्मान भारतासाठी तुमची पात्रता तपासा. "
                    "त्यानंतर उपलब्ध लाभार्थी किंवा नोंदणी सेवा वापरा."
                )

            return (
                "आयुष्मान भारत ही सरकारी आरोग्य योजना आहे. "
                "तुम्ही कागदपत्रे, पात्रता किंवा अर्ज प्रक्रियेबद्दल विचारू शकता."
            )

        if "passport" in message:

            if "document" in message:
                return (
                    "पासपोर्ट अर्जासाठी ओळख, पत्ता आणि जन्मतारखेशी संबंधित "
                    "कागदपत्रे आवश्यक असू शकतात. अधिकृत Passport Seva "
                    "पोर्टलवर अचूक माहिती तपासा."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "भारतीय नागरिक लागू पासपोर्ट नियमांनुसार "
                    "पासपोर्टसाठी अर्ज करू शकतात."
                )

            if is_step_question(message):
                return (
                    "पासपोर्ट अर्जाचे मुख्य टप्पे:\n\n"
                    "1. ऑनलाइन अर्ज भरा.\n"
                    "2. आवश्यक माहिती आणि कागदपत्रे जमा करा.\n"
                    "3. शुल्क भरा.\n"
                    "4. अपॉइंटमेंट बुक करा.\n"
                    "5. पडताळणी प्रक्रिया पूर्ण करा."
                )

            return (
                "मी पासपोर्टची कागदपत्रे, पात्रता "
                "आणि अर्ज प्रक्रियेत मदत करू शकतो."
            )

        if "driving licence" in message or "driving license" in message:

            if "document" in message:
                return (
                    "ड्रायव्हिंग लायसन्ससाठी ओळख, पत्ता आणि वयाशी संबंधित "
                    "कागदपत्रे आवश्यक असू शकतात. अधिकृत Parivahan पोर्टल तपासा."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "ड्रायव्हिंग लायसन्सची पात्रता वय, वाहनाचा प्रकार "
                    "आणि लागू वाहतूक नियमांवर अवलंबून असते."
                )

            if is_step_question(message):
                return (
                    "ड्रायव्हिंग लायसन्स अर्जाचे मुख्य टप्पे:\n\n"
                    "1. अधिकृत Parivahan पोर्टल उघडा.\n"
                    "2. आवश्यक माहिती भरा.\n"
                    "3. आवश्यक असल्यास लर्नर लायसन्स प्रक्रिया पूर्ण करा.\n"
                    "4. आवश्यक ड्रायव्हिंग टेस्ट पूर्ण करा.\n"
                    "5. अर्जाचा स्टेटस तपासा."
                )

            return (
                "मी ड्रायव्हिंग लायसन्सची कागदपत्रे, पात्रता "
                "आणि अर्ज प्रक्रियेत मदत करू शकतो."
            )

        if "scholarship" in message:

            if "document" in message:
                return (
                    "शिष्यवृत्तीसाठी आधार, शैक्षणिक रेकॉर्ड, बँक तपशील "
                    "आणि उत्पन्न किंवा श्रेणीशी संबंधित कागदपत्रे आवश्यक असू शकतात."
                )

            if "eligibility" in message or "eligible" in message:
                return (
                    "शिष्यवृत्तीची पात्रता योजना, अभ्यासक्रम, "
                    "शैक्षणिक कामगिरी, उत्पन्न आणि श्रेणीवर अवलंबून असते."
                )

            if is_step_question(message):
                return (
                    "शिष्यवृत्ती अर्जाचे मुख्य टप्पे:\n\n"
                    "1. पात्रता तपासा.\n"
                    "2. संबंधित पोर्टलवर नोंदणी करा.\n"
                    "3. अर्ज भरा.\n"
                    "4. आवश्यक कागदपत्रे अपलोड करा.\n"
                    "5. अर्ज जमा करून स्टेटस तपासा."
                )

            return (
                "मी शिष्यवृत्तीची कागदपत्रे, पात्रता "
                "आणि अर्ज प्रक्रियेत मदत करू शकतो."
            )

        return (
            "मी PM-KISAN, आयुष्मान भारत, पासपोर्ट, ड्रायव्हिंग लायसन्स "
            "आणि शिष्यवृत्ती यांसारख्या सरकारी सेवांमध्ये मदत करू शकतो."
        )

    return (
        "I can help with government services. "
        "Please select a supported language."
    )


# -------------------- Chat --------------------

@app.post("/chat")
def chat(request: ChatRequest):

    message = request.message.strip().lower()
    language = request.language

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

    reply = service_reply(message, language)

    return {
        "reply": reply
    }

    reply = service_reply(
        message,
        request.language
    )

    return {
        "reply": reply
    }
