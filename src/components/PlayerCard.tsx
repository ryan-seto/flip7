import type { Card, PlayerStatus } from "../types/game";
import { CARD_COLORS } from "../constants/deck";

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
}

const STATUS_CONFIG: Record<PlayerStatus, { color: string; label: string }> = {
  active: { color: "#4ecca3", label: "ACTIVE" },
  busted: { color: "#e94560", label: "BUSTED" },
  frozen: { color: "#53d8fb", label: "FROZEN" },
  stayed: { color: "#7ec8e3", label: "STAYED" },
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
        background: isTargetable ? "#1a2e3e" : isActive ? "#16213e" : "#0f0f23",
        border: `2px solid ${
          isTargetable
            ? "#f5a623"
            : isActive
              ? "#4ecca3"
              : isBusted
                ? "#e9456040"
                : "#1a1a3e"
        }`,
        cursor: clickable ? "pointer" : "default",
        boxShadow: isTargetable
          ? "0 0 20px #f5a62330"
          : isActive
            ? "0 0 20px #4ecca320"
            : "none",
      }}
    >
      {/* Targeting overlay indicator */}
      {isTargetable && (
        <div className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded font-mono tracking-wide bg-flip-gold/20 text-flip-gold animate-pulse">
          TAP TO SELECT
        </div>
      )}

      {/* Header row */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {isDealer && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono tracking-wide"
              style={{ background: "#f5a62320", color: "#f5a623" }}
            >
              DEALER
            </span>
          )}
          <span className="font-bold text-base text-flip-text font-display">{player}</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono tracking-widest"
            style={{ background: statusColor + "20", color: statusColor }}
          >
            {statusText}
          </span>
        </div>
        <span
          className="text-[22px] font-extrabold font-mono"
          style={{ color: isBusted ? "#e9456060" : "#4ecca3" }}
        >
          {isBusted ? 0 : score}
        </span>
      </div>

      {/* Cards row */}
      <div className="flex gap-1 flex-wrap mb-2 min-h-[36px]">
        {cards.map((c, i) => (
          <span
            key={i}
            className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold font-mono"
            style={{
              background: CARD_COLORS[c.type].border + "20",
              color: CARD_COLORS[c.type].text,
              border: `1px solid ${CARD_COLORS[c.type].border}40`,
              textDecoration: isBusted ? "line-through" : "none",
              opacity: isBusted ? 0.5 : 1,
            }}
          >
            {c.value}
          </span>
        ))}
        {cards.length === 0 && (
          <span className="text-flip-dim text-xs italic">No cards yet</span>
        )}
      </div>

      {/* Bust probability */}
      {!isOut && cards.some((c) => c.type === "number") && (
        <div className="mt-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-flip-subtle font-mono tracking-wide">BUST RISK</span>
            <span
              className="text-[13px] font-bold font-mono"
              style={{
                color: bustProb > 0.5 ? "#e94560" : bustProb > 0.25 ? "#f5a623" : "#4ecca3",
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
                    ? "linear-gradient(90deg, #e94560, #ff6b6b)"
                    : bustProb > 0.25
                      ? "linear-gradient(90deg, #f5a623, #ffd93d)"
                      : "linear-gradient(90deg, #4ecca3, #6bffcc)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-flip-muted font-mono">
              {uniqueNumberCount}/7 unique numbers
            </span>
            {flip7 && (
              <span className="text-[9px] text-flip-gold font-bold font-mono">
                ★ FLIP 7 BONUS! +15
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
