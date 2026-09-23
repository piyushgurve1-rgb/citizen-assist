function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="service-icon">{service.icon}</div>

      <h3>{service.name}</h3>

      <p>{service.description}</p>

      <button>View Service</button>
    </div>
  );
}

export default ServiceCard;