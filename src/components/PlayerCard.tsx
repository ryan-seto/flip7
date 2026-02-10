import type { Card, PlayerStatus } from "../types/game";
import { getCardColors, CARD_DISPLAY_NAMES } from "../constants/deck";

interface PlayerCardProps {
  player: string;
  isActive: boolean;
  isDealer: boolean;
  isTargetable?: boolean;
  onClick: () => void;
  bustProb: number;
  score: number;
  cards: Card[];
  status: PlayerStatus;
  uniqueNumberCount: number;
  showOdds?: boolean;
}

const STATUS_CONFIG: Record<PlayerStatus, { color: string; label: string }> = {
  active: { color: "#1A7A6D", label: "ACTIVE" },
  busted: { color: "#C94040", label: "BUSTED" },
  frozen: { color: "#3B5DAA", label: "FROZEN" },
  stayed: { color: "#5A9EC4", label: "STAYED" },
};

export function PlayerCard({
  player,
  isActive,
  isDealer,
  isTargetable,
  onClick,
  bustProb,
  score,
  cards,
  status,
  uniqueNumberCount,
  showOdds = true,
}: PlayerCardProps) {
  const isBusted = status === "busted";
  const isOut = status !== "active";
  const { color: statusColor, label: statusText } = STATUS_CONFIG[status];
  const flip7 = uniqueNumberCount >= 7;
  const clickable = isTargetable || !isOut;

  return (
    <div
      onClick={clickable ? onClick : undefined}
      className="rounded-xl px-4 py-3.5 relative overflow-hidden transition-all duration-200"
      style={{
        background: isTargetable ? "#FDF3E0" : isActive ? "#FFFDF5" : "#FFFDF5",
        border: `2px solid ${
          isTargetable
            ? "#D4943A"
            : isActive
              ? "#1A7A6D"
              : isBusted
                ? "#C9404040"
                : "#C9B99A"
        }`,
        cursor: clickable ? "pointer" : "default",
        boxShadow: isTargetable
          ? "0 0 12px #D4943A30"
          : isActive
            ? "0 0 12px #1A7A6D20"
            : "none",
      }}
    >
      {/* Targeting overlay indicator */}
      {isTargetable && (
        <div className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded font-mono tracking-wide bg-flip-gold/20 text-flip-gold animate-pulse">
          TAP TO SELECT
        </div>
      )}

      {/* Header row */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {isDealer && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded font-mono tracking-wide"
              style={{ background: "#D4943A20", color: "#D4943A" }}
            >
              DEALER
            </span>
          )}
          <span className="font-bold text-base text-flip-text font-mono">{player}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full font-mono tracking-widest"
            style={{ background: statusColor + "20", color: statusColor }}
          >
            {statusText}
          </span>
        </div>
        <span
          className="text-[22px] font-extrabold font-mono"
          style={{ color: isBusted ? "#C9404060" : "#1A7A6D" }}
        >
          {isBusted ? 0 : score}
        </span>
      </div>

      {/* Cards row */}
      <div className="flex gap-1 flex-wrap mb-2 min-h-[36px]">
        {cards.map((c, i) => {
          const cc = getCardColors(c.type, c.value);
          return (
          <span
            key={i}
            className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-sm font-bold font-mono"
            style={{
              background: cc.border + "20",
              color: cc.text,
              border: `1px solid ${cc.border}40`,
              textDecoration: isBusted ? "line-through" : "none",
              opacity: isBusted ? 0.5 : 1,
            }}
          >
            {typeof c.value === "string" ? (CARD_DISPLAY_NAMES[c.value] ?? c.value) : c.value}
          </span>
          );
        })}
        {cards.length === 0 && (
          <span className="text-flip-dim text-sm italic">No cards yet</span>
        )}
      </div>

      {/* Bust probability */}
      {showOdds && !isOut && cards.some((c) => c.type === "number") && (
        <div className="mt-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-flip-subtle font-mono tracking-wide">BUST RISK</span>
            <span
              className="text-sm font-bold font-mono"
              style={{
                color: bustProb > 0.5 ? "#C94040" : bustProb > 0.25 ? "#D4943A" : "#1A7A6D",
              }}
            >
              {(bustProb * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-1 bg-flip-border rounded overflow-hidden">
            <div
              className="h-full rounded transition-[width] duration-300 ease-out"
              style={{
                width: `${Math.min(bustProb * 100, 100)}%`,
                background:
                  bustProb > 0.5
                    ? "linear-gradient(90deg, #C94040, #E06050)"
                    : bustProb > 0.25
                      ? "linear-gradient(90deg, #D4943A, #E8B060)"
                      : "linear-gradient(90deg, #1A7A6D, #2AA090)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-flip-muted font-mono">
              {uniqueNumberCount}/7 unique numbers
            </span>
            {flip7 && (
              <span className="text-xs text-flip-gold font-bold font-mono">
                ★ FLIP 7 BONUS! +15
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
