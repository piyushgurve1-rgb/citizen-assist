from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
class ChatRequest(BaseModel):
    message: str
    language: str = "en-IN"

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
    language = request.language

    # English
    if language == "en-IN":

        if "pm-kisan" in message or "pm kisan" in message:
            if "document" in message:
                reply = (
                    "For PM-KISAN, commonly required information includes "
                    "Aadhaar, bank account details and land-related information."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "Eligible farmer families can receive benefits under PM-KISAN. "
                    "Please verify the latest eligibility details on the official PM-KISAN portal."
                )
            elif "step" in message or "apply" in message or "how" in message:
                reply = (
                    "For PM-KISAN, provide the required farmer details, "
                    "Aadhaar and bank information and follow the application process "
                    "on the official portal."
                )
            else:
                reply = (
                    "PM-KISAN is a government scheme for eligible farmer families. "
                    "You can ask me about documents, eligibility or application steps."
                )

        elif "ayushman" in message:
            if "document" in message:
                reply = (
                    "Ayushman Bharat may require identity and eligibility-related documents. "
                    "Please verify the exact requirements on the official portal."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "Ayushman Bharat eligibility depends on the applicable beneficiary "
                    "category and government records. Please verify your eligibility officially."
                )
            elif "step" in message or "apply" in message or "how" in message:
                reply = (
                    "First check your eligibility for Ayushman Bharat, "
                    "then use the available registration or beneficiary services."
                )
            else:
                reply = (
                    "Ayushman Bharat is a government healthcare scheme. "
                    "You can ask me about documents, eligibility or application steps."
                )

        elif "passport" in message:
            if "document" in message:
                reply = (
                    "Passport applications may require identity, address and "
                    "date-of-birth related documents. Check the official Passport Seva portal "
                    "for the exact document list."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "Indian citizens can apply for a passport subject to the "
                    "applicable passport rules and requirements."
                )
            elif "step" in message or "apply" in message or "how" in message:
                reply = (
                    "For a passport, fill the online application, submit the required "
                    "documents, book an appointment and complete the verification process."
                )
            else:
                reply = (
                    "I can help you with Passport documents, eligibility and application steps."
                )

        elif "driving licence" in message or "driving license" in message:
            if "document" in message:
                reply = (
                    "Driving Licence applications may require identity, address and "
                    "age-related documents. Check the official Parivahan portal for exact requirements."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "Driving Licence eligibility depends on age, vehicle category "
                    "and applicable transport rules."
                )
            elif "step" in message or "apply" in message or "how" in message:
                reply = (
                    "Apply online, submit the required details, complete the learner "
                    "licence process and follow the applicable driving test process."
                )
            else:
                reply = (
                    "I can help you with Driving Licence documents, eligibility and application steps."
                )

        elif "scholarship" in message:
            if "document" in message:
                reply = (
                    "Scholarship applications may commonly require Aadhaar, academic records, "
                    "bank details and category or income-related documents."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "Scholarship eligibility can depend on the scheme, course, academic performance, "
                    "income and category."
                )
            elif "step" in message or "apply" in message or "how" in message:
                reply = (
                    "Register on the relevant scholarship portal, fill the application form, "
                    "upload the required documents and submit the application."
                )
            else:
                reply = (
                    "I can help you with Scholarship documents, eligibility and application steps."
                )

        else:
            reply = (
                "I can help with PM-KISAN, Ayushman Bharat, Passport, "
                "Driving Licence and Scholarships. Please mention the service you need."
            )

    # Hindi
    elif language == "hi-IN":

        if "pm-kisan" in message or "pm kisan" in message:
            if "document" in message:
                reply = (
                    "PM-KISAN के लिए आमतौर पर आधार, बैंक खाता विवरण "
                    "और भूमि से संबंधित जानकारी की आवश्यकता होती है।"
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "PM-KISAN का लाभ पात्र किसान परिवारों को मिल सकता है। "
                    "नवीनतम पात्रता की जानकारी आधिकारिक PM-KISAN पोर्टल पर जांचें।"
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "PM-KISAN के लिए किसान की जानकारी, आधार और बैंक विवरण "
                    "देकर आधिकारिक पोर्टल पर आवेदन प्रक्रिया पूरी की जा सकती है।"
                )
            else:
                reply = (
                    "PM-KISAN पात्र किसान परिवारों के लिए एक सरकारी योजना है। "
                    "आप दस्तावेज, पात्रता या आवेदन प्रक्रिया के बारे में पूछ सकते हैं।"
                )

        elif "ayushman" in message:
            if "document" in message:
                reply = (
                    "आयुष्मान भारत के लिए पहचान और पात्रता से संबंधित दस्तावेजों "
                    "की आवश्यकता हो सकती है। सही जानकारी आधिकारिक पोर्टल पर जांचें।"
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "आयुष्मान भारत की पात्रता संबंधित लाभार्थी श्रेणी "
                    "और सरकारी रिकॉर्ड पर निर्भर करती है।"
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "पहले आयुष्मान भारत के लिए अपनी पात्रता जांचें, "
                    "फिर उपलब्ध पंजीकरण या लाभार्थी सेवाओं का उपयोग करें।"
                )
            else:
                reply = (
                    "आयुष्मान भारत एक सरकारी स्वास्थ्य योजना है। "
                    "आप दस्तावेज, पात्रता या आवेदन प्रक्रिया के बारे में पूछ सकते हैं।"
                )

        elif "passport" in message:
            if "document" in message:
                reply = (
                    "पासपोर्ट आवेदन के लिए पहचान, पता और जन्मतिथि से संबंधित "
                    "दस्तावेजों की आवश्यकता हो सकती है। सही सूची आधिकारिक Passport Seva पोर्टल पर देखें।"
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "भारतीय नागरिक लागू पासपोर्ट नियमों और आवश्यकताओं के अनुसार "
                    "पासपोर्ट के लिए आवेदन कर सकते हैं।"
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "पासपोर्ट के लिए ऑनलाइन आवेदन भरें, आवश्यक दस्तावेज जमा करें, "
                    "अपॉइंटमेंट बुक करें और सत्यापन प्रक्रिया पूरी करें।"
                )
            else:
                reply = (
                    "मैं पासपोर्ट के दस्तावेज, पात्रता और आवेदन प्रक्रिया में मदद कर सकता हूं।"
                )

        elif "driving licence" in message or "driving license" in message:
            if "document" in message:
                reply = (
                    "ड्राइविंग लाइसेंस के लिए पहचान, पता और उम्र से संबंधित "
                    "दस्तावेजों की आवश्यकता हो सकती है। सही जानकारी आधिकारिक Parivahan पोर्टल पर देखें।"
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "ड्राइविंग लाइसेंस की पात्रता उम्र, वाहन श्रेणी "
                    "और लागू परिवहन नियमों पर निर्भर करती है।"
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "ऑनलाइन आवेदन करें, आवश्यक जानकारी जमा करें, "
                    "लर्नर लाइसेंस प्रक्रिया पूरी करें और लागू ड्राइविंग टेस्ट प्रक्रिया का पालन करें।"
                )
            else:
                reply = (
                    "मैं ड्राइविंग लाइसेंस के दस्तावेज, पात्रता और आवेदन प्रक्रिया में मदद कर सकता हूं।"
                )

        elif "scholarship" in message:
            if "document" in message:
                reply = (
                    "स्कॉलरशिप के लिए आधार, शैक्षणिक रिकॉर्ड, बैंक विवरण "
                    "और श्रेणी या आय से संबंधित दस्तावेजों की आवश्यकता हो सकती है।"
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "स्कॉलरशिप की पात्रता योजना, कोर्स, शैक्षणिक प्रदर्शन, "
                    "आय और श्रेणी जैसे मानदंडों पर निर्भर कर सकती है।"
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "संबंधित स्कॉलरशिप पोर्टल पर रजिस्ट्रेशन करें, "
                    "फॉर्म भरें, दस्तावेज अपलोड करें और आवेदन जमा करें।"
                )
            else:
                reply = (
                    "मैं स्कॉलरशिप के दस्तावेज, पात्रता और आवेदन प्रक्रिया में मदद कर सकता हूं।"
                )

        else:
            reply = (
                "मैं PM-KISAN, आयुष्मान भारत, पासपोर्ट, "
                "ड्राइविंग लाइसेंस और स्कॉलरशिप जैसी सरकारी सेवाओं में मदद कर सकता हूं।"
            )

    # Marathi
    elif language == "mr-IN":

        if "pm-kisan" in message or "pm kisan" in message:
            if "document" in message:
                reply = (
                    "PM-KISAN साठी सामान्यतः आधार, बँक खात्याची माहिती "
                    "आणि जमिनीशी संबंधित माहिती आवश्यक असते."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "PM-KISAN चा लाभ पात्र शेतकरी कुटुंबांना मिळू शकतो. "
                    "अधिकृत PM-KISAN पोर्टलवर पात्रतेची माहिती तपासा."
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "PM-KISAN साठी शेतकऱ्याची माहिती, आधार आणि बँक तपशील "
                    "देऊन अधिकृत पोर्टलवर अर्ज प्रक्रिया पूर्ण करता येते."
                )
            else:
                reply = (
                    "PM-KISAN ही पात्र शेतकरी कुटुंबांसाठी सरकारी योजना आहे. "
                    "तुम्ही कागदपत्रे, पात्रता किंवा अर्ज प्रक्रियेबद्दल विचारू शकता."
                )

        elif "ayushman" in message:
            if "document" in message:
                reply = (
                    "आयुष्मान भारतासाठी ओळख आणि पात्रतेशी संबंधित कागदपत्रांची "
                    "आवश्यकता असू शकते. अधिकृत पोर्टलवर अचूक माहिती तपासा."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "आयुष्मान भारताची पात्रता लाभार्थी श्रेणी "
                    "आणि सरकारी नोंदींवर अवलंबून असते."
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "प्रथम आयुष्मान भारतासाठी तुमची पात्रता तपासा आणि "
                    "त्यानंतर उपलब्ध नोंदणी किंवा लाभार्थी सेवांचा वापर करा."
                )
            else:
                reply = (
                    "आयुष्मान भारत ही सरकारी आरोग्य योजना आहे. "
                    "तुम्ही कागदपत्रे, पात्रता किंवा अर्ज प्रक्रियेबद्दल विचारू शकता."
                )

        elif "passport" in message:
            if "document" in message:
                reply = (
                    "पासपोर्ट अर्जासाठी ओळख, पत्ता आणि जन्मतारखेशी संबंधित "
                    "कागदपत्रांची आवश्यकता असू शकते. अधिकृत Passport Seva पोर्टलवर अचूक यादी तपासा."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "भारतीय नागरिक लागू पासपोर्ट नियम आणि आवश्यकतांनुसार "
                    "पासपोर्टसाठी अर्ज करू शकतात."
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "पासपोर्टसाठी ऑनलाइन अर्ज भरा, आवश्यक कागदपत्रे जमा करा, "
                    "अपॉइंटमेंट बुक करा आणि पडताळणी प्रक्रिया पूर्ण करा."
                )
            else:
                reply = (
                    "मी पासपोर्टची कागदपत्रे, पात्रता आणि अर्ज प्रक्रियेत मदत करू शकतो."
                )

        elif "driving licence" in message or "driving license" in message:
            if "document" in message:
                reply = (
                    "ड्रायव्हिंग लायसन्ससाठी ओळख, पत्ता आणि वयाशी संबंधित "
                    "कागदपत्रांची आवश्यकता असू शकते. अधिकृत Parivahan पोर्टलवर माहिती तपासा."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "ड्रायव्हिंग लायसन्सची पात्रता वय, वाहनाचा प्रकार "
                    "आणि लागू वाहतूक नियमांवर अवलंबून असते."
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "ऑनलाइन अर्ज करा, आवश्यक माहिती जमा करा, "
                    "लर्नर लायसन्स प्रक्रिया पूर्ण करा आणि लागू ड्रायव्हिंग टेस्ट प्रक्रिया पूर्ण करा."
                )
            else:
                reply = (
                    "मी ड्रायव्हिंग लायसन्सची कागदपत्रे, पात्रता आणि अर्ज प्रक्रियेत मदत करू शकतो."
                )

        elif "scholarship" in message:
            if "document" in message:
                reply = (
                    "शिष्यवृत्तीसाठी आधार, शैक्षणिक रेकॉर्ड, बँक तपशील "
                    "आणि श्रेणी किंवा उत्पन्नाशी संबंधित कागदपत्रांची आवश्यकता असू शकते."
                )
            elif "eligibility" in message or "eligible" in message:
                reply = (
                    "शिष्यवृत्तीची पात्रता योजना, अभ्यासक्रम, शैक्षणिक कामगिरी, "
                    "उत्पन्न आणि श्रेणी यांसारख्या निकषांवर अवलंबून असू शकते."
                )
            elif "step" in message or "apply" in message or "kaise" in message:
                reply = (
                    "संबंधित शिष्यवृत्ती पोर्टलवर नोंदणी करा, "
                    "अर्ज भरा, कागदपत्रे अपलोड करा आणि अर्ज जमा करा."
                )
            else:
                reply = (
                    "मी शिष्यवृत्तीची कागदपत्रे, पात्रता आणि अर्ज प्रक्रियेत मदत करू शकतो."
                )

        else:
            reply = (
                "मी PM-KISAN, आयुष्मान भारत, पासपोर्ट, "
                "ड्रायव्हिंग लायसन्स आणि शिष्यवृत्ती यांसारख्या सरकारी सेवांमध्ये मदत करू शकतो."
            )

    else:
        reply = (
            "I can help with government services. "
            "Please select a supported language."
        )

    return {
        "reply": reply
    }