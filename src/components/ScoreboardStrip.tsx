interface ScoreboardStripProps {
  players: string[];
  totalScores: Record<string, number>;
}

const ORDINAL_SUFFIX = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export function ScoreboardStrip({ players, totalScores }: ScoreboardStripProps) {
  // Sort by score descending, assign ranks (ties get same rank)
  const sorted = [...players].sort((a, b) => (totalScores[b] || 0) - (totalScores[a] || 0));
  const rankMap: Record<string, number> = {};
  sorted.forEach((p, i) => {
    if (i === 0 || (totalScores[p] || 0) < (totalScores[sorted[i - 1]] || 0)) {
      rankMap[p] = i + 1;
    } else {
      rankMap[p] = rankMap[sorted[i - 1]];
    }
  });

  return (
    <div className="flex gap-1.5 mb-4 overflow-x-auto py-1">
      {sorted.map((p) => (
        <div
          key={p}
          className="flex-none px-3 py-1.5 rounded-lg bg-flip-panel border border-flip-border text-center min-w-[60px]"
        >
          <div className="text-[10px] text-flip-muted font-mono">{ORDINAL_SUFFIX(rankMap[p])}</div>
          <div className="text-xs text-flip-subtle font-mono mb-0.5">{p}</div>
          <div className="text-base font-extrabold text-flip-accent font-mono">
            {totalScores[p] || 0}
          </div>
        </div>
      ))}
    </div>
  );
}
