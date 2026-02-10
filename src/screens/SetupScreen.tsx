import { useState, useRef, useEffect } from "react";
import type { Flip7Game, DeckMode } from "../types/game";
import { MAX_PLAYERS } from "../constants/deck";

type SetupProps = Pick<
  Flip7Game,
  "players" | "newPlayerName" | "targetScore" | "deckMode" | "setNewPlayerName" | "setTargetScore" | "setDeckMode" | "addPlayer" | "removePlayer" | "startGame"
>;

const ORDINALS = [
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th",
  "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th",
];

export function SetupScreen({
  players,
  newPlayerName,
  targetScore,
  deckMode,
  setNewPlayerName,
  setTargetScore,
  setDeckMode,
  addPlayer,
  removePlayer,
  startGame,
}: SetupProps) {
  const [editingScore, setEditingScore] = useState(false);
  const [scoreInput, setScoreInput] = useState(String(targetScore));
  const scoreInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingScore) scoreInputRef.current?.select();
  }, [editingScore]);

  const commitScore = () => {
    const parsed = parseInt(scoreInput, 10);
    if (parsed > 0) setTargetScore(parsed);
    else setScoreInput(String(targetScore));
    setEditingScore(false);
  };

  return (
    <div className="min-h-screen bg-flip-bg text-flip-text font-display flex justify-center p-4">
      <div className="w-full max-w-[480px] pt-6 pb-20">
        {/* Banner */}
        <div className="text-center mb-8">
          <img
            src={`${import.meta.env.BASE_URL}banner.png`}
            alt="Flip 7"
            className="w-full mx-auto rounded-xl"
          />
          <p className="text-sm text-flip-muted tracking-[3px] font-mono font-semibold mt-2">
            SCORE TRACKER & ODDS CALCULATOR
          </p>
        </div>

        {/* Target score */}
        <div className="mb-6 bg-flip-card border border-flip-border rounded-xl px-4 py-3 flex items-center justify-between">
          <label className="text-sm text-flip-subtle tracking-[2px] font-mono font-bold">
            TARGET SCORE
          </label>
          <div className="flex items-center gap-2">
            {editingScore ? (
              <input
                ref={scoreInputRef}
                type="number"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                onBlur={commitScore}
                onKeyDown={(e) => e.key === "Enter" && commitScore()}
                className="w-24 bg-flip-panel border border-flip-accent rounded-lg px-3 py-1.5 text-xl font-extrabold font-mono text-flip-text outline-none text-center"
              />
            ) : (
              <>
                <span className="text-xl font-extrabold font-mono text-flip-accent">
                  {targetScore}
                </span>
                <button
                  onClick={() => { setScoreInput(String(targetScore)); setEditingScore(true); }}
                  className="bg-transparent border-none text-flip-subtle cursor-pointer p-1 hover:text-flip-accent transition-colors"
                  aria-label="Edit target score"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Deck mode */}
        <div className="mb-6 bg-flip-card border border-flip-border rounded-xl px-4 py-3">
          <label className="text-sm text-flip-subtle tracking-[2px] font-mono font-bold block mb-2">
            DECK MODE
          </label>
          <div className="flex gap-2">
            {([
              { value: "reset" as DeckMode, label: "Reset each round" },
              { value: "persistent" as DeckMode, label: "Persistent (official)" },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDeckMode(opt.value)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all border ${
                  deckMode === opt.value
                    ? "bg-flip-accent/10 border-flip-accent text-flip-accent"
                    : "bg-transparent border-flip-border text-flip-muted cursor-pointer hover:border-flip-dark-border"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Players */}
        <div className="mb-6">
          <label className="text-sm text-flip-subtle tracking-[2px] font-mono font-bold">
            PLAYERS{" "}
            <span className="text-xs text-flip-muted font-normal tracking-normal">(first listed = round 1 dealer)</span>
          </label>
          {players.length < MAX_PLAYERS ? (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                placeholder="Player name..."
                maxLength={16}
                className="flex-1 bg-flip-card border border-flip-border rounded-lg px-3.5 py-3 text-flip-text text-base font-mono outline-none focus:border-flip-accent transition-colors"
              />
              <button
                onClick={addPlayer}
                className="w-[46px] h-[46px] rounded-lg border border-flip-accent bg-flip-accent/10 text-flip-accent text-xl font-bold cursor-pointer hover:bg-flip-accent/20 transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <p className="text-flip-muted text-xs text-center mt-2 font-mono">
              Maximum {MAX_PLAYERS} players
            </p>
          )}
          <div className="mt-3 flex flex-col gap-1.5">
            {players.map((p, i) => (
              <div
                key={p}
                className="flex justify-between items-center px-3.5 py-3 bg-flip-card rounded-lg border border-flip-border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-flip-text text-base font-semibold font-mono">
                    {ORDINALS[i]} {p}
                  </span>
                  {i === 0 && (
                    <span className="text-[11px] text-flip-gold font-bold font-mono">DEALER</span>
                  )}
                </div>
                <button
                  onClick={() => removePlayer(p)}
                  className="bg-transparent border-none text-flip-red cursor-pointer text-lg font-bold"
                >
                  ×
                </button>
              </div>
            ))}
            {players.length === 0 && (
              <p className="text-flip-dim text-sm text-center p-4 italic">
                Add at least 2 players to start
              </p>
            )}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={startGame}
          disabled={players.length < 2}
          className={`w-full py-4 rounded-[10px] border-none bg-flip-red text-flip-card text-base font-extrabold tracking-[2px] font-mono transition-all ${
            players.length < 2 ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:brightness-110"
          }`}
        >
          START GAME
        </button>
      </div>
    </div>
  );
}
