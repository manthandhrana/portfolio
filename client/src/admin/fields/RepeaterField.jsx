import { LuArrowDown, LuArrowUp, LuPlus, LuTrash2 } from 'react-icons/lu';

/** A list of small objects, e.g. stats: [{ value: '3+', label: 'Years experience' }]. */
export default function RepeaterField({ value = [], onChange, fields, addLabel = 'Add row' }) {
  const update = (index, name, fieldValue) => onChange(value.map((row, i) => (i === index ? { ...row, [name]: fieldValue } : row)));
  const move = (index, dir) => {
    const next = [...value];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    onChange(next);
  };

  return (
    <div className="repeater">
      {value.map((row, index) => (
        <div className="repeater__row" key={index}>
          {fields.map((f) => (
            <input
              key={f.name}
              className="input"
              placeholder={f.placeholder || f.label}
              aria-label={f.label}
              value={row[f.name] ?? ''}
              onChange={(e) => update(index, f.name, e.target.value)}
              style={f.width ? { flex: `0 0 ${f.width}` } : undefined}
            />
          ))}
          <div className="repeater__actions">
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
            <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label="Remove">
              <LuTrash2 />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => onChange([...value, Object.fromEntries(fields.map((f) => [f.name, '']))])}
      >
        <LuPlus /> {addLabel}
      </button>
    </div>
  );
}
