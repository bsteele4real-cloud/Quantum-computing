const THEME_KEY = 'bankTheme';

function preferredTheme(storage, matchMedia) {
  try {
    const saved = storage && typeof storage.getItem === 'function' ? storage.getItem(THEME_KEY) : null;
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore
  }
  const media = matchMedia || (typeof window !== 'undefined' && window.matchMedia);
  if (typeof media === 'function') {
    try {
      if (media('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch {
      // ignore
    }
  }
  return 'light';
}

function applyTheme(theme, doc, storage) {
  const next = theme === 'dark' ? 'dark' : 'light';
  const root = doc && doc.documentElement;
  if (root && root.setAttribute) root.setAttribute('data-theme', next);
  try {
    if (storage && typeof storage.setItem === 'function') storage.setItem(THEME_KEY, next);
  } catch {
    // ignore
  }
  const btn = doc && doc.getElementById && doc.getElementById('themeToggle');
  if (btn && btn.setAttribute) {
    btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  return next;
}

function toggleTheme(doc, storage, matchMedia) {
  const current = (doc && doc.documentElement && doc.documentElement.getAttribute('data-theme')) || preferredTheme(storage, matchMedia);
  return applyTheme(current === 'dark' ? 'light' : 'dark', doc, storage);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { preferredTheme, applyTheme, toggleTheme, THEME_KEY };
}
if (typeof window !== 'undefined') {
  window.preferredTheme = preferredTheme;
  window.applyTheme = applyTheme;
  window.toggleTheme = toggleTheme;
}
