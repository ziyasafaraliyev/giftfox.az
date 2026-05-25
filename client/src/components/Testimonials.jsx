import { SectionHeader } from "./SectionHeader.jsx";

export function Testimonials({ content }) {
  return (
    <section className="section section--muted" id="testimonials">
      <div className="container">
        <SectionHeader label={content.label} title={content.title} />
        <div className="testimonials-grid">
          {content.items.map((testimonial) => (
            <article key={testimonial.name} className="testimonial-card glass-card">
              <p className="testimonial-card__quote">“{testimonial.quote}”</p>
              <div className="testimonial-card__meta">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

