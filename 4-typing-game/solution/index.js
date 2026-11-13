// Typing Game - Modern ES6+ Version

// Quotes pool
const quotes = [
  "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
  "There is nothing more deceptive than an obvious fact.",
  "I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.",
  "I never make exceptions. An exception disproves the rule.",
  "What one man can invent another can discover.",
  "Nothing clears up a case so much as stating it to another person.",
  "Education never ends, Watson. It is a series of lessons, with the greatest for the last."
];

// State
let words = [];
let wordIndex = 0;
let startTime = 0;

// UI Elements
const quoteElement = document.querySelector("#quote");
const messageElement = document.querySelector("#message");
const typedValueElement = document.querySelector("#typed-value");
const startButton = document.querySelector("#start");

// Messages system
const messages = {
  success: (seconds) => `🎉 Congratulations! You finished in ${seconds.toFixed(2)} seconds.`,
  error: "⚠️ Oops! There's a mistake.",
  start: "⌨️ Start typing to begin the game."
};

// Utility: pick random quote
const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

// Utility: render quote as spans
const renderQuote = (quote) => {
  quoteElement.innerHTML = quote
    .split(" ")
    .map((word, i) => `<span ${i === 0 ? 'class="highlight"' : ""}>${word}</span>`)
    .join(" ");
};

// Utility: highlight current word
const highlightWord = (index) => {
  [...quoteElement.children].forEach((el, i) => {
    el.classList.toggle("highlight", i === index);
  });
};

// Game start
const startGame = () => {
  const quote = getRandomQuote();
  const fresh = TypingLogic.createTypingState(quote);
  words = fresh.words;
  wordIndex = fresh.wordIndex;
  renderQuote(quote);

  messageElement.textContent = messages.start;
  typedValueElement.value = fresh.input;
  typedValueElement.disabled = fresh.disabled;
  typedValueElement.classList.remove("error");
  typedValueElement.focus();

  startTime = Date.now();
};

// Typing logic
const handleTyping = () => {
  if (!words.length || typedValueElement.disabled) return;

  const next = TypingLogic.reduceTyping(
    { words, wordIndex, finished: false },
    typedValueElement.value
  );
  wordIndex = next.wordIndex;
  typedValueElement.value = next.input;
  typedValueElement.disabled = next.disabled;
  typedValueElement.classList.toggle("error", next.error);
  highlightWord(wordIndex);

  if (next.finished) {
    const elapsedTime = (Date.now() - startTime) / 1000;
    messageElement.textContent = messages.success(elapsedTime);
  } else if (next.error) {
    messageElement.textContent = messages.error;
  } else {
    messageElement.textContent = messages.start;
  }
};

// Event Listeners
startButton.addEventListener("click", startGame);
typedValueElement.addEventListener("input", handleTyping);

// Default state
messageElement.textContent = "👉 Click Start to begin!";
