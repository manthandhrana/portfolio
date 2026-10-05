import { useMemo, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import { Icon, ICON_NAMES } from '../../lib/icons.jsx';

export default function IconPicker({ id, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const names = useMemo(() => ICON_NAMES.filter((n) => n.includes(query.toLowerCase().trim())), [query]);

  return (
    <div className="icon-picker">
      <button id={id} type="button" className="input icon-picker__trigger" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="icon-picker__current">{value ? <Icon name={value} /> : null}</span>
        <span>{value || 'No icon'}</span>
        <LuChevronDown className="icon-picker__chevron" />
      </button>
      {open && (
        <div className="icon-picker__panel">
          <input className="input" placeholder="Search icons (react, shield, cart…)" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
          <div className="icon-picker__grid">
            <button
              type="button"
              className={`icon-picker__item ${!value ? 'is-active' : ''}`}
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              title="No icon"
            >
              <span className="icon-picker__none">∅</span>
              <small>none</small>
            </button>
            {names.map((name) => (
              <button
                key={name}
                type="button"
                className={`icon-picker__item ${value === name ? 'is-active' : ''}`}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                title={name}
              >
                <Icon name={name} />
                <small>{name}</small>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
