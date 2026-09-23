import Navbar from "./components/Navbar";
import ServiceCard from "./components/ServiceCard";
import Chatbot from "./components/Chatbot";

function App() {
  const services = [
    {
      name: "PM-KISAN",
      description:
        "Information about PM-KISAN scheme and application guidance.",
      icon: "🌾",
    },
    {
      name: "Ayushman Bharat",
      description:
        "Get guidance about health scheme eligibility and documents.",
      icon: "🏥",
    },
    {
      name: "Income Certificate",
      description:
        "Understand documents and steps required for an income certificate.",
      icon: "📄",
    },
    {
      name: "Passport",
      description:
        "Get simple guidance for passport application and documents.",
      icon: "🛂",
    },
  ];

  return (
    <div>
      <Navbar />

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
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </section>
        <Chatbot />
      </main>
    </div>
  );
}

export default App;