import { LuArrowDown, LuArrowUp } from 'react-icons/lu';

/** Ordered checklist: tick the resume sections to include and arrange their order. */
export default function SectionsField({ value = [], onChange, options }) {
  const labelOf = (key) => options.find((o) => o.value === key)?.label || key;
  const unused = options.filter((o) => !value.includes(o.value));

  const move = (index, dir) => {
    const next = [...value];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    onChange(next);
  };

  return (
    <div className="sections-field">
      <ol className="sections-field__list">
        {value.map((key, index) => (
          <li key={key} className="sections-field__item">
            <label className="checkbox">
              <input type="checkbox" checked onChange={() => onChange(value.filter((k) => k !== key))} />
              <span className="sections-field__num">{index + 1}</span>
              {labelOf(key)}
            </label>
            <div className="row">
              <button type="button" className="btn btn-ghost btn-icon btn-sm" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up">
                <LuArrowUp />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-icon btn-sm"
                disabled={index === value.length - 1}
                onClick={() => move(index, 1)}
                aria-label="Move down"
              >
                <LuArrowDown />
              </button>
            </div>
          </li>
        ))}
      </ol>
      {unused.length > 0 && (
        <div className="sections-field__unused">
          {unused.map((o) => (
            <label key={o.value} className="checkbox">
              <input type="checkbox" checked={false} onChange={() => onChange([...value, o.value])} />
              {o.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
