import { useNavigate } from "react-router-dom";

function HeroSection({ onOpenChat }) {
  console.log("HeroSection onOpenChat:", onOpenChat);
  const navigate = useNavigate();

  const user = {
    name: "Ajay",
  };

  const quickActions = [
    {
      icon: "🔎",
      title: "Find a Service",
      description: "Search for government services",
      action: "services",
    },
    {
      icon: "📄",
      title: "Document Guidance",
      description: "Know which documents you need",
      action: "documents",
    },
    {
      icon: "💬",
      title: "Ask AI Assistant",
      description: "Get simple step-by-step help",
      action: "chat",
    },
  ];

  const handleQuickAction = (action) => {
    if (action === "services") {
      navigate("/services");
      return;
    }

    if (action === "documents") {
  onOpenChat(null, "documents");
  return;
}
    if (action === "chat") {
      onOpenChat();
    }
  };

  return (
    <section className="dashboard-hero">
      <div className="dashboard-container">

        {/* Greeting */}
        <div className="dashboard-greeting">
          <div>
            <p className="dashboard-eyebrow">
              CITIZEN ASSIST
            </p>

            <h1>
              Hello, {user.name}!
            </h1>

            <p>
              Get simple guidance for government services,
              schemes and applications.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-more-button"
            title="More options"
          >
            ⋮
          </button>
        </div>


        {/* AI Assistant Banner */}
        <div className="assistant-banner">

          <div className="assistant-banner-content">
            <div className="assistant-icon">
              ✨
            </div>

            <div>
              <p className="assistant-label">
                AI ASSISTANT
              </p>

              <h2>
                Need help with a government service?
              </h2>

              <p>
                Ask CitizenAssist about eligibility,
                required documents, application steps
                or form fields.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="assistant-button"
            onClick={onOpenChat}
          >
            Start Chat →
          </button>

        </div>


        {/* Quick Actions */}
        <div className="quick-actions">

          {quickActions.map((action) => (
            <button
              type="button"
              className="quick-action-card"
              key={action.title}
              onClick={() =>
                handleQuickAction(action.action)
              }
            >
              <span className="quick-action-icon">
                {action.icon}
              </span>

              <span className="quick-action-content">
                <strong>
                  {action.title}
                </strong>

                <small>
                  {action.description}
                </small>
              </span>

              <span className="quick-action-arrow">
                →
              </span>
            </button>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HeroSection;