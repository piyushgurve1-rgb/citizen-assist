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
  const serviceContextMessage = selectedService
  ? `I can help you with ${selectedService.name}. You can ask about eligibility, required documents, application steps or other details.`
  : null;

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
  const service = findService(userMessage);
  const text = userMessage.toLowerCase();

  const isHindi =
    selectedLanguage === "hi-IN";

  const isMarathi =
    selectedLanguage === "mr-IN";

  if (!service) {
    if (isHindi) {
      return "मैं PM-KISAN, Ayushman Bharat, Passport, Driving Licence, Income Certificate और Scholarships जैसी सरकारी सेवाओं में मदद कर सकता हूँ। कृपया जिस सेवा की जानकारी चाहिए उसका नाम बताएं।";
    }

    if (isMarathi) {
      return "मी PM-KISAN, Ayushman Bharat, Passport, Driving Licence, Income Certificate आणि Scholarships यांसारख्या सरकारी सेवांमध्ये मदत करू शकतो. कृपया तुम्हाला कोणत्या सेवेची माहिती हवी आहे ते सांगा.";
    }

    return "I can help with government services such as PM-KISAN, Ayushman Bharat, Passport, Driving Licence, Income Certificate and Scholarships. Please mention the service you need.";
  }

  const asksDocuments =
    text.includes("document") ||
    text.includes("documents") ||
    text.includes("proof") ||
    text.includes("kagaz") ||
    text.includes("कागज") ||
    text.includes("कागज़") ||
    text.includes("कागदपत्र");

  const asksSteps =
    text.includes("step") ||
    text.includes("process") ||
    text.includes("apply") ||
    text.includes("application") ||
    text.includes("kaise") ||
    text.includes("कैसे") ||
    text.includes("प्रक्रिया") ||
    text.includes("अर्ज");

  const asksEligibility =
    text.includes("eligible") ||
    text.includes("eligibility") ||
    text.includes("patra") ||
    text.includes("पात्र") ||
    text.includes("पात्रता") ||
    text.includes("पात्र आहे");

  if (asksDocuments) {
    if (isHindi) {
      return `${service.name} के लिए आमतौर पर आवश्यक दस्तावेज:\n\n${service.documents
        .map(
          (document, index) =>
            `${index + 1}. ${document}`
        )
        .join("\n")}`;
    }

    if (isMarathi) {
      return `${service.name} साठी सामान्यतः आवश्यक कागदपत्रे:\n\n${service.documents
        .map(
          (document, index) =>
            `${index + 1}. ${document}`
        )
        .join("\n")}`;
    }

    return `${service.name} commonly required documents:\n\n${service.documents
      .map(
        (document, index) =>
          `${index + 1}. ${document}`
      )
      .join("\n")}`;
  }

  if (asksSteps) {
    if (isHindi) {
      return `${service.name} के आवेदन की सामान्य प्रक्रिया:\n\n${service.steps
        .map(
          (step, index) =>
            `${index + 1}. ${step}`
        )
        .join("\n")}`;
    }

    if (isMarathi) {
      return `${service.name} साठी अर्ज करण्याची सामान्य प्रक्रिया:\n\n${service.steps
        .map(
          (step, index) =>
            `${index + 1}. ${step}`
        )
        .join("\n")}`;
    }

    return `${service.name} basic application steps:\n\n${service.steps
      .map(
        (step, index) =>
          `${index + 1}. ${step}`
      )
      .join("\n")}`;
  }

  if (asksEligibility) {
    if (isHindi) {
      return `${service.name} की पात्रता:\n\n${service.eligibility
        .map(
          (item, index) =>
            `${index + 1}. ${item}`
        )
        .join("\n")}`;
    }

    if (isMarathi) {
      return `${service.name} साठी पात्रता:\n\n${service.eligibility
        .map(
          (item, index) =>
            `${index + 1}. ${item}`
        )
        .join("\n")}`;
    }

    return `${service.name} eligibility:\n\n${service.eligibility
      .map(
        (item, index) =>
          `${index + 1}. ${item}`
      )
      .join("\n")}`;
  }

  if (isHindi) {
    return `${service.name}\n\n${
      service.overview || service.description
    }\n\nआप "documents", "steps" या "eligibility" पूछ सकते हैं।`;
  }

  if (isMarathi) {
    return `${service.name}\n\n${
      service.overview || service.description
    }\n\nतुम्ही "documents", "steps" किंवा "eligibility" विचारू शकता.`;
  }

  return `${service.name}\n\n${
    service.overview || service.description
  }\n\nYou can ask about "documents", "steps" or "eligibility".`;
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

  const handleQuickAction = (text) => {
    setMessages((current) => [
      ...current,
      {
        sender: "user",
        text,
        time: "Now",
      },
    ]);

    setTimeout(() => {
      const reply =
        text ===
        "I want to apply for a government service."
          ? "Sure! Tell me the government service you want to apply for. For example: Passport, PM-KISAN or Driving Licence."
          : "Sure! Tell me the service name and I can show you the commonly required documents.";

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

            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "I want to apply for a government service."
                )
              }
            >
              Apply Now
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "I need document information for a government service."
                )
              }
            >
              View Documents
            </button>

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