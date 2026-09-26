import { useEffect, useRef, useState } from "react";
import { servicesData } from "../data/services";

function ChatWidget({
  isOpen,
  setIsOpen,
  selectedLanguage,
  setSelectedLanguage,
  selectedService,
}) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

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

  const findService = (userMessage) => {
    const text = userMessage.toLowerCase();
    const services = Object.values(servicesData);

    return services.find((service) => {
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

      return searchableText
        .split(" ")
        .some(
          (word) =>
            word.length > 2 && text.includes(word)
        );
    });
  };

  const generateReply = (userMessage) => {
    const detectedService = findService(userMessage);
    const service = selectedService || detectedService;

    const text = userMessage.toLowerCase();

    const isHindi =
      selectedLanguage === "hi-IN";

    const isMarathi =
      selectedLanguage === "mr-IN";

    if (!service) {
      if (isHindi) {
        return "मैं PM-KISAN, Ayushman Bharat, Passport, Driving Licence, Income Certificate और Scholarship जैसी सरकारी सेवाओं में मदद कर सकता हूँ। कृपया सेवा का नाम बताएं।";
      }

      if (isMarathi) {
        return "मी PM-KISAN, Ayushman Bharat, Passport, Driving Licence, Income Certificate आणि Scholarship यांसारख्या सरकारी सेवांमध्ये मदत करू शकतो. कृपया सेवेचे नाव सांगा.";
      }

      return "I can help with government services such as PM-KISAN, Ayushman Bharat, Passport, Driving Licence, Income Certificate and Scholarship. Please mention the service name.";
    }

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

  useEffect(() => {
    if (isOpen && selectedService) {
      addServiceContext();
    }
  }, [isOpen, selectedService]);

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
    }, 400);
  };

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
      if (selectedService?.officialUrl &&
          selectedService.officialUrl !== "#") {
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
    }, 400);
  };

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
        event.results[0][0].transcript;

      setMessage((current) =>
        current
          ? `${current} ${transcript}`
          : transcript
      );
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
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowLanguages(false);
  };

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

  return (
    <>
      {isOpen && (
        <div className="chat-widget">

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
                          <span
                            key={lineIndex}
                          >
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

                  <small>
                    {msg.time}
                  </small>
                </div>

              </div>
            ))}

          </div>

          <div className="quick-actions">

            {quickActions.map((action) => (
              <button
                type="button"
                key={action.action}
                onClick={() =>
                  handleQuickAction(
                    action.action
                  )
                }
              >
                {action.label}
              </button>
            ))}

          </div>

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