export default function Spinner({ fullscreen = false, label = 'Loading…' }) {
  if (!fullscreen) return <span className="spinner" role="status" aria-label={label} />;
  return (
    <div className="spinner-screen" role="status" aria-label={label}>
      <span className="spinner spinner--lg" />
    </div>
  );
}
