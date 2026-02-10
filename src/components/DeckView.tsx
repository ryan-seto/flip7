import { MODIFIERS, ACTION_NAMES } from "../constants/deck";

interface DeckViewProps {
  remainingNumbers: Record<number, number>;
  remainingMods: Record<string, number>;
  remainingActs: Record<string, number>;
}

function DeckChip({
  label,
  count,
  colorClass,
}: {
  label: string | number;
  count: number;
  colorClass: "red" | "blue" | "gold";
}) {
  const active = count > 0;
  const colorMap = {
    red: {
      bg: active ? "bg-flip-red/10" : "bg-flip-border",
      text: active ? "text-flip-red" : "text-flip-dark-border",
      border: active ? "border-flip-red/25" : "border-flip-border",
    },
    blue: {
      bg: active ? "bg-flip-blue/10" : "bg-flip-border",
      text: active ? "text-flip-blue" : "text-flip-dark-border",
      border: active ? "border-flip-blue/25" : "border-flip-border",
    },
    gold: {
      bg: active ? "bg-flip-gold/10" : "bg-flip-border",
      text: active ? "text-flip-gold" : "text-flip-dark-border",
      border: active ? "border-flip-gold/25" : "border-flip-border",
    },
  };
  const c = colorMap[colorClass];

  return (
    <div
      className={`px-2 py-1 rounded-md text-xs font-bold font-mono border ${c.bg} ${c.text} ${c.border}`}
    >
      {label}×{Math.max(0, count)}
    </div>
  );
}

export function DeckView({ remainingNumbers, remainingMods, remainingActs }: DeckViewProps) {
  return (
    <div className="bg-flip-card border border-flip-border rounded-xl p-4 mb-4">
      <div className="text-xs text-flip-subtle font-mono mb-2 tracking-wide">
        REMAINING IN DECK
      </div>
      <div className="flex flex-wrap gap-1">
        {[...Array(13).keys()].map((i) => (
          <DeckChip key={i} label={i} count={remainingNumbers[i]} colorClass="red" />
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {MODIFIERS.map((m) => (
          <DeckChip key={m} label={m} count={remainingMods[m] || 0} colorClass="blue" />
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {ACTION_NAMES.map((a) => (
          <DeckChip key={a} label={a} count={remainingActs[a] || 0} colorClass="gold" />
        ))}
      </div>
    </div>
  );
}
