export function CTASection({ content }) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner glass-card">
          <div>
            <span className="section-label">Let’s Build</span>
            <h2>{content.title}</h2>
            <p>{content.description}</p>
          </div>
          <a className="button" href={content.primaryAction.href}>
            {content.primaryAction.label}
          </a>
        </div>
      </div>
    </section>
  );
}

