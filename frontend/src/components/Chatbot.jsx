import { useState } from "react";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I am CitizenAssist. How can I help you today?",
    },
  ]);

  const handleSend = () => {
    if (message.trim() === "") {
      return;
    }

    const newMessage = {
      sender: "user",
      text: message,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setTimeout(() => {
  setMessages((currentMessages) => [
    ...currentMessages,
    {
      sender: "bot",
      text: "I received your question. AI assistance will be connected soon.",
    },
  ]);
}, 500);
  };

  return (
    <section className="chatbot-section">
      <div className="chatbot-header">
        <div>
          <h2>🤖 CitizenAssist AI</h2>
          <p>Ask questions about government services.</p>
        </div>

        <span className="online-status">● Online</span>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user"
                ? "user-message"
                : "bot-message"
            }
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Ask about a government service..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </section>
  );
}

export default Chatbot;