import type { Flip7Game } from "../types/game";

type GameOverProps = Pick<
  Flip7Game,
  "players" | "totalScores" | "roundScoreHistory" | "resetGame"
>;

export function GameOverScreen({
  players,
  totalScores,
  roundScoreHistory,
  resetGame,
}: GameOverProps) {
  const winner = players.reduce((best, p) =>
    (totalScores[p] || 0) > (totalScores[best] || 0) ? p : best
  );

  return (
    <div className="min-h-screen bg-flip-bg text-flip-text font-display flex justify-center p-4">
      <div className="w-full max-w-[480px] pt-6 pb-20">
        {/* Winner announcement */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🏆</div>
          <h2 className="text-[28px] font-black text-flip-text font-display tracking-[4px] mb-1">
            {winner} WINS!
          </h2>
          <p className="text-flip-accent text-xl font-extrabold font-mono">
            {totalScores[winner]} points
          </p>
        </div>

        {/* Score history table */}
        <div className="mb-6">
          <div className="text-[11px] text-flip-subtle font-mono mb-2 tracking-widest">
            SCORE HISTORY
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-[11px] font-bold text-flip-subtle text-center font-mono border-b border-flip-border">
                    Rd
                  </th>
                  {players.map((p) => (
                    <th
                      key={p}
                      className="px-2 py-1.5 text-[11px] font-bold text-flip-subtle text-center font-mono border-b border-flip-border"
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roundScoreHistory.map((r, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1.5 text-[13px] text-center font-mono text-gray-400">
                      {r.round}
                    </td>
                    {players.map((p) => (
                      <td
                        key={p}
                        className="px-2 py-1.5 text-[13px] text-center font-mono"
                        style={{ color: r.scores[p] > 0 ? "#1A7A6D" : "#C94040" }}
                      >
                        {r.scores[p] > 0 ? "+" : ""}
                        {r.scores[p]}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="px-2 py-1.5 text-[13px] text-center font-mono text-gray-400 border-t border-flip-dark-border font-extrabold">
                    Tot
                  </td>
                  {players.map((p) => (
                    <td
                      key={p}
                      className="px-2 py-1.5 text-[13px] text-center font-mono text-flip-accent border-t border-flip-dark-border font-extrabold"
                    >
                      {totalScores[p]}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full py-3.5 rounded-[10px] border-none bg-flip-red text-flip-card text-sm font-extrabold tracking-[2px] font-mono cursor-pointer transition-all hover:brightness-110"
        >
          NEW GAME
        </button>
      </div>
    </div>
  );
}
