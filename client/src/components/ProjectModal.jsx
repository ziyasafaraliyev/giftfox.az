import { useEffect } from "react";

export function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close project details">
          ×
        </button>
        <div
          className="modal-card__image"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(15,15,16,0.1), rgba(15,15,16,0.6)), url(${project.image})` }}
        />
        <div className="modal-card__content">
          <span>{project.category}</span>
          <h3>{project.title}</h3>
          <p>{project.details}</p>
        </div>
      </div>
    </div>
  );
}
