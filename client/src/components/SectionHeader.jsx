export function SectionHeader({ label, title, description, align = "left" }) {
  return (
    <div className={`section-header section-header--${align}`}>
      <span className="section-label">{label}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

