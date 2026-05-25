import { SectionHeader } from "./SectionHeader.jsx";
import { ProjectModal } from "./ProjectModal.jsx";

export function Projects({
  content,
  filters,
  activeFilter,
  onFilterChange,
  projects,
  onProjectSelect,
  selectedProject,
  onCloseModal,
}) {
  return (
    <section className="section section--muted" id="projects">
      <div className="container">
        <SectionHeader label={content.label} title={content.title} />

        <div className="project-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? "is-active" : ""}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project.id} className="project-card glass-card">
              <div
                className="project-card__image"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(15,15,16,0.15), rgba(15,15,16,0.7)), url(${project.image})` }}
              />
              <div className="project-card__content">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <button type="button" className="text-link" onClick={() => onProjectSelect(project)}>
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={onCloseModal} />
    </section>
  );
}

