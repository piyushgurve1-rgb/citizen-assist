function App() {
  const services = [
    {
      name: "PM-KISAN",
      description: "Information about PM-KISAN scheme and application guidance.",
      icon: "🌾",
    },
    {
      name: "Ayushman Bharat",
      description: "Get guidance about health scheme eligibility and documents.",
      icon: "🏥",
    },
    {
      name: "Income Certificate",
      description: "Understand documents and steps required for an income certificate.",
      icon: "📄",
    },
    {
      name: "Passport",
      description: "Get simple guidance for passport application and documents.",
      icon: "🛂",
    },
  ];

  return (
    <div>
      <nav>
        <h2>🇮🇳 CitizenAssist</h2>

        <div>
          <button>Home</button>
          <button>Services</button>
          <button>AI Assistant</button>
          <button>English</button>
          <button>हिंदी</button>
          <button>मराठी</button>
          <button>Login</button>
        </div>
      </nav>

      <main>
        <h1>Government Services, Simplified.</h1>

        <p>
          Get simple guidance for government services,
          documents, forms and applications.
        </p>

        <button>Ask CitizenAssist</button>

        <section className="services-section">
          <h2>Popular Services</h2>

          <div className="service-grid">
            {services.map((service) => (
              <div className="service-card" key={service.name}>
                <div className="service-icon">{service.icon}</div>

                <h3>{service.name}</h3>

                <p>{service.description}</p>

                <button>View Service</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;