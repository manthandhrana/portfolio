import { useState } from 'react';
import { LuX } from 'react-icons/lu';

/** Array-of-strings input: type and press Enter or comma. Pasting "a, b, c" adds all three. */
export default function TagsField({ id, value = [], onChange, placeholder = 'Type and press Enter', suggestions = [] }) {
  const [draft, setDraft] = useState('');
  const listId = suggestions.length ? `${id}-suggestions` : undefined;

  const add = (text) => {
    const items = text
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => !value.some((v) => v.toLowerCase() === t.toLowerCase()));
    if (items.length) onChange([...value, ...items]);
    setDraft('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="tags-input">
      {value.map((tag) => (
        <span key={tag} className="tags-input__tag">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove ${tag}`}>
            <LuX />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        list={listId}
        placeholder={value.length ? '' : placeholder}
        onChange={(e) => {
          const text = e.target.value;
          if (text.includes(',')) add(text);
          else setDraft(text);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => draft && add(draft)}
      />
      {listId && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}
