import { useRef, useState } from 'react';
import { LuImage, LuTrash2, LuUpload } from 'react-icons/lu';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../lib/api.js';

/** Upload an image (stored in server/uploads) or paste any image URL, e.g. /images/me.jpg from client/public. */
export default function ImageField({ id, value = '', onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);
  const toast = useToast();

  const upload = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast('Image must be smaller than 5 MB.', 'error');
    setUploading(true);
    try {
      const { url } = await api.upload(file);
      setBroken(false);
      onChange(url);
      toast('Image uploaded');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div
      className="image-field"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        upload(e.dataTransfer.files?.[0]);
      }}
    >
      <div className="image-field__preview">
        {value && !broken ? <img src={value} alt="" onError={() => setBroken(true)} /> : <LuImage aria-hidden="true" />}
      </div>
      <div className="image-field__controls">
        <input
          id={id}
          className="input"
          value={value}
          placeholder="Upload, drop an image here, or paste a URL"
          onChange={(e) => {
            setBroken(false);
            onChange(e.target.value);
          }}
        />
        <div className="row">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <span className="spinner" /> : <LuUpload />} {uploading ? 'Uploading…' : 'Upload image'}
          </button>
          {value && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('')}>
              <LuTrash2 /> Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          hidden
          onChange={(e) => upload(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
