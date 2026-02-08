import type { Flip7Game } from "../types/game";

type RoundEndProps = Pick<
  Flip7Game,
  "players" | "totalScores" | "roundNumber" | "targetScore" | "dealerIndex" | "roundScoreHistory" | "nextRound"
>;

export function RoundEndScreen({
  players,
  totalScores,
  roundNumber,
  targetScore,
  dealerIndex,
  roundScoreHistory,
  nextRound,
}: RoundEndProps) {
  const lastRound = roundScoreHistory[roundScoreHistory.length - 1];
  const nextDealerName = players[(dealerIndex + 1) % players.length];
  const nextStarterName = players[(dealerIndex + 2) % players.length];

  return (
    <div className="min-h-screen bg-flip-bg text-flip-text font-display flex justify-center p-4">
      <div className="w-full max-w-[480px] pt-6 pb-20">
        <h2 className="text-[22px] font-black text-white font-mono tracking-[4px] text-center mb-1 [text-shadow:0_0_30px_#e9456040]">
          ROUND {roundNumber} COMPLETE
        </h2>
        <p className="text-flip-muted text-xs text-center mb-2 font-mono">
          Target: {targetScore} points
        </p>
        <p className="text-flip-gold text-[11px] text-center mb-6 font-mono">
          Next round: {nextDealerName} deals · {nextStarterName} starts
        </p>

        {/* Standings */}
        <div className="flex flex-col gap-2 mb-6">
          {players
            .slice()
            .sort((a, b) => (totalScores[b] || 0) - (totalScores[a] || 0))
            .map((p, i) => (
              <div
                key={p}
                className={`flex justify-between items-center px-4 py-3 bg-flip-panel rounded-[10px] border ${
                  i === 0 ? "border-flip-accent/25" : "border-flip-border"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-sm font-extrabold font-mono w-5"
                    style={{ color: i === 0 ? "#4ecca3" : "#555" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-flip-text font-semibold font-display">{p}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-flip-accent font-mono">
                    {totalScores[p] || 0}
                  </div>
                  <div
                    className="text-[11px] font-mono"
                    style={{
                      color: (lastRound?.scores[p] ?? 0) > 0 ? "#4ecca380" : "#e9456080",
                    }}
                  >
                    {(lastRound?.scores[p] ?? 0) > 0 ? "+" : ""}
                    {lastRound?.scores[p] ?? 0}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <button
          onClick={nextRound}
          className="w-full py-3.5 rounded-[10px] border-none bg-flip-red text-white text-sm font-extrabold tracking-[2px] font-mono cursor-pointer transition-all hover:brightness-110"
        >
          NEXT ROUND →
        </button>
      </div>
    </div>
  );
}
