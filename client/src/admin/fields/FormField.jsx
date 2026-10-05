import { useState } from 'react';
import IconPicker from './IconPicker.jsx';
import ImageField from './ImageField.jsx';
import RepeaterField from './RepeaterField.jsx';
import SectionsField from './SectionsField.jsx';
import TagsField from './TagsField.jsx';

/** Reads "socials.github" style paths. */
export const getPath = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

/** Immutable write for "socials.github" style paths. */
export function setPath(obj, path, value) {
  const [key, ...rest] = path.split('.');
  return { ...obj, [key]: rest.length ? setPath(obj?.[key] || {}, rest.join('.'), value) : value };
}

/** Textarea where each line becomes one array item (for bullet points). */
function LinesField({ id, value = [], onChange, rows = 4, placeholder }) {
  const [text, setText] = useState(value.join('\n'));
  return (
    <textarea
      id={id}
      className="textarea"
      rows={Math.max(rows, Math.min(value.length + 1, 10))}
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split('\n')
            .map((line) => line.replace(/^\s*[-•*]\s*/, '').trim())
            .filter(Boolean),
        );
      }}
    />
  );
}

const normaliseOptions = (options = []) =>
  options.map((o) => (typeof o === 'object' ? o : { value: o, label: o === '' ? '— None —' : String(o) }));

export default function FormField({ field, values, onChange, error }) {
  if (field.showIf && !field.showIf(values)) return null;

  const id = `field-${field.name.replace(/\./g, '-')}`;
  const value = getPath(values, field.name);
  const set = (v) => onChange(field.name, v);
  const type = field.type || 'text';
  const common = { id, 'aria-invalid': error ? 'true' : undefined };

  let control;
  switch (type) {
    case 'textarea':
      control = (
        <textarea
          {...common}
          className="textarea"
          rows={field.rows || 4}
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => set(e.target.value)}
        />
      );
      break;
    case 'lines':
      control = <LinesField id={id} value={value} onChange={set} rows={field.rows} placeholder={field.placeholder} />;
      break;
    case 'tags':
      control = <TagsField id={id} value={value} onChange={set} suggestions={field.suggestions} placeholder={field.placeholder} />;
      break;
    case 'select':
      control = (
        <select
          {...common}
          className="select"
          value={value ?? ''}
          onChange={(e) => {
            const raw = e.target.value;
            set(typeof field.options?.[0] === 'number' || typeof field.options?.[0]?.value === 'number' ? Number(raw) : raw);
          }}
        >
          {normaliseOptions(field.options).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case 'combo':
      control = (
        <>
          <input {...common} className="input" list={`${id}-list`} value={value ?? ''} placeholder={field.placeholder} onChange={(e) => set(e.target.value)} />
          <datalist id={`${id}-list`}>
            {field.options.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </>
      );
      break;
    case 'switch':
      return (
        <label className={`switch-row ${field.full ? 'field--full' : ''}`} htmlFor={id}>
          <span className="switch">
            <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => set(e.target.checked)} />
            <span />
          </span>
          <span>
            <span className="label">{field.label}</span>
            {field.hint && <span className="hint">{field.hint}</span>}
          </span>
        </label>
      );
    case 'range':
      control = (
        <div className="range-field">
          <input
            {...common}
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={value ?? 0}
            onChange={(e) => set(Number(e.target.value))}
          />
          <output htmlFor={id}>{value ?? 0}%</output>
        </div>
      );
      break;
    case 'number':
      control = (
        <input
          {...common}
          type="number"
          className="input"
          min={field.min}
          max={field.max}
          value={value ?? ''}
          onChange={(e) => set(e.target.value === '' ? '' : Number(e.target.value))}
        />
      );
      break;
    case 'month':
      control = (
        <input {...common} type="month" className="input" placeholder="YYYY-MM" value={value ?? ''} onChange={(e) => set(e.target.value)} />
      );
      break;
    case 'color':
      control = (
        <div className="color-field">
          <input type="color" value={value || '#000000'} onChange={(e) => set(e.target.value)} aria-label={field.label} />
          <input {...common} className="input" value={value ?? ''} onChange={(e) => set(e.target.value)} placeholder="#5b4ae6" />
        </div>
      );
      break;
    case 'image':
      control = <ImageField id={id} value={value} onChange={set} />;
      break;
    case 'icon':
      control = <IconPicker id={id} value={value} onChange={set} />;
      break;
    case 'repeater':
      control = <RepeaterField value={value} onChange={set} fields={field.fields} addLabel={field.addLabel} />;
      break;
    case 'sections':
      control = <SectionsField value={value} onChange={set} options={field.options} />;
      break;
    default:
      control = (
        <input
          {...common}
          type={type}
          className="input"
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => set(e.target.value)}
        />
      );
  }

  return (
    <div className={`field ${field.full ? 'field--full' : ''}`}>
      <label className="label" htmlFor={id}>
        {field.label}
        {field.required && <span className="req">*</span>}
      </label>
      {control}
      {error ? <span className="error-text">{error}</span> : field.hint && <span className="hint">{field.hint}</span>}
    </div>
  );
}
