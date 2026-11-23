"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { clickCard, clearMismatch, isValidGridSize, shouldStartMismatchTimer } from "../lib/memory-rules.mjs";

// Fisher-Yates shuffle for unbiased randomization
function fisherYatesShuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(2);

  const [array, setArray] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  const [won, setWon] = useState(false);
  const mismatchTimer = useRef(null);

  const handleGridSize = (e) => {
    const size = parseInt(e.target.value, 10);
    if (isValidGridSize(size)) {
      setGridSize(size);
      setError("");
    } else {
      setError("Please enter a grid size where size is even (e.g., 2, 4, 6, 8, 10)");
    }
  };

  const initializeGame = useCallback(() => {
    clearTimeout(mismatchTimer.current);
    const totalCards = gridSize * gridSize;
    const pairCount = totalCards / 2;

    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const cardNumbers = [...numbers, ...numbers];
    const shuffledCardNumbers = fisherYatesShuffle(cardNumbers);
    const shuffledCards = shuffledCardNumbers.map((number, index) => ({
      id: index,
      number,
    }));

    setArray(shuffledCards);
    setFlipped([]);
    setSelectedPairs([]);
    setDisabled(false);
    setWon(false);
  }, [gridSize]);

  useEffect(() => {
    initializeGame();
    return () => clearTimeout(mismatchTimer.current);
  }, [initializeGame]);

  const handleClick = (id) => {
    const current = { cards: array, flipped, selectedPairs, disabled, won };
    const next = clickCard(current, id);
    // Ignored clicks return the same object. Restarting the timer from those
    // clicks would keep a mismatch locked for as long as the player clicks.
    if (!next || next === current) return;

    setFlipped(next.flipped);
    setSelectedPairs(next.selectedPairs);
    setDisabled(next.disabled);
    setWon(next.won);

    if (shouldStartMismatchTimer(current, next)) {
      clearTimeout(mismatchTimer.current);
      mismatchTimer.current = setTimeout(() => {
        const cleared = clearMismatch(next);
        setFlipped(cleared.flipped);
        setDisabled(cleared.disabled);
      }, 1000);
    }
  };

  const isFlipped = (id) => flipped.includes(id) || selectedPairs.includes(id);
  const isSelectedPairs = (id) => selectedPairs.includes(id);

  useEffect(() => {
    if (selectedPairs.length === array.length && array.length > 0) {
      setWon(true);
    }
  }, [selectedPairs, array]);

  return (
    <div className="h-screen flex flex-col justify-center items-center p-4 bg-gray-100 ">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      {/* Grid Size */}
      <div className="mb-4">
        <label htmlFor="gridSize">Grid Size: (max 10)</label>
        <input
          id="gridSize"
          type="number"
          className="w-[50px] ml-3 rounded border-2 px-1.5 py-1"
          min="2"
          max="10"
          step="2"
          value={gridSize}
          onChange={handleGridSize}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "gridSizeError" : undefined}
        />
        {error && (
          <div id="gridSizeError" className="text-sm text-red-500 mt-2" role="alert">
            {error}
          </div>
        )}
      </div>
      {/* Cards */}
      <div
        className="grid gap-2 mb-4"
        role="group"
        aria-label="Memory cards"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%,${gridSize * 5.5}rem)`,
        }}
      >
        {array.map((card) => {
          const flippedCard = isFlipped(card.id);
          const matchedCard = isSelectedPairs(card.id);
          const label = matchedCard
            ? `Card ${card.id + 1}, matched ${card.number}`
            : flippedCard
              ? `Card ${card.id + 1}, ${card.number}`
              : `Card ${card.id + 1}, hidden`;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleClick(card.id)}
              disabled={disabled || matchedCard}
              aria-label={label}
              aria-pressed={flippedCard}
              className={`aspect-square flex items-center justify-center text-xl transition-all duration-300 font-bold rounded-lg border-0 p-0 cursor-pointer disabled:cursor-not-allowed ${
                flippedCard
                  ? matchedCard
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              }`}
            >
              {flippedCard ? card.number : "?"}
            </button>
          );
        })}
      </div>
      {/* Result */}
      <div className="text-2xl text-green-500 font-bold" role="status" aria-live="polite">
        {won ? "You Won!" : ""}
      </div>

      {/* Reset Button */}
      <button
        className="px-5 py-2 bg-green-500 rounded text-white mt-5"
        onClick={initializeGame}
      >
        Reset
      </button>
    </div>
  );
};

export default MemoryGame;