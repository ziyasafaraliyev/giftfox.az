import { useEffect, useState } from "react";

export function Navbar({ navItems }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <a className="navbar__brand" href="#home">
          <span className="navbar__brand-mark">ZC</span>
          <div>
            <strong>Ziya Construction</strong>
            <span>Premium Construction</span>
          </div>
        </a>

        <button
          className="navbar__toggle"
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__nav ${isMenuOpen ? "navbar__nav--open" : ""}`}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="button button--small" href="#contact" onClick={() => setIsMenuOpen(false)}>
            Start a Project
          </a>
        </nav>
      </div>
    </header>
  );
}

