from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


class ChatRequest(BaseModel):
    message: str
    language: str = "en-IN"
    service: str | None = None


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

    message = request.message.lower().strip()
    service = request.service

    # Add selected service to the message
    if service:
        message = f"{service.lower()} {message}"

    # Website intent
    wants_website = (
        "official website" in message
        or "official site" in message
        or "website" in message
    )

    language = request.language

    # =========================================================
    # OFFICIAL WEBSITE
    # =========================================================

    if wants_website:

        if "pm-kisan" in message or "pm kisan" in message:
            reply = (
                "Official PM-KISAN website: "
                "https://pmkisan.gov.in/"
            )

        elif "ayushman" in message:
            reply = (
                "Official Ayushman Bharat website: "
                "https://nha.gov.in/"
            )

        elif "passport" in message:
            reply = (
                "Official Passport Seva website: "
                "https://www.passportindia.gov.in/"
            )

        elif "driving licence" in message or "driving license" in message:
            reply = (
                "Official Parivahan website: "
                "https://parivahan.gov.in/"
            )

        elif "scholarship" in message:
            reply = (
                "Official National Scholarship Portal: "
                "https://scholarships.gov.in/"
            )

        else:
            reply = (
                "Please mention the government service whose "
                "official website you need."
            )

    # =========================================================
    # ENGLISH
    # =========================================================

    elif language == "en-IN":

        # -----------------------------------------------------
        # PM-KISAN
        # -----------------------------------------------------

        if "pm-kisan" in message or "pm kisan" in message:

            if "document" in message:

                reply = (
                    "For PM-KISAN, commonly required information includes "
                    "Aadhaar, bank account details and land-related information."
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "Eligible farmer families can receive benefits under PM-KISAN. "
                    "Please verify the latest eligibility details on the official "
                    "PM-KISAN portal."
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "how",
                ]
            ):

                reply = (
                    "PM-KISAN basic application steps:\n\n"
                    "1. Check your eligibility for PM-KISAN.\n"
                    "2. Keep your Aadhaar, mobile and bank details ready.\n"
                    "3. Complete the registration process through the official "
                    "PM-KISAN portal.\n"
                    "4. Complete the required eKYC process.\n"
                    "5. Check your beneficiary and payment status.\n\n"
                    "You can ask about any specific step for more information."
                )

            else:

                reply = (
                    "PM-KISAN is a government scheme for eligible farmer families. "
                    "You can ask me about documents, eligibility or application steps."
                )

        # -----------------------------------------------------
        # AYUSHMAN BHARAT
        # -----------------------------------------------------

        elif "ayushman" in message:

            if "document" in message:

                reply = (
                    "Ayushman Bharat may require identity and "
                    "eligibility-related documents. "
                    "Please verify the exact requirements on the official portal."
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "Ayushman Bharat eligibility depends on the applicable "
                    "beneficiary category and government records. "
                    "Please verify your eligibility officially."
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "how",
                ]
            ):

                reply = (
                    "First check your eligibility for Ayushman Bharat, "
                    "then use the available registration or beneficiary services."
                )

            else:

                reply = (
                    "Ayushman Bharat is a government healthcare scheme. "
                    "You can ask me about documents, eligibility or application steps."
                )

        # -----------------------------------------------------
        # PASSPORT
        # -----------------------------------------------------

        elif "passport" in message:

            if "document" in message:

                reply = (
                    "Passport applications may require identity, address and "
                    "date-of-birth related documents. Check the official "
                    "Passport Seva portal for the exact document list."
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "Indian citizens can apply for a passport subject to the "
                    "applicable passport rules and requirements."
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "how",
                ]
            ):

                reply = (
                    "For a passport:\n\n"
                    "1. Fill the online passport application.\n"
                    "2. Submit the required details and documents.\n"
                    "3. Pay the applicable fee.\n"
                    "4. Book an appointment at the required Passport Seva centre.\n"
                    "5. Complete the verification process.\n\n"
                    "You can ask me about passport documents or eligibility."
                )

            else:

                reply = (
                    "I can help you with Passport documents, "
                    "eligibility and application steps."
                )

        # -----------------------------------------------------
        # DRIVING LICENCE
        # -----------------------------------------------------

        elif "driving licence" in message or "driving license" in message:

            if "document" in message:

                reply = (
                    "Driving Licence applications may require identity, "
                    "address and age-related documents. "
                    "Check the official Parivahan portal for exact requirements."
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "Driving Licence eligibility depends on age, "
                    "vehicle category and applicable transport rules."
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "how",
                ]
            ):

                reply = (
                    "Driving Licence application steps:\n\n"
                    "1. Apply through the official Parivahan portal.\n"
                    "2. Enter the required personal and vehicle details.\n"
                    "3. Complete the learner licence process where applicable.\n"
                    "4. Complete the required driving test process.\n"
                    "5. Check the application status and licence details."
                )

            else:

                reply = (
                    "I can help you with Driving Licence documents, "
                    "eligibility and application steps."
                )

        # -----------------------------------------------------
        # SCHOLARSHIP
        # -----------------------------------------------------

        elif "scholarship" in message:

            if "document" in message:

                reply = (
                    "Scholarship applications may commonly require Aadhaar, "
                    "academic records, bank details and category or "
                    "income-related documents."
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "Scholarship eligibility can depend on the scheme, course, "
                    "academic performance, income and category."
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "how",
                ]
            ):

                reply = (
                    "Scholarship application steps:\n\n"
                    "1. Check the eligibility criteria for the scholarship.\n"
                    "2. Register on the relevant scholarship portal.\n"
                    "3. Fill in the application form.\n"
                    "4. Upload the required documents.\n"
                    "5. Submit the application and track its status."
                )

            else:

                reply = (
                    "I can help you with Scholarship documents, "
                    "eligibility and application steps."
                )

        # -----------------------------------------------------
        # ENGLISH FALLBACK
        # -----------------------------------------------------

        else:

            reply = (
                "I can help with PM-KISAN, Ayushman Bharat, Passport, "
                "Driving Licence and Scholarships. "
                "Please mention the service you need."
            )

    # =========================================================
    # HINDI
    # =========================================================

    elif language == "hi-IN":

        # PM-KISAN
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

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "PM-KISAN के लिए आवेदन के मुख्य चरण:\n\n"
                    "1. PM-KISAN के लिए अपनी पात्रता जांचें।\n"
                    "2. आधार, मोबाइल और बैंक विवरण तैयार रखें।\n"
                    "3. आधिकारिक PM-KISAN पोर्टल पर पंजीकरण प्रक्रिया पूरी करें।\n"
                    "4. आवश्यक eKYC प्रक्रिया पूरी करें।\n"
                    "5. लाभार्थी और भुगतान की स्थिति जांचें।"
                )

            else:

                reply = (
                    "PM-KISAN पात्र किसान परिवारों के लिए एक सरकारी योजना है। "
                    "आप दस्तावेज, पात्रता या आवेदन प्रक्रिया के बारे में पूछ सकते हैं।"
                )

        # Ayushman
        elif "ayushman" in message:

            if "document" in message:

                reply = (
                    "आयुष्मान भारत के लिए पहचान और पात्रता से संबंधित "
                    "दस्तावेजों की आवश्यकता हो सकती है। "
                    "सही जानकारी आधिकारिक पोर्टल पर जांचें।"
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "आयुष्मान भारत की पात्रता संबंधित लाभार्थी श्रेणी "
                    "और सरकारी रिकॉर्ड पर निर्भर करती है।"
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "पहले आयुष्मान भारत के लिए अपनी पात्रता जांचें, "
                    "फिर उपलब्ध पंजीकरण या लाभार्थी सेवाओं का उपयोग करें।"
                )

            else:

                reply = (
                    "आयुष्मान भारत एक सरकारी स्वास्थ्य योजना है। "
                    "आप दस्तावेज, पात्रता या आवेदन प्रक्रिया के बारे में पूछ सकते हैं।"
                )

        # Passport
        elif "passport" in message:

            if "document" in message:

                reply = (
                    "पासपोर्ट आवेदन के लिए पहचान, पता और जन्मतिथि से संबंधित "
                    "दस्तावेजों की आवश्यकता हो सकती है। "
                    "सही सूची आधिकारिक Passport Seva पोर्टल पर देखें।"
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "भारतीय नागरिक लागू पासपोर्ट नियमों और आवश्यकताओं के अनुसार "
                    "पासपोर्ट के लिए आवेदन कर सकते हैं।"
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "पासपोर्ट आवेदन के मुख्य चरण:\n\n"
                    "1. ऑनलाइन आवेदन फॉर्म भरें।\n"
                    "2. आवश्यक दस्तावेज जमा करें।\n"
                    "3. अपॉइंटमेंट बुक करें।\n"
                    "4. निर्धारित केंद्र पर जाएं।\n"
                    "5. सत्यापन प्रक्रिया पूरी करें।"
                )

            else:

                reply = (
                    "मैं पासपोर्ट के दस्तावेज, पात्रता और आवेदन प्रक्रिया में मदद कर सकता हूं।"
                )

        # Driving Licence
        elif "driving licence" in message or "driving license" in message:

            if "document" in message:

                reply = (
                    "ड्राइविंग लाइसेंस के लिए पहचान, पता और उम्र से संबंधित "
                    "दस्तावेजों की आवश्यकता हो सकती है। "
                    "सही जानकारी आधिकारिक Parivahan पोर्टल पर देखें।"
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "ड्राइविंग लाइसेंस की पात्रता उम्र, वाहन श्रेणी "
                    "और लागू परिवहन नियमों पर निर्भर करती है।"
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "ड्राइविंग लाइसेंस आवेदन के मुख्य चरण:\n\n"
                    "1. आधिकारिक Parivahan पोर्टल पर आवेदन करें।\n"
                    "2. आवश्यक जानकारी भरें।\n"
                    "3. लर्नर लाइसेंस प्रक्रिया पूरी करें।\n"
                    "4. आवश्यक ड्राइविंग टेस्ट पूरा करें।\n"
                    "5. आवेदन की स्थिति जांचें।"
                )

            else:

                reply = (
                    "मैं ड्राइविंग लाइसेंस के दस्तावेज, पात्रता "
                    "और आवेदन प्रक्रिया में मदद कर सकता हूं।"
                )

        # Scholarship
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

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "स्कॉलरशिप आवेदन के मुख्य चरण:\n\n"
                    "1. स्कॉलरशिप की पात्रता जांचें।\n"
                    "2. संबंधित पोर्टल पर रजिस्ट्रेशन करें।\n"
                    "3. आवेदन फॉर्म भरें।\n"
                    "4. आवश्यक दस्तावेज अपलोड करें।\n"
                    "5. आवेदन जमा करके उसका स्टेटस ट्रैक करें।"
                )

            else:

                reply = (
                    "मैं स्कॉलरशिप के दस्तावेज, पात्रता "
                    "और आवेदन प्रक्रिया में मदद कर सकता हूं।"
                )

        else:

            reply = (
                "मैं PM-KISAN, आयुष्मान भारत, पासपोर्ट, "
                "ड्राइविंग लाइसेंस और स्कॉलरशिप जैसी सरकारी सेवाओं में मदद कर सकता हूं।"
            )

    # =========================================================
    # MARATHI
    # =========================================================

    elif language == "mr-IN":

        # PM-KISAN
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

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "PM-KISAN अर्जाचे मुख्य टप्पे:\n\n"
                    "1. PM-KISAN साठी तुमची पात्रता तपासा.\n"
                    "2. आधार, मोबाइल आणि बँक तपशील तयार ठेवा.\n"
                    "3. अधिकृत PM-KISAN पोर्टलवर नोंदणी करा.\n"
                    "4. आवश्यक eKYC प्रक्रिया पूर्ण करा.\n"
                    "5. लाभार्थी आणि पेमेंट स्टेटस तपासा."
                )

            else:

                reply = (
                    "PM-KISAN ही पात्र शेतकरी कुटुंबांसाठी सरकारी योजना आहे. "
                    "तुम्ही कागदपत्रे, पात्रता किंवा अर्ज प्रक्रियेबद्दल विचारू शकता."
                )

        # Ayushman
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

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "प्रथम आयुष्मान भारतासाठी तुमची पात्रता तपासा आणि "
                    "त्यानंतर उपलब्ध नोंदणी किंवा लाभार्थी सेवांचा वापर करा."
                )

            else:

                reply = (
                    "आयुष्मान भारत ही सरकारी आरोग्य योजना आहे. "
                    "तुम्ही कागदपत्रे, पात्रता किंवा अर्ज प्रक्रियेबद्दल विचारू शकता."
                )

        # Passport
        elif "passport" in message:

            if "document" in message:

                reply = (
                    "पासपोर्ट अर्जासाठी ओळख, पत्ता आणि जन्मतारखेशी संबंधित "
                    "कागदपत्रांची आवश्यकता असू शकते. "
                    "अधिकृत Passport Seva पोर्टलवर अचूक यादी तपासा."
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "भारतीय नागरिक लागू पासपोर्ट नियम आणि आवश्यकतांनुसार "
                    "पासपोर्टसाठी अर्ज करू शकतात."
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "पासपोर्ट अर्जाचे मुख्य टप्पे:\n\n"
                    "1. ऑनलाइन अर्ज भरा.\n"
                    "2. आवश्यक कागदपत्रे जमा करा.\n"
                    "3. अपॉइंटमेंट बुक करा.\n"
                    "4. निर्धारित केंद्रावर जा.\n"
                    "5. पडताळणी प्रक्रिया पूर्ण करा."
                )

            else:

                reply = (
                    "मी पासपोर्टची कागदपत्रे, पात्रता "
                    "आणि अर्ज प्रक्रियेत मदत करू शकतो."
                )

        # Driving Licence
        elif "driving licence" in message or "driving license" in message:

            if "document" in message:

                reply = (
                    "ड्रायव्हिंग लायसन्ससाठी ओळख, पत्ता आणि वयाशी संबंधित "
                    "कागदपत्रांची आवश्यकता असू शकते. "
                    "अधिकृत Parivahan पोर्टलवर माहिती तपासा."
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "ड्रायव्हिंग लायसन्सची पात्रता वय, वाहनाचा प्रकार "
                    "आणि लागू वाहतूक नियमांवर अवलंबून असते."
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "ड्रायव्हिंग लायसन्स अर्जाचे मुख्य टप्पे:\n\n"
                    "1. अधिकृत Parivahan पोर्टलवर अर्ज करा.\n"
                    "2. आवश्यक माहिती जमा करा.\n"
                    "3. लर्नर लायसन्स प्रक्रिया पूर्ण करा.\n"
                    "4. आवश्यक ड्रायव्हिंग टेस्ट पूर्ण करा.\n"
                    "5. अर्जाचा स्टेटस तपासा."
                )

            else:

                reply = (
                    "मी ड्रायव्हिंग लायसन्सची कागदपत्रे, पात्रता "
                    "आणि अर्ज प्रक्रियेत मदत करू शकतो."
                )

        # Scholarship
        elif "scholarship" in message:

            if "document" in message:

                reply = (
                    "शिष्यवृत्तीसाठी आधार, शैक्षणिक रेकॉर्ड, बँक तपशील "
                    "आणि श्रेणी किंवा उत्पन्नाशी संबंधित कागदपत्रांची "
                    "आवश्यकता असू शकते."
                )

            elif "eligibility" in message or "eligible" in message:

                reply = (
                    "शिष्यवृत्तीची पात्रता योजना, अभ्यासक्रम, शैक्षणिक कामगिरी, "
                    "उत्पन्न आणि श्रेणी यांसारख्या निकषांवर अवलंबून असू शकते."
                )

            elif any(
                word in message
                for word in [
                    "step",
                    "steps",
                    "apply",
                    "application",
                    "process",
                    "kaise",
                ]
            ):

                reply = (
                    "शिष्यवृत्ती अर्जाचे मुख्य टप्पे:\n\n"
                    "1. शिष्यवृत्तीची पात्रता तपासा.\n"
                    "2. संबंधित पोर्टलवर नोंदणी करा.\n"
                    "3. अर्ज भरा.\n"
                    "4. आवश्यक कागदपत्रे अपलोड करा.\n"
                    "5. अर्ज जमा करून स्टेटस तपासा."
                )

            else:

                reply = (
                    "मी शिष्यवृत्तीची कागदपत्रे, पात्रता "
                    "आणि अर्ज प्रक्रियेत मदत करू शकतो."
                )

        else:

            reply = (
                "मी PM-KISAN, आयुष्मान भारत, पासपोर्ट, "
                "ड्रायव्हिंग लायसन्स आणि शिष्यवृत्ती यांसारख्या "
                "सरकारी सेवांमध्ये मदत करू शकतो."
            )

    # =========================================================
    # UNSUPPORTED LANGUAGE
    # =========================================================

    else:

        reply = (
            "I can help with government services. "
            "Please select a supported language."
        )

    return {
        "reply": reply
    }