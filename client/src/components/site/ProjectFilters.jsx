/** Category tabs ("All", "Web App", "Security"…), built from the projects that exist. */
export function projectCategories(projects) {
  return ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
}

export default function ProjectFilters({ categories, active, onChange }) {
  if (categories.length <= 2) return null;
  return (
    <div className="filters" role="tablist" aria-label="Filter projects">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={active === category}
          className={`filters__btn ${active === category ? 'is-active' : ''}`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
