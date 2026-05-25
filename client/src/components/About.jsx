import { SectionHeader } from "./SectionHeader.jsx";

export function About({ content }) {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHeader label={content.label} title={content.title} description={content.description} />
        <div className="about-grid">
          {content.pillars.map((pillar) => (
            <article key={pillar.title} className="glass-card about-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

