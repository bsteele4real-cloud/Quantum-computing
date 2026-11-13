export function isValidGridSize(size) {
  return Number.isInteger(size) && size >= 2 && size <= 10 && size % 2 === 0;
}

export function clickCard(state, id) {
  if (!state || state.disabled || state.won) return state;
  if (state.selectedPairs.includes(id)) return state;

  if (state.flipped.length === 0) {
    return { ...state, flipped: [id] };
  }

  if (state.flipped.length === 1) {
    const firstId = state.flipped[0];
    if (id === firstId) {
      return { ...state, flipped: [], disabled: false };
    }

    const isMatch = state.cards[firstId].number === state.cards[id].number;
    if (isMatch) {
      const selectedPairs = [...state.selectedPairs, firstId, id];
      const won = selectedPairs.length === state.cards.length && state.cards.length > 0;
      return { ...state, selectedPairs, flipped: [], disabled: false, won };
    }

    return { ...state, flipped: [firstId, id], disabled: true, won: false };
  }

  return state;
}

export function clearMismatch(state) {
  return { ...state, flipped: [], disabled: false };
}

// A click that is ignored (the board is already locked, or the card is already
// matched) returns the same state object. Only a new mismatch should start the
// reveal timer. Restarting it on every click keeps the board locked.
export function shouldStartMismatchTimer(previous, next) {
  if (!next || next === previous) return false;
  return Boolean(next.disabled && next.flipped.length === 2);
}
