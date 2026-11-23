// Collision and high-score helpers for the space game, kept free of the canvas
// so the core rules can be tested without a browser.

function circlesOverlap(x1, y1, r1, x2, y2, r2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const rr = Number(r1) + Number(r2);
  return dx * dx + dy * dy < rr * rr;
}

function rankScores(raw, limit) {
  const cap = Number.isInteger(limit) && limit > 0 ? limit : 10;
  const list = Array.isArray(raw) ? raw : [];
  return list
    .filter((item) => item && typeof item === 'object' && Number.isFinite(Number(item.score)))
    .map((item) => ({
      initials: String(item.initials || 'YOU').slice(0, 10),
      score: Number(item.score),
      t: Number(item.t) || 0,
    }))
    .sort((a, b) => b.score - a.score || b.t - a.t)
    .slice(0, cap);
}

function readScoreList(storage, key) {
  const storageKey = key || 'spaceGameScores';
  try {
    const raw = storage && typeof storage.getItem === 'function' ? storage.getItem(storageKey) : null;
    return rankScores(JSON.parse(raw || '[]'));
  } catch {
    return [];
  }
}

function writeScoreList(storage, score, initials, key) {
  const storageKey = key || 'spaceGameScores';
  const next = rankScores([
    ...readScoreList(storage, storageKey),
    { initials: initials || 'YOU', score: score, t: Date.now() },
  ]);
  try {
    if (storage && typeof storage.setItem === 'function') {
      storage.setItem(storageKey, JSON.stringify(next));
    }
  } catch {
    // Quota or private-mode failures should not break game over.
  }
  return next;
}

const SpaceGameRules = { circlesOverlap, rankScores, readScoreList, writeScoreList };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpaceGameRules;
}
if (typeof window !== 'undefined') {
  window.circlesOverlap = circlesOverlap;
  window.rankScores = rankScores;
  window.readScoreList = readScoreList;
  window.writeScoreList = writeScoreList;
}
