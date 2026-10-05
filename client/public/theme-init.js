// Runs before React renders so the page never flashes the wrong theme.
// (A module file rather than an inline script so it works with the strict Content-Security-Policy.)
let theme;
try {
  theme = localStorage.getItem('theme');
} catch {
  /* storage blocked — fall back to the system setting */
}
if (theme !== 'light' && theme !== 'dark') {
  theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
document.documentElement.dataset.theme = theme;
