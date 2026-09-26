import { Link, useParams } from "react-router-dom";
import { servicesData } from "../data/services";

function ServiceDetails({ onAskAssistant }) {
  const { serviceName } = useParams();

  const decodedServiceName = decodeURIComponent(serviceName);

  const service = servicesData[decodedServiceName];

  if (!service) {
    return (
      <section className="service-details-page">
        <Link
          to="/services"
          className="back-link"
        >
          ← Back to Services
        </Link>

        <div className="service-not-found">
          <span>🔎</span>

          <h1>
            Service Not Found
          </h1>

          <p>
            We could not find the requested government
            service.
          </p>

          <Link
            to="/services"
            className="service-primary-link"
          >
            Explore Services →
          </Link>
        </div>
      </section>
    );
  }

  const handleAskAssistant = () => {
    onAskAssistant(service);
  };

  return (
    <section className="service-details-page">

      {/* Back */}
      <Link
        to="/services"
        className="back-link"
      >
        ← Back to Services
      </Link>


      {/* Header */}
      <div className="service-details-header">

        <span className="hero-badge">
          {service.icon || "🇮🇳"}{" "}
          {service.category || "Government Service"}
        </span>

        <h1>
          {service.name}
        </h1>

        <p>
          {service.description}
        </p>

        {service.overview && (
          <p className="service-overview">
            {service.overview}
          </p>
        )}

      </div>


      {/* Eligibility */}
      {service.eligibility?.length > 0 && (
        <div className="service-detail-card service-eligibility">

          <h2>
            ✅ Eligibility
          </h2>

          <ul>
            {service.eligibility.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>

        </div>
      )}


      {/* Main Details */}
      <div className="service-details-grid">

        {/* Documents */}
        <div className="service-detail-card">

          <h2>
            📋 Required Documents
          </h2>

          <ul>
            {service.documents?.map((document) => (
              <li key={document}>
                {document}
              </li>
            ))}
          </ul>

        </div>


        {/* Steps */}
        <div className="service-detail-card">

          <h2>
            📝 Step-by-Step Guidance
          </h2>

          <ol>
            {service.steps?.map((step, index) => (
              <li key={index}>
                {step}
              </li>
            ))}
          </ol>

        </div>

      </div>


      {/* AI Assistant */}
      <div className="service-assistant-card">

        <div>
          <p className="official-label">
            NEED HELP?
          </p>

          <h2>
            Ask AI Assistant about this service
          </h2>

          <p>
            Get simple guidance about eligibility,
            documents, steps and form-related questions.
          </p>
        </div>

        <button
          type="button"
          className="assistant-button"
          onClick={handleAskAssistant}
        >
          Ask AI Assistant →
        </button>

      </div>


      {/* Official Information */}
      <div className="official-info">

        <div>
          <p className="official-label">
            OFFICIAL INFORMATION
          </p>

          <h2>
            Use the official government website
          </h2>

          <p>
            For the latest rules, eligibility
            requirements and application process,
            use the official government source.
          </p>
        </div>

        {service.officialUrl &&
        service.officialUrl !== "#" ? (
          <a
            href={service.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="official-link"
          >
            Visit Official Website
            <span aria-hidden="true">
              →
            </span>
          </a>
        ) : (
          <button
            type="button"
            className="official-link disabled"
            disabled
          >
            Official Link Coming Soon
          </button>
        )}

      </div>

    </section>
  );
}

export default ServiceDetails;