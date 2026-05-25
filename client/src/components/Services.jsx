import { SectionHeader } from "./SectionHeader.jsx";

export function Services({ content }) {
  return (
    <section className="section section--muted" id="services">
      <div className="container">
        <SectionHeader label={content.label} title={content.title} align="center" />
        <div className="services-grid">
          {content.items.map((service, index) => (
            <article key={service.title} className="service-card glass-card">
              <span className="service-card__index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

