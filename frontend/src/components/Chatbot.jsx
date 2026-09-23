function Chatbot() {
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
        <div className="bot-message">
          Hello! 👋 I am CitizenAssist.
          <br />
          How can I help you today?
        </div>
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Ask about a government service..."
        />

        <button>Send</button>
      </div>
    </section>
  );
}

export default Chatbot;