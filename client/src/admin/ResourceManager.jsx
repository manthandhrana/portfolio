import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LuArrowDown,
  LuArrowUp,
  LuCopy,
  LuDownload,
  LuEye,
  LuEyeOff,
  LuFileCheck,
  LuFileX,
  LuPencil,
  LuPlus,
  LuSearch,
  LuTrash2,
} from 'react-icons/lu';
import Spinner from '../components/ui/Spinner.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api, resumeUrl } from '../lib/api.js';
import Drawer from './Drawer.jsx';
import FormField, { setPath } from './fields/FormField.jsx';
import GithubSync from './GithubSync.jsx';

const SYSTEM_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt', 'slug'];

function searchable(item) {
  return Object.values(item)
    .filter((v) => typeof v === 'string' || Array.isArray(v))
    .flat()
    .join(' ')
    .toLowerCase();
}

/** List + add/edit/delete/reorder screen for any content type described in resources.jsx. */
export default function ResourceManager({ resource }) {
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState(null); // null | { values, isNew }
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const endpoint = `/admin/${resource.path}`;

  const load = useCallback(() => {
    api
      .get(endpoint)
      .then(setItems)
      .catch((err) => toast(err.message, 'error'));
  }, [endpoint, toast]);

  useEffect(load, [load]);

  const filterOptions = useMemo(
    () => (resource.filterField && items ? [...new Set(items.map((i) => i[resource.filterField]).filter(Boolean))] : []),
    [items, resource.filterField],
  );

  const shown = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    return items.filter((item) => (!filter || item[resource.filterField] === filter) && (!q || searchable(item).includes(q)));
  }, [items, query, filter, resource.filterField]);

  const openNew = () => {
    setErrors({});
    setEditing({ isNew: true, values: { ...resource.defaults, order: items?.length || 0 } });
  };

  const openEdit = (item, duplicate = false) => {
    setErrors({});
    const values = structuredClone(item);
    if (duplicate) {
      SYSTEM_FIELDS.forEach((f) => delete values[f]);
      values[resource.fields[0].name] = `${values[resource.fields[0].name]} (copy)`;
      values.isDefault = false;
    }
    setEditing({ isNew: duplicate, values });
  };

  const close = useCallback(() => setEditing(null), []);

  const save = async (e) => {
    e?.preventDefault();
    const missing = resource.fields.filter((f) => f.required && !String(editing.values[f.name] ?? '').trim());
    if (missing.length) {
      setErrors(Object.fromEntries(missing.map((f) => [f.name, `${f.label} is required`])));
      return;
    }
    setSaving(true);
    try {
      const { values, isNew } = editing;
      if (isNew) await api.post(endpoint, values);
      else await api.put(`${endpoint}/${values._id}`, values);
      toast(`${resource.singular[0].toUpperCase()}${resource.singular.slice(1)} saved`);
      setEditing(null);
      load();
    } catch (err) {
      setErrors(err.errors || {});
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    const label = item[resource.fields[0].name];
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    try {
      await api.delete(`${endpoint}/${item._id}`);
      toast('Deleted');
      setItems((list) => list.filter((i) => i._id !== item._id));
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const toggle = async (item, field) => {
    const next = !item[field];
    setItems((list) => list.map((i) => (i._id === item._id ? { ...i, [field]: next } : i)));
    try {
      await api.patch(`${endpoint}/${item._id}`, { [field]: next });
    } catch (err) {
      toast(err.message, 'error');
      load();
    }
  };

  const move = async (index, dir) => {
    const next = [...items];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    setItems(next);
    try {
      await api.post(`${endpoint}/reorder`, { ids: next.map((i) => i._id) });
    } catch (err) {
      toast(err.message, 'error');
      load();
    }
  };

  const canReorder = resource.sortable && !query && !filter;
  const hasResumeFlag = resource.fields.some((f) => f.name === 'showInResume');
  const [primaryCol, ...otherCols] = resource.columns;

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__heading">
          <span className="icon-box icon-box--sm">
            <resource.icon />
          </span>
          <div>
            <h1>{resource.title}</h1>
            <p className="muted">{resource.description}</p>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNew}>
          <LuPlus /> Add {resource.singular}
        </button>
      </header>

      {resource.githubSync && <GithubSync onSynced={load} />}

      <div className="toolbar">
        <label className="search">
          <LuSearch aria-hidden="true" />
          <span className="sr-only">Search</span>
          <input className="input" type="search" placeholder={`Search ${resource.title.toLowerCase()}…`} value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        {filterOptions.length > 1 && (
          <select className="select toolbar__filter" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">
            <option value="">All {resource.filterField === 'type' ? 'types' : 'categories'}</option>
            {filterOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        )}
        {items && <span className="toolbar__count">{shown.length} of {items.length}</span>}
      </div>

      {!items ? (
        <div className="page__loading">
          <Spinner />
        </div>
      ) : shown.length === 0 ? (
        <div className="card empty">
          <resource.icon className="empty__icon" />
          <p>{items.length ? 'Nothing matches your search.' : `No ${resource.title.toLowerCase()} yet.`}</p>
          {!items.length && (
            <button type="button" className="btn btn-primary" onClick={openNew}>
              <LuPlus /> Add your first {resource.singular}
            </button>
          )}
        </div>
      ) : (
        <div className="card table-card">
          <table className="table">
            <thead>
              <tr>
                {canReorder && <th className="table__narrow" aria-label="Order" />}
                <th>{primaryCol.label}</th>
                {otherCols.map((c) => (
                  <th key={c.label} className="table__hide-sm">
                    {c.label}
                  </th>
                ))}
                <th className="table__actions-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((item, index) => (
                <tr key={item._id} className={item.visible === false ? 'is-hidden' : ''}>
                  {canReorder && (
                    <td className="table__narrow">
                      <div className="reorder">
                        <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up">
                          <LuArrowUp />
                        </button>
                        <button type="button" disabled={index === shown.length - 1} onClick={() => move(index, 1)} aria-label="Move down">
                          <LuArrowDown />
                        </button>
                      </div>
                    </td>
                  )}
                  <td>
                    <button type="button" className="table__primary" onClick={() => openEdit(item)}>
                      {primaryCol.image && (
                        <span className="table__thumb">{primaryCol.image(item) ? <img src={primaryCol.image(item)} alt="" /> : null}</span>
                      )}
                      {primaryCol.icon && <span className="table__icon">{primaryCol.icon(item)}</span>}
                      <span className="table__text">
                        <strong>{primaryCol.primary(item) || 'Untitled'}</strong>
                        {primaryCol.secondary?.(item) && <small>{primaryCol.secondary(item)}</small>}
                      </span>
                    </button>
                  </td>
                  {otherCols.map((c) => (
                    <td key={c.label} className="table__hide-sm">
                      {c.render(item)}
                    </td>
                  ))}
                  <td>
                    <div className="table__actions">
                      {resource.resumeActions && (
                        <>
                          <a className="btn btn-ghost btn-icon btn-sm" href={resumeUrl(item.slug)} target="_blank" rel="noreferrer" title="Preview PDF">
                            <LuEye />
                          </a>
                          <a className="btn btn-ghost btn-icon btn-sm" href={resumeUrl(item.slug, true)} title="Download PDF">
                            <LuDownload />
                          </a>
                        </>
                      )}
                      {!resource.resumeActions && (
                        <button
                          type="button"
                          className={`btn btn-ghost btn-icon btn-sm ${item.visible === false ? 'is-off' : ''}`}
                          onClick={() => toggle(item, 'visible')}
                          title={item.visible === false ? 'Hidden from website — click to show' : 'Visible on website — click to hide'}
                        >
                          {item.visible === false ? <LuEyeOff /> : <LuEye />}
                        </button>
                      )}
                      {hasResumeFlag && (
                        <button
                          type="button"
                          className={`btn btn-ghost btn-icon btn-sm ${item.showInResume === false ? 'is-off' : ''}`}
                          onClick={() => toggle(item, 'showInResume')}
                          title={item.showInResume === false ? 'Not in resume — click to include' : 'Included in resume — click to exclude'}
                        >
                          {item.showInResume === false ? <LuFileX /> : <LuFileCheck />}
                        </button>
                      )}
                      <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(item)} title="Edit">
                        <LuPencil />
                      </button>
                      <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(item, true)} title="Duplicate">
                        <LuCopy />
                      </button>
                      <button type="button" className="btn btn-ghost btn-icon btn-sm btn-danger-ghost" onClick={() => remove(item)} title="Delete">
                        <LuTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Drawer
          title={`${editing.isNew ? 'Add' : 'Edit'} ${resource.singular}`}
          onClose={close}
          footer={
            <>
              <button type="button" className="btn btn-ghost" onClick={close}>
                Cancel
              </button>
              <button type="submit" form="resource-form" className="btn btn-primary" disabled={saving}>
                {saving && <span className="spinner" />} {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <form id="resource-form" className="form-grid" onSubmit={save} noValidate>
            {resource.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                values={editing.values}
                error={errors[field.name]}
                onChange={(name, value) => setEditing((ed) => ({ ...ed, values: setPath(ed.values, name, value) }))}
              />
            ))}
          </form>
        </Drawer>
      )}
    </div>
  );
}
