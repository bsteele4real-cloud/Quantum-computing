// Opening-balance parsing for the registration form.
// An empty field is zero. A non-numeric value is an error, not a silent zero.
function parseBalance(value) {
  if (value === '' || value === undefined || value === null) {
    return { ok: true, value: 0 };
  }
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return { ok: false, error: 'Balance must be a valid number' };
  }
  return { ok: true, value: n };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseBalance };
}
if (typeof window !== 'undefined') {
  window.parseBalance = parseBalance;
}
