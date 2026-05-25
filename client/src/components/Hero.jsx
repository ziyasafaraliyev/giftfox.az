export function Hero({ content }) {
  return (
    <section className="hero" id="home">
      <div className="hero__backdrop" />
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p className="hero__subtitle">{content.subtitle}</p>
          <p className="hero__description">{content.description}</p>

          <div className="hero__actions">
            <a className="button" href={content.primaryAction.href}>
              {content.primaryAction.label}
            </a>
            <a className="button button--ghost" href={content.secondaryAction.href}>
              {content.secondaryAction.label}
            </a>
          </div>

          <ul className="hero__highlights">
            {content.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="hero__panel glass-card">
          <div className="hero__panel-image" />
          <div className="hero__stats">
            {content.stats.map((stat) => (
              <article key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

