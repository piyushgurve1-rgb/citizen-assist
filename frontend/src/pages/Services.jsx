import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import { servicesData } from "../data/services";

function Services() {
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [selectedCategory, setSelectedCategory] = useState("All");

  const services = Object.values(servicesData);

  const categories = [
    "All",
    ...new Set(services.map((service) => service.category)),
  ];

  const filteredServices = services.filter((service) => {
  const searchText = search.toLowerCase().trim();

  const searchableText = [
  service.name,
  service.category,
  service.description,
  service.overview,
  ...(service.keywords || []),
]
  .filter(Boolean)
  .join(" ")
  .toLowerCase();
  const matchesSearch =
    searchText === "" ||
    searchableText.includes(searchText);

  const matchesCategory =
    selectedCategory === "All" ||
    service.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

  return (
    <section className="services-page">
      <div className="services-page-header">
        <span className="hero-badge">
          🇮🇳 Government Services
        </span>

        <h1>Explore Government Services</h1>

        <p>
          Find simple and easy-to-understand guidance for
          government services, schemes and applications.
        </p>

        <div className="services-search">
          <span>🔎</span>

          <input
            type="text"
            placeholder="Search government services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              selectedCategory === category
                ? "category-button active"
                : "category-button"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="service-grid">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.name}
            service={service}
          />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <p className="no-results">
          No government service found.
        </p>
      )}
    </section>
  );
}

export default Services;