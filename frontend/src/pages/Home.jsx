import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import ServiceCard from "../components/ServiceCard";
import { servicesData } from "../data/services";

function Home({ onOpenChat }) {
  const popularServices = Object.values(servicesData).slice(0, 4);

  return (
    <>
      <HeroSection onOpenChat={onOpenChat} />

      <section className="services-section">
        <div className="section-heading">
          <div>
            <h2>Popular Government Services</h2>

            <p className="services-subtitle">
              Quick access to commonly used government services.
            </p>
          </div>

          <Link to="/services" className="view-all-link">
            View All Services →
          </Link>
        </div>

        <div className="service-grid">
          {popularServices.map((service) => (
            <ServiceCard
              key={service.name}
              service={service}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;