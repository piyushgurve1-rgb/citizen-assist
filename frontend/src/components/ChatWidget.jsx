import { useEffect, useRef, useState } from "react";
import { servicesData } from "../data/services";

function ChatWidget({
  isOpen,
  setIsOpen,
  selectedLanguage,
  setSelectedLanguage,
  selectedService,
  initialAction,
}) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentChatService, setCurrentChatService] = useState(null);

  const recognitionRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Hello! 👋 I am CitizenAssist. Ask me about government services, documents, eligibility or application steps.",
      time: "Now",
    },
  ]);

  const languages = [
    { code: "en-IN", name: "English" },
    { code: "hi-IN", name: "हिंदी" },
    { code: "mr-IN", name: "मराठी" },
  ];

  const selectedLanguageName =
    languages.find(
      (language) => language.code === selectedLanguage
    )?.name || "English";

  // -----------------------------
  // Voice Output
  // -----------------------------
  const speakReply = (text) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = selectedLanguage || "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // -----------------------------
  // Find Government Service
  // -----------------------------
  const getEditDistance = (a, b) => {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

  const findService = (userMessage) => {
  const text = userMessage.toLowerCase();

  const userWords = text
    .split(/\s+/)
    .filter((word) => word.length >= 3);

  const services = Object.values(servicesData);

  let bestService = null;
  let bestScore = 0;

  services.forEach((service) => {
    const searchableText = [
      service.name,
      service.category,
      service.description,
      service.overview,
      ...(service.keywords || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const serviceWords = searchableText
      .split(/\s+/)
      .filter((word) => word.length >= 3);

    let serviceScore = 0;

    userWords.forEach((userWord) => {
      serviceWords.forEach((serviceWord) => {
        if (userWord === serviceWord) {
          serviceScore += 3;
        } else if (
          userWord.includes(serviceWord) ||
          serviceWord.includes(userWord)
        ) {
          serviceScore += 2;
        } else if (
          serviceWord.length >= 5 &&
          getEditDistance(userWord, serviceWord) <= 2
        ) {
          serviceScore += 1;
        }
      });
    });

    if (serviceScore > bestScore) {
      bestScore = serviceScore;
      bestService = service;
    }
  });

  return bestService;
};

  // -----------------------------
  // Generate AI-style Reply
  // -----------------------------
  const generateReply = (userMessage) => {
    const detectedService = findService(userMessage);

    if (detectedService) {
      setCurrentChatService(detectedService);
    }

    const service =
     detectedService ||
     selectedService ||
     currentChatService;
     const lowerMessage = userMessage.toLowerCase();
     const text = userMessage.toLowerCase();

const isHindi = selectedLanguage === "hi-IN";
const isMarathi = selectedLanguage === "mr-IN";

// -----------------------------
// Form Field Explanation
// -----------------------------

// PAN format
if (
  lowerMessage.includes("pan number kitne") ||
  lowerMessage.includes("pan kitne") ||
  lowerMessage.includes("pan format") ||
  lowerMessage.includes("pan characters") ||
  lowerMessage.includes("pan digits") ||
  lowerMessage.includes("pan कितने") ||
  lowerMessage.includes("pan कितने characters")
) {
  if (isHindi) {
    return "PAN number आमतौर पर 10 characters का होता है, जिसमें letters और numbers शामिल होते हैं।";
  }

  if (isMarathi) {
    return "PAN number साधारणपणे 10 characters चा असतो, ज्यामध्ये letters आणि numbers असतात.";
  }

  return "A PAN number is generally 10 characters long and contains both letters and numbers.";
}

// Father's Name
if (
  lowerMessage.includes("father name") ||
  lowerMessage.includes("father's name") ||
  lowerMessage.includes("father")
) {
  if (isHindi) {
    return "Father's Name field में अपने पिता का पूरा नाम भरें, जैसा कि आपके official document में लिखा है।";
  }

  if (isMarathi) {
    return "Father's Name field मध्ये तुमच्या वडिलांचे पूर्ण नाव भरा, जसे तुमच्या official document मध्ये लिहिले आहे.";
  }

  return "Enter your father's full name in the Father's Name field, exactly as written on your official document.";
}

// Date of Birth
if (
  lowerMessage.includes("date of birth") ||
  lowerMessage.includes("dob") ||
  lowerMessage.includes("birth date")
) {
  if (isHindi) {
    return "Date of Birth field में अपनी जन्मतिथि भरें, जैसा कि आपके official document में दर्ज है।";
  }

  if (isMarathi) {
    return "Date of Birth field मध्ये तुमची जन्मतारीख भरा, जशी तुमच्या official document मध्ये नमूद आहे.";
  }

  return "Enter your date of birth in the Date of Birth field, exactly as written on your official document.";
}

// Mobile Number
if (
  lowerMessage.includes("mobile number") ||
  lowerMessage.includes("mobile no") ||
  lowerMessage.includes("phone number") ||
  lowerMessage.includes("phone no")
) {
  if (isHindi) {
    return "Mobile Number field में अपना चालू मोबाइल नंबर भरें, जिस पर OTP या application-related updates प्राप्त हो सकें।";
  }

  if (isMarathi) {
    return "Mobile Number field मध्ये तुमचा सध्या वापरत असलेला मोबाइल नंबर भरा, ज्यावर OTP किंवा अर्जाशी संबंधित अपडेट्स मिळू शकतात.";
  }

  return "Enter your active mobile number in the Mobile Number field, as it may be used for OTPs or application-related updates.";
}

// Email
if (
  lowerMessage.includes("email address") ||
  lowerMessage.includes("email id") ||
  lowerMessage.includes("email")
) {
  if (isHindi) {
    return "Email Address field में अपना सही और चालू ईमेल पता भरें, जिस पर application से संबंधित updates मिल सकें।";
  }

  if (isMarathi) {
    return "Email Address field मध्ये तुमचा योग्य आणि सध्या वापरत असलेला ईमेल पत्ता भरा, ज्यावर अर्जाशी संबंधित अपडेट्स मिळू शकतात.";
  }

  return "Enter your correct and active email address in the Email Address field, as it may be used for application-related updates.";
}

// Address
if (
  lowerMessage.includes("address") ||
  lowerMessage.includes("home address") ||
  lowerMessage.includes("residential address")
) {
  if (isHindi) {
    return "Address field में अपना वर्तमान पता भरें, जैसे घर का नंबर, गली, शहर, जिला और PIN code।";
  }

  if (isMarathi) {
    return "Address field मध्ये तुमचा सध्याचा पत्ता भरा, जसे घर क्रमांक, रस्ता, शहर, जिल्हा आणि PIN code.";
  }

  return "Enter your current address in the Address field, including your house number, street, city, district and PIN code.";
}

// PIN Code
if (
  lowerMessage.includes("pin code") ||
  lowerMessage.includes("pincode") ||
  lowerMessage.includes("postal code")
) {
  if (isHindi) {
    return "PIN Code field में अपने पते का सही 6-digit PIN code भरें।";
  }

  if (isMarathi) {
    return "PIN Code field मध्ये तुमच्या पत्त्याचा योग्य 6 अंकी PIN code भरा.";
  }

  return "Enter the correct 6-digit PIN code for your address in the PIN Code field.";
}

// Aadhaar
if (
  lowerMessage.includes("aadhaar number") ||
  lowerMessage.includes("aadhar number") ||
  lowerMessage.includes("aadhaar no") ||
  lowerMessage.includes("aadhar no")
) {
  if (isHindi) {
    return "Aadhaar Number field में अपना सही 12-digit Aadhaar number भरें। इसे केवल official और trusted government website पर ही दर्ज करें।";
  }

  if (isMarathi) {
    return "Aadhaar Number field मध्ये तुमचा योग्य 12 अंकी Aadhaar number भरा. तो फक्त official आणि trusted government website वरच टाका.";
  }

  return "Enter your correct 12-digit Aadhaar number in the Aadhaar Number field. Enter it only on an official and trusted government website.";
}

// Gender
if (
  lowerMessage.includes("gender") ||
  lowerMessage.includes("male or female") ||
  lowerMessage.includes("sex")
) {
  if (isHindi) {
    return "Gender field में अपना सही gender चुनें, जैसे Male, Female या उपलब्ध अन्य option।";
  }

  if (isMarathi) {
    return "Gender field मध्ये तुमचे योग्य gender निवडा, जसे Male, Female किंवा उपलब्ध असलेला इतर option.";
  }

  return "Select your correct gender in the Gender field, such as Male, Female, or another available option.";
}

// PAN Number
if (
  lowerMessage.includes("pan number") ||
  lowerMessage.includes("pan no") ||
  lowerMessage.includes("pan card number")
) {
  if (isHindi) {
    return "PAN Number field में अपना सही PAN number भरें, जैसा कि आपके PAN card पर दर्ज है।";
  }

  if (isMarathi) {
    return "PAN Number field मध्ये तुमचा योग्य PAN number भरा, जसा तुमच्या PAN card वर नमूद आहे.";
  }

  return "Enter your correct PAN number in the PAN Number field, exactly as shown on your PAN card.";
}
    // No service detected
    if (!service) {
      if (isHindi) {
        return "मैं PM-KISAN, Ayushman Bharat, Passport, Driving Licence, Income Certificate और Scholarship जैसी सरकारी सेवाओं में मदद कर सकता हूँ। कृपया सेवा का नाम बताएं।";
      }

      if (isMarathi) {
        return "मी PM-KISAN, Ayushman Bharat, Passport, Driving Licence, Income Certificate आणि Scholarship यांसारख्या सरकारी सेवांमध्ये मदत करू शकतो. कृपया सेवेचे नाव सांगा.";
      }

      return "I can help with government services such as PM-KISAN, Ayushman Bharat, Passport, Driving Licence, Income Certificate and Scholarship. Please mention the service name.";
    }

    // -----------------------------
    // Address Proof
    // -----------------------------
    const asksAddressProof =
      text.includes("address proof") ||
      text.includes("proof of address") ||
      text.includes("address document") ||
      text.includes("address documents");

    // -----------------------------
    // Documents
    // -----------------------------
    const asksDocuments =
      text.includes("document") ||
      text.includes("documents") ||
      text.includes("proof") ||
      text.includes("kagaz") ||
      text.includes("kagaj") ||
      text.includes("documents chahiye") ||
      text.includes("कागज") ||
      text.includes("कागज़") ||
      text.includes("दस्तावेज") ||
      text.includes("दस्तावेज़") ||
      text.includes("कागदपत्र") ||
      text.includes("कागद");

    // -----------------------------
    // Steps / Application
    // -----------------------------
    const asksSteps =
      text.includes("step") ||
      text.includes("steps") ||
      text.includes("process") ||
      text.includes("apply") ||
      text.includes("application") ||
      text.includes("how") ||
      text.includes("kaise") ||
      text.includes("kaise apply") ||
      text.includes("कैसे") ||
      text.includes("कैसे करें") ||
      text.includes("प्रक्रिया") ||
      text.includes("आवेदन") ||
      text.includes("अर्ज") ||
      text.includes("कसा") ||
      text.includes("कसे");

    // -----------------------------
    // Eligibility
    // -----------------------------
    const asksEligibility =
      text.includes("eligible") ||
      text.includes("eligibility") ||
      text.includes("who can") ||
      text.includes("patra") ||
      text.includes("patrata") ||
      text.includes("पात्र") ||
      text.includes("पात्रता") ||
      text.includes("पात्र है") ||
      text.includes("कोण पात्र") ||
      text.includes("पात्र कोण");

    // -----------------------------
    // Address Proof Reply
    // -----------------------------
    if (asksAddressProof) {
      if (isHindi) {
        return `${service.name} के लिए Address Proof एक जरूरी दस्तावेज़ हो सकता है।

आमतौर पर स्वीकार किए जाने वाले address proof में Aadhaar Card, Voter ID, Driving Licence, बिजली/पानी का बिल या अन्य मान्य address document शामिल हो सकते हैं।

आवेदन के प्रकार के अनुसार आवश्यक दस्तावेज़ अलग हो सकते हैं।`;
      }

      if (isMarathi) {
        return `${service.name} साठी Address Proof हे आवश्यक कागदपत्र असू शकते.

सामान्यतः Aadhaar Card, Voter ID, Driving Licence, वीज किंवा पाण्याचे बिल किंवा इतर वैध address document स्वीकारले जाऊ शकतात.

अर्जाच्या प्रकारानुसार आवश्यक कागदपत्रे वेगवेगळी असू शकतात.`;
      }

      return `${service.name} may require a valid proof of address.

Common examples can include Aadhaar Card, Voter ID, Driving Licence, electricity/water bill or another valid address document.

The exact required document can vary depending on the application type.`;
    }

    // -----------------------------
    // Documents Reply
    // -----------------------------
    if (asksDocuments) {
      if (isHindi) {
        return `${service.name} के लिए आमतौर पर आवश्यक दस्तावेज:

${service.documents
  .map(
    (document, index) =>
      `${index + 1}. ${document}`
  )
  .join("\n")}

अगर आपको किसी दस्तावेज़ के बारे में अधिक जानकारी चाहिए, तो उसका नाम पूछ सकते हैं।`;
      }

      if (isMarathi) {
        return `${service.name} साठी सामान्यतः आवश्यक कागदपत्रे:

${service.documents
  .map(
    (document, index) =>
      `${index + 1}. ${document}`
  )
  .join("\n")}

तुम्हाला कोणत्याही कागदपत्राबद्दल अधिक माहिती हवी असल्यास त्याचे नाव विचारा.`;
      }

      return `${service.name} commonly required documents:

${service.documents
  .map(
    (document, index) =>
      `${index + 1}. ${document}`
  )
  .join("\n")}

You can ask about any specific document for more information.`;
    }

    // -----------------------------
    // Steps Reply
    // -----------------------------
    if (asksSteps) {
      if (isHindi) {
        return `${service.name} के लिए आवेदन की सामान्य प्रक्रिया:

${service.steps
  .map(
    (step, index) =>
      `${index + 1}. ${step}`
  )
  .join("\n")}

अगर आपको किसी step को समझना है, तो उसके बारे में पूछ सकते हैं।`;
      }

      if (isMarathi) {
        return `${service.name} साठी अर्ज करण्याची सामान्य प्रक्रिया:

${service.steps
  .map(
    (step, index) =>
      `${index + 1}. ${step}`
  )
  .join("\n")}

तुम्हाला कोणताही step समजून घ्यायचा असल्यास त्याबद्दल विचारा.`;
      }

      return `${service.name} basic application steps:

${service.steps
  .map(
    (step, index) =>
      `${index + 1}. ${step}`
  )
  .join("\n")}

You can ask about any specific step for more information.`;
    }

    // -----------------------------
    // Eligibility Reply
    // -----------------------------
    if (asksEligibility) {
      if (isHindi) {
        return `${service.name} की पात्रता:

${service.eligibility
  .map(
    (item, index) =>
      `${index + 1}. ${item}`
  )
  .join("\n")}`;
      }

      if (isMarathi) {
        return `${service.name} साठी पात्रता:

${service.eligibility
  .map(
    (item, index) =>
      `${index + 1}. ${item}`
  )
  .join("\n")}`;
      }

      return `${service.name} eligibility:

${service.eligibility
  .map(
    (item, index) =>
      `${index + 1}. ${item}`
  )
  .join("\n")}`;
    }

    // -----------------------------
    // General Service Reply
    // -----------------------------
    if (isHindi) {
      return `${service.name}

${
  service.overview || service.description
}

आप इस सेवा के documents, steps या eligibility के बारे में पूछ सकते हैं।`;
    }

    if (isMarathi) {
      return `${service.name}

${
  service.overview || service.description
}

तुम्ही या सेवेची कागदपत्रे, प्रक्रिया किंवा पात्रता विचारू शकता.`;
    }

    return `${service.name}

${
  service.overview || service.description
}

You can ask about this service's documents, steps or eligibility.`;
  };

  // -----------------------------
  // Add Selected Service Context
  // -----------------------------
  const addServiceContext = () => {
    if (!selectedService) {
      return;
    }

    const contextMessage = {
      sender: "ai",
      text: `You are viewing ${selectedService.name}. I can help you with its eligibility, required documents, application steps and other information.`,
      time: "Now",
    };

    setMessages((current) => {
      const alreadyShown = current.some(
        (msg) => msg.text === contextMessage.text
      );

      if (alreadyShown) {
        return current;
      }

      return [...current, contextMessage];
    });
  };

  // -----------------------------
  // Selected Service Effect
  // -----------------------------
  useEffect(() => {
    if (isOpen && selectedService) {
      addServiceContext();
    }
  }, [isOpen, selectedService]);

  // -----------------------------
  // Document Guidance Effect
  // -----------------------------
  useEffect(() => {
    if (
      isOpen &&
      initialAction === "documents" &&
      !selectedService
    ) {
      setMessages((current) => {
        const alreadyShown = current.some(
          (msg) =>
            msg.text ===
            "Sure! I can help you find the documents required for a government service. Please tell me the service name."
        );

        if (alreadyShown) {
          return current;
        }

        return [
          ...current,
          {
            sender: "ai",
            text:
              "Sure! I can help you find the documents required for a government service. Please tell me the service name.",
            time: "Now",
          },
        ];
      });
    }
  }, [isOpen, initialAction, selectedService]);

  // -----------------------------
  // Send Message
  // -----------------------------
  const handleSend = () => {
    addServiceContext();

    const userMessage = message.trim();

    if (!userMessage) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        sender: "user",
        text: userMessage,
        time: "Now",
      },
    ]);

    setMessage("");

    setTimeout(() => {
      const reply = generateReply(userMessage);

      setMessages((current) => [
        ...current,
        {
          sender: "ai",
          text: reply,
          time: "Now",
        },
      ]);

      speakReply(reply);
    }, 400);
  };

  // -----------------------------
  // Quick Actions
  // -----------------------------
  const handleQuickAction = (action) => {
    let userText = "";
    let reply = "";

    if (action === "documents") {
      userText = selectedService
        ? `I need documents for ${selectedService.name}.`
        : "I need document information for a government service.";

      reply = generateReply("documents");
    }

    if (action === "eligibility") {
      userText = selectedService
        ? `What is the eligibility for ${selectedService.name}?`
        : "I want to know the eligibility.";

      reply = generateReply("eligibility");
    }

    if (action === "steps") {
      userText = selectedService
        ? `How can I apply for ${selectedService.name}?`
        : "I want to know the application steps.";

      reply = generateReply("steps");
    }

    if (action === "official") {
      if (
        selectedService?.officialUrl &&
        selectedService.officialUrl !== "#"
      ) {
        window.open(
          selectedService.officialUrl,
          "_blank",
          "noopener,noreferrer"
        );

        return;
      }

      userText = "I want the official website.";

      reply =
        "The official website link is not available for this service yet.";
    }

    setMessages((current) => [
      ...current,
      {
        sender: "user",
        text: userText,
        time: "Now",
      },
    ]);

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          sender: "ai",
          text: reply,
          time: "Now",
        },
      ]);

      speakReply(reply);
    }, 400);
  };

  // -----------------------------
  // Voice Input
  // -----------------------------
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );

      return;
    }

    if (
      isListening &&
      recognitionRef.current
    ) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang =
      selectedLanguage || "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript.trim();

      if (!transcript) {
        return;
      }

      setMessage("");

      setMessages((current) => [
        ...current,
        {
          sender: "user",
          text: transcript,
          time: "Now",
        },
      ]);

      setTimeout(() => {
        const reply = generateReply(transcript);

        setMessages((current) => [
          ...current,
          {
            sender: "ai",
            text: reply,
            time: "Now",
          },
        ]);

        speakReply(reply);
      }, 400);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  // -----------------------------
  // Language Selection
  // -----------------------------
  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowLanguages(false);
  };

  // -----------------------------
  // Document Service Selection
  // -----------------------------
  const documentServices = Object.values(servicesData);

  const handleDocumentServiceSelect = (service) => {
    const userText = service.name;

    setMessages((current) => [
      ...current,
      {
        sender: "user",
        text: userText,
        time: "Now",
      },
    ]);

    setTimeout(() => {
      const reply = generateReply(
        `${service.name} required documents`
      );

      setMessages((current) => [
        ...current,
        {
          sender: "ai",
          text: reply,
          time: "Now",
        },
      ]);

      speakReply(reply);
    }, 400);
  };

  // -----------------------------
  // Chat Quick Action Buttons
  // -----------------------------
  const quickActions = selectedService
    ? [
        {
          label: "📋 Documents",
          action: "documents",
        },
        {
          label: "✅ Eligibility",
          action: "eligibility",
        },
        {
          label: "📝 Steps",
          action: "steps",
        },
        {
          label: "🔗 Official Website",
          action: "official",
        },
      ]
    : [
        {
          label: "Apply Now",
          action: "steps",
        },
        {
          label: "View Documents",
          action: "documents",
        },
      ];

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <>
      {isOpen && (
        <div className="chat-widget">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">
                🤖
              </div>

              <div>
                <h3>CitizenAssist AI</h3>

                <span className="chat-status">
                  <span className="status-dot"></span>

                  {isListening
                    ? "Listening..."
                    : "Online"}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="chat-close-button"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.sender === "user"
                    ? "chat-user"
                    : "chat-ai"
                }`}
              >
                <div className="chat-avatar">
                  {msg.sender === "user"
                    ? "👤"
                    : "🤖"}
                </div>

                <div>
                  <div className="chat-bubble">
                    {msg.text
                      .split("\n")
                      .map(
                        (line, lineIndex) => (
                          <span key={lineIndex}>
                            {line}

                            {lineIndex <
                              msg.text
                                .split("\n")
                                .length -
                                1 && <br />}
                          </span>
                        )
                      )}
                  </div>

                  <small>{msg.time}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Document Service Options */}
          {isOpen &&
            initialAction === "documents" &&
            !selectedService && (
              <div className="document-service-options">
                {documentServices.map((service) => (
                  <button
                    type="button"
                    key={service.name}
                    onClick={() =>
                      handleDocumentServiceSelect(service)
                    }
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            )}

          {/* Quick Actions */}
          <div className="quick-actions">
            {quickActions.map((action) => (
              <button
                type="button"
                key={action.action}
                onClick={() =>
                  handleQuickAction(action.action)
                }
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-widget-input">
            <input
              type="text"
              placeholder={
                isListening
                  ? "Listening..."
                  : "Ask CitizenAssist..."
              }
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            {/* Language Selector */}
            <div className="language-selector">
              <button
                type="button"
                className="language-icon-button"
                onClick={() =>
                  setShowLanguages(
                    !showLanguages
                  )
                }
                title={`Language: ${selectedLanguageName}`}
              >
                🌐
              </button>

              {showLanguages && (
                <div className="language-menu">
                  <div className="language-menu-title">
                    Select Language
                  </div>

                  {languages.map(
                    (language) => (
                      <button
                        type="button"
                        key={language.code}
                        className={
                          selectedLanguage ===
                          language.code
                            ? "language-option selected"
                            : "language-option"
                        }
                        onClick={() =>
                          handleLanguageSelect(
                            language.code
                          )
                        }
                      >
                        <span>
                          {language.name}
                        </span>

                        {selectedLanguage ===
                          language.code && (
                          <span>✓</span>
                        )}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Voice Input */}
            <button
              type="button"
              className={
                isListening
                  ? "voice-button listening"
                  : "voice-button"
              }
              onClick={startVoiceInput}
              title={
                isListening
                  ? "Stop listening"
                  : "Voice input"
              }
            >
              {isListening ? "⏹️" : "🎤"}
            </button>

            {/* Send */}
            <button
              type="button"
              className="send-button"
              onClick={handleSend}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        className="chat-floating-button"
        type="button"
        onClick={() =>
          setIsOpen(!isOpen)
        }
      >
        {isOpen ? "✕" : "🤖"}
      </button>
    </>
  );
}

export default ChatWidget;