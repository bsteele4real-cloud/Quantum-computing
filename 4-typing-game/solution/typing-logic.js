// Pure rules for the typing game so the word-by-word checks can be tested
// without a browser. index.js applies the result to the page.

function createTypingState(quote) {
  return {
    words: String(quote || '').split(' '),
    wordIndex: 0,
    finished: false,
    disabled: false,
    error: false,
    input: '',
    message: 'start',
  };
}

function reduceTyping(state, typedValue) {
  if (!state || state.finished || !state.words || state.words.length === 0) {
    return state;
  }

  const currentWord = state.words[state.wordIndex];
  if (currentWord === undefined) {
    return { ...state, finished: true, disabled: true, error: false, message: 'success', input: typedValue };
  }

  const isLast = state.wordIndex === state.words.length - 1;
  const trimmed = typedValue.trim();
  const completedLastWord = isLast && typedValue.endsWith(' ') && trimmed === currentWord && trimmed.length > 0;

  // The last word finishes on an exact match, or if the learner hits space after it.
  // Advancing past the last word used to throw when the next word was missing.
  if (typedValue === currentWord || completedLastWord) {
    if (isLast) {
      return {
        ...state,
        finished: true,
        disabled: true,
        error: false,
        message: 'success',
        input: typedValue,
      };
    }
  }

  if (typedValue.endsWith(' ') && trimmed === currentWord && trimmed.length > 0) {
    return {
      ...state,
      wordIndex: state.wordIndex + 1,
      finished: false,
      disabled: false,
      error: false,
      message: 'progress',
      input: '',
    };
  }

  if (currentWord.startsWith(typedValue)) {
    return {
      ...state,
      finished: false,
      disabled: false,
      error: false,
      message: 'progress',
      input: typedValue,
    };
  }

  return {
    ...state,
    finished: false,
    disabled: false,
    error: true,
    message: 'error',
    input: typedValue,
  };
}

const TypingLogic = { createTypingState, reduceTyping };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TypingLogic;
}
if (typeof window !== 'undefined') {
  window.TypingLogic = TypingLogic;
}
