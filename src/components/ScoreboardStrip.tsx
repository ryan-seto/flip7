interface ScoreboardStripProps {
  players: string[];
  totalScores: Record<string, number>;
}

export function ScoreboardStrip({ players, totalScores }: ScoreboardStripProps) {
  return (
    <div className="flex gap-1.5 mb-4 overflow-x-auto py-1">
      {players.map((p) => (
        <div
          key={p}
          className="flex-none px-3 py-1.5 rounded-lg bg-flip-panel border border-flip-border text-center min-w-[60px]"
        >
          <div className="text-[10px] text-flip-subtle font-mono mb-0.5">{p}</div>
          <div className="text-base font-extrabold text-flip-accent font-mono">
            {totalScores[p] || 0}
          </div>
        </div>
      ))}
    </div>
  );
}
