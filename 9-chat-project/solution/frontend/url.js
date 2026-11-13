// Join a base URL and a path with a single slash.
function joinUrl(base, path) {
  const left = String(base || '').replace(/\/+$/, '');
  const right = String(path || '').replace(/^\/+/, '');
  if (!left) return right;
  if (!right) return left;
  return left + '/' + right;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { joinUrl };
}
