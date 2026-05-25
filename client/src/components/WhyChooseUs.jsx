import { SectionHeader } from "./SectionHeader.jsx";

export function WhyChooseUs({ content }) {
  return (
    <section className="section">
      <div className="container why-grid">
        <div>
          <SectionHeader label={content.label} title={content.title} />
        </div>
        <div className="why-list">
          {content.items.map((item) => (
            <article key={item} className="why-list__item glass-card">
              <span className="why-list__bullet" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

