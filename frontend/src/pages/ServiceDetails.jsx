import { Link, useParams } from "react-router-dom";
import { servicesData } from "../data/services";

function ServiceDetails() {
  const { serviceName } = useParams();

  const decodedServiceName = decodeURIComponent(serviceName);

  const service = servicesData[decodedServiceName] || {
    name: decodedServiceName,
    description:
      "Get simple and easy-to-understand guidance for this government service.",
    documents: [
      "Aadhaar Card",
      "Mobile Number",
      "Address Proof",
      "Required application documents",
    ],
    steps: [
      "Check your eligibility for the service.",
      "Keep the required documents ready.",
      "Fill out the application form.",
      "Submit the application.",
      "Track your application status.",
    ],
    officialUrl: "#",
  };

  return (
    <section className="service-details-page">
      <Link to="/services" className="back-link">
        ← Back to Services
      </Link>

      <div className="service-details-header">
        <span className="hero-badge">
          {service.icon || "🇮🇳"} Government Service
        </span>

        <h1>{service.name}</h1>

        <p>{service.description}</p>

        {service.overview && (
          <p className="service-overview">
            {service.overview}
          </p>
        )}
      </div>

      {service.eligibility && (
        <div className="service-detail-card service-eligibility">
          <h2>✅ Eligibility</h2>

          <ul>
            {service.eligibility.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="service-details-grid">
        <div className="service-detail-card">
          <h2>📋 Required Documents</h2>

          <ul>
            {service.documents.map((document) => (
              <li key={document}>{document}</li>
            ))}
          </ul>
        </div>

        <div className="service-detail-card">
          <h2>📝 Step-by-Step Guidance</h2>

          <ol>
            {service.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="official-info">
        <h2>🔗 Official Information</h2>

        <p>
          For the latest information, eligibility rules and application
          process, visit the official government website.
        </p>

        {service.officialUrl && service.officialUrl !== "#" ? (
          <a
            href={service.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button">
              Visit Official Website →
            </button>
          </a>
        ) : (
          <button type="button" disabled>
            Official Link Coming Soon
          </button>
        )}
      </div>
    </section>
  );
}

export default ServiceDetails;