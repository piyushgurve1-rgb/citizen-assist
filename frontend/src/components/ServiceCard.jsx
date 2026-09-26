import { useNavigate } from "react-router-dom";

function ServiceCard({ service }) {
  const navigate = useNavigate();

  const handleViewService = () => {
    navigate(`/services/${encodeURIComponent(service.name)}`);
  };

  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="service-icon">{service.icon}</span>

        <span className="service-category">
          {service.category}
        </span>
      </div>

      <h3>{service.name}</h3>

      <p>{service.description}</p>

      <div className="service-card-footer">
        <span>Step-by-step guidance</span>

        <button type="button" onClick={handleViewService}>
          View Service →
        </button>
      </div>
    </article>
  );
}

export default ServiceCard;