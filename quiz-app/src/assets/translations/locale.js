const DEFAULT_FILE = {
  complete: 'Complete',
  error: 'Error',
  quizzes: [],
  title: 'Default Quiz',
};

export function normalizeLocale(locale) {
  return String(locale || '')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-');
}

/**
 * Pick the quiz translation for a browser or `?loc=` locale.
 * `zh-CN` must match the `zh_cn` file. A region-only prefix such as `zh`
 * does not guess between `zh-cn` and `zh-tw`.
 */
export function selectMessageFile(messages, locale) {
  const entries = Object.entries(messages || {}).map(([key, file]) => [normalizeLocale(key), file]);
  const fallback = entries.find(([key]) => key === 'en')?.[1] || entries[0]?.[1] || DEFAULT_FILE;
  const requested = normalizeLocale(locale);
  if (!requested) return fallback;

  const exact = entries.find(([key]) => key === requested);
  if (exact) return exact[1];

  const language = requested.split('-')[0];
  const byLanguage = entries.find(([key]) => key === language);
  if (byLanguage) return byLanguage[1];

  return fallback;
}
