import { SectionHeader } from "./SectionHeader.jsx";

export function Process({ content }) {
  return (
    <section className="section" id="process">
      <div className="container">
        <SectionHeader label={content.label} title={content.title} align="center" />
        <div className="process-grid">
          {content.steps.map((step) => (
            <article key={step.number} className="process-card glass-card">
              <span className="process-card__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

