import { useNavigate } from "react-router-dom";

function ServiceCard({ service }) {
  const navigate = useNavigate();

  const handleViewService = () => {
    navigate(`/services/${encodeURIComponent(service.name)}`);
  };

  return (
    <article className="service-card">
      {/* Card Header */}
      <div className="service-card-top">
        <div className="service-icon">
          {service.icon}
        </div>

        <span className="service-category">
          {service.category}
        </span>
      </div>

      {/* Service Information */}
      <div className="service-card-content">
        <h3>{service.name}</h3>

        <p>
          {service.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="service-card-footer">
        <span>
          Step-by-step guidance
        </span>

        <button
          type="button"
          onClick={handleViewService}
        >
          View Service
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

export default ServiceCard;