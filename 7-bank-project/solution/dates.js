// Parse yyyy-mm-dd as a local calendar date. `new Date('2020-10-01')` is UTC
// midnight, which is the previous evening in timezones west of UTC.

function parseCalendarDate(dateStr) {
  if (!dateStr) return new Date();

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr).trim());
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const local = new Date(year, month - 1, day);
    if (local.getFullYear() === year && local.getMonth() === month - 1 && local.getDate() === day) {
      return local;
    }
  }

  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return new Date();
  return parsed;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseCalendarDate };
}
