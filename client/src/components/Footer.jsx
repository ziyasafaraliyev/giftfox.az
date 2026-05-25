export function Footer({ content }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <a className="navbar__brand footer__brand" href="#home">
            <span className="navbar__brand-mark">ZC</span>
            <div>
              <strong>{content.brand}</strong>
              <span>{content.tagline}</span>
            </div>
          </a>
        </div>

        <div>
          <h4>Quick Links</h4>
          <div className="footer__links">
            {content.quickLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4>Social</h4>
          <div className="footer__links">
            {content.socials.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {year} {content.brand}. All rights reserved.</p>
      </div>
    </footer>
  );
}
