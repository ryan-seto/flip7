import type { Flip7Game } from "../types/game";

type SetupProps = Pick<
  Flip7Game,
  "players" | "newPlayerName" | "targetScore" | "setNewPlayerName" | "setTargetScore" | "addPlayer" | "removePlayer" | "startGame"
>;

export function SetupScreen({
  players,
  newPlayerName,
  targetScore,
  setNewPlayerName,
  setTargetScore,
  addPlayer,
  removePlayer,
  startGame,
}: SetupProps) {
  return (
    <div className="min-h-screen bg-flip-bg text-flip-text font-display flex justify-center p-4">
      <div className="w-full max-w-[480px] pt-6 pb-20">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white font-mono tracking-[4px] m-0 mb-1 [text-shadow:0_0_30px_#e9456040]">
            FLIP<span className="text-flip-red">7</span>
          </h1>
          <p className="text-[11px] text-flip-muted tracking-[3px] font-mono">
            SCORE TRACKER & ODDS CALCULATOR
          </p>
        </div>

        {/* Target score */}
        <div className="mb-6">
          <label className="text-[10px] text-flip-subtle tracking-[2px] font-mono font-bold">
            TARGET SCORE
          </label>
          <div className="flex gap-2 mt-1">
            {[100, 200, 300].map((v) => (
              <button
                key={v}
                onClick={() => setTargetScore(v)}
                className={`px-5 py-2 rounded-lg text-sm font-bold font-mono cursor-pointer border transition-colors ${
                  targetScore === v
                    ? "bg-flip-red text-white border-flip-red"
                    : "bg-flip-border text-flip-subtle border-flip-dark-border"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Players */}
        <div className="mb-6">
          <label className="text-[10px] text-flip-subtle tracking-[2px] font-mono font-bold">
            PLAYERS{" "}
            <span className="text-flip-muted font-normal">(first player listed will be round 1 dealer)</span>
          </label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              placeholder="Player name..."
              maxLength={16}
              className="flex-1 bg-flip-border border border-flip-dark-border rounded-lg px-3.5 py-2.5 text-flip-text text-sm font-display outline-none focus:border-flip-accent transition-colors"
            />
            <button
              onClick={addPlayer}
              className="w-[42px] h-[42px] rounded-lg border border-flip-accent bg-flip-accent/10 text-flip-accent text-xl font-bold cursor-pointer hover:bg-flip-accent/20 transition-colors"
            >
              +
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            {players.map((p, i) => (
              <div
                key={p}
                className="flex justify-between items-center px-3.5 py-2.5 bg-flip-panel rounded-lg border border-flip-border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-flip-text font-semibold font-display">
                    {i + 1}. {p}
                  </span>
                  {i === 0 && (
                    <span className="text-[9px] text-flip-gold font-mono">DEALER</span>
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
              <p className="text-flip-dim text-[13px] text-center p-4 italic">
                Add at least 2 players to start
              </p>
            )}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={startGame}
          disabled={players.length < 2}
          className={`w-full py-3.5 rounded-[10px] border-none bg-flip-red text-white text-sm font-extrabold tracking-[2px] font-mono transition-all ${
            players.length < 2 ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:brightness-110"
          }`}
        >
          START GAME
        </button>
      </div>
    </div>
  );
}
