import { useCallback, useEffect, useState } from 'react';
import {
  LuArchive,
  LuArrowLeft,
  LuInbox,
  LuMail,
  LuPhone,
  LuReply,
  LuSearch,
  LuStar,
  LuTrash2,
} from 'react-icons/lu';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';
import { formatDateTime, timeAgo } from '../lib/format.js';
import { FaWhatsapp } from '../lib/icons.jsx';
import { MESSAGES_CHANGED } from './useUnread.js';

const FILTERS = [
  { key: 'inbox', label: 'Inbox' },
  { key: 'new', label: 'Unread' },
  { key: 'starred', label: 'Starred' },
  { key: 'replied', label: 'Replied' },
  { key: 'archived', label: 'Archived' },
];

const STATUS_BADGE = { new: 'badge', read: 'badge badge--neutral', replied: 'badge badge--success', archived: 'badge badge--warning' };

const notifyChanged = () => window.dispatchEvent(new Event(MESSAGES_CHANGED));

export default function Messages() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState('inbox');
  const [query, setQuery] = useState('');
  const [list, setList] = useState(null);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const selectedId = params.get('id');

  const load = useCallback(() => {
    const qs = new URLSearchParams({ filter, ...(query.trim() && { q: query.trim() }) });
    api
      .get(`/admin/messages?${qs}`)
      .then(setList)
      .catch((err) => toast(err.message, 'error'));
  }, [filter, query, toast]);

  useEffect(() => {
    const timer = setTimeout(load, query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, query]);

  useEffect(() => {
    if (!selectedId) {
      setSelected(null);
      return;
    }
    api
      .get(`/admin/messages/${selectedId}`)
      .then((m) => {
        setSelected(m);
        setNotes(m.notes || '');
        setList((items) => items?.map((i) => (i._id === m._id ? { ...i, status: m.status } : i)));
        notifyChanged();
      })
      .catch((err) => toast(err.message, 'error'));
  }, [selectedId, toast]);

  const open = (id) => setParams(id ? { id } : {});

  const update = async (changes, successMessage) => {
    try {
      const m = await api.patch(`/admin/messages/${selected._id}`, changes);
      setSelected(m);
      setList((items) => items.map((i) => (i._id === m._id ? { ...i, ...changes } : i)));
      notifyChanged();
      if (successMessage) toast(successMessage);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete the message from ${selected.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/messages/${selected._id}`);
      setList((items) => items.filter((i) => i._id !== selected._id));
      open(null);
      notifyChanged();
      toast('Message deleted');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const replyHref = (m) =>
    `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || m.service || 'Your enquiry'}`)}&body=${encodeURIComponent(
      `Hi ${m.name.split(' ')[0]},\n\nThank you for reaching out!\n\n\n\n---\nOn ${formatDateTime(m.createdAt)}, ${m.name} wrote:\n> ${m.message.split('\n').join('\n> ')}`,
    )}`;
  const whatsappNumber = (phone = '') => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__heading">
          <span className="icon-box icon-box--sm">
            <LuInbox />
          </span>
          <div>
            <h1>Messages</h1>
            <p className="muted">Enquiries from the contact form on your website.</p>
          </div>
        </div>
      </header>

      <div className={`inbox ${selected ? 'inbox--reading' : ''}`}>
        <div className="card inbox__list">
          <div className="inbox__filters">
            {FILTERS.map((f) => (
              <button key={f.key} type="button" className={`filters__btn ${filter === f.key ? 'is-active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <label className="search">
            <LuSearch aria-hidden="true" />
            <span className="sr-only">Search messages</span>
            <input className="input" type="search" placeholder="Search name, email, text…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>

          {!list ? (
            <div className="page__loading">
              <Spinner />
            </div>
          ) : list.length === 0 ? (
            <p className="muted inbox__empty">No messages here.</p>
          ) : (
            <ul className="inbox__items">
              {list.map((m) => (
                <li key={m._id}>
                  <button
                    type="button"
                    className={`inbox__item ${m.status === 'new' ? 'is-unread' : ''} ${selected?._id === m._id ? 'is-selected' : ''}`}
                    onClick={() => open(m._id)}
                  >
                    <span className="inbox__item-top">
                      <strong>{m.name}</strong>
                      <time>{timeAgo(m.createdAt)}</time>
                    </span>
                    <span className="inbox__item-subject">
                      {m.starred && <LuStar className="is-starred" />}
                      {m.subject || m.service || 'No subject'}
                    </span>
                    <span className="inbox__item-preview">{m.message}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card inbox__detail">
          {!selected ? (
            <div className="empty">
              <LuMail className="empty__icon" />
              <p>Select a message to read it.</p>
            </div>
          ) : (
            <article className="message">
              <button type="button" className="btn btn-ghost btn-sm message__back" onClick={() => open(null)}>
                <LuArrowLeft /> Back
              </button>
              <header className="message__header">
                <div>
                  <h2>{selected.subject || selected.service || 'New enquiry'}</h2>
                  <p className="muted">
                    {selected.name} · <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </p>
                  <p className="message__date">{formatDateTime(selected.createdAt)}</p>
                </div>
                <span className={STATUS_BADGE[selected.status]}>{selected.status}</span>
              </header>

              <dl className="message__meta">
                {selected.service && (
                  <div>
                    <dt>Service</dt>
                    <dd>{selected.service}</dd>
                  </div>
                )}
                {selected.budget && (
                  <div>
                    <dt>Budget</dt>
                    <dd>{selected.budget}</dd>
                  </div>
                )}
                {selected.phone && (
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`}>{selected.phone}</a>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="message__body">{selected.message}</div>

              <div className="message__actions">
                <a className="btn btn-primary" href={replyHref(selected)} onClick={() => update({ status: 'replied' })}>
                  <LuReply /> Reply by email
                </a>
                {selected.phone && (
                  <>
                    <a className="btn btn-whatsapp" href={`https://wa.me/${whatsappNumber(selected.phone)}`} target="_blank" rel="noreferrer">
                      <FaWhatsapp /> WhatsApp
                    </a>
                    <a className="btn btn-outline" href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`}>
                      <LuPhone /> Call
                    </a>
                  </>
                )}
              </div>

              <div className="message__toolbar">
                <button type="button" className={`btn btn-ghost btn-sm ${selected.starred ? 'is-starred' : ''}`} onClick={() => update({ starred: !selected.starred })}>
                  <LuStar /> {selected.starred ? 'Starred' : 'Star'}
                </button>
                <select
                  className="select select--sm"
                  value={selected.status}
                  onChange={(e) => update({ status: e.target.value }, 'Status updated')}
                  aria-label="Status"
                >
                  <option value="new">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                {selected.status !== 'archived' && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ status: 'archived' }, 'Archived')}>
                    <LuArchive /> Archive
                  </button>
                )}
                <button type="button" className="btn btn-ghost btn-sm btn-danger-ghost" onClick={remove}>
                  <LuTrash2 /> Delete
                </button>
              </div>

              <div className="field">
                <label className="label" htmlFor="message-notes">
                  Private notes
                </label>
                <textarea
                  id="message-notes"
                  className="textarea"
                  rows={3}
                  placeholder="Quote sent, follow up on Monday…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => notes !== (selected.notes || '') && update({ notes }, 'Notes saved')}
                />
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
