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
    ...new Set(
      services.map((service) => service.category)
    ),
  ];

  const filteredServices = services.filter((service) => {
    const searchText = search
      .toLowerCase()
      .trim();

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

      {/* Page Header */}
      <div className="services-page-header">

        <span className="hero-badge">
          🇮🇳 Government Services
        </span>

        <h1>
          Explore Government Services
        </h1>

        <p>
          Find simple and easy-to-understand guidance
          for government services, schemes and
          applications.
        </p>

        {/* Search */}
        <div className="services-search">
          <span aria-hidden="true">
            🔎
          </span>

          <input
            type="text"
            placeholder="Search government services..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

      </div>


      {/* Category Filters */}
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
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>
        ))}

      </div>


      {/* Results */}
      {filteredServices.length > 0 ? (
        <div className="service-grid">

          {filteredServices.map((service) => (
            <ServiceCard
              key={service.name}
              service={service}
            />
          ))}

        </div>
      ) : (
        <div className="no-results">
          <span>🔎</span>

          <h3>
            No government service found
          </h3>

          <p>
            Try a different service name or category.
          </p>
        </div>
      )}

    </section>
  );
}

export default Services;