import type { Card } from "../types/game";
import { CARD_COLORS } from "../constants/deck";

interface CardButtonProps {
  card: Card;
  onClick: (card: Card) => void;
  small?: boolean;
  disabled?: boolean;
}

export function CardButton({ card, onClick, small, disabled }: CardButtonProps) {
  const colors = CARD_COLORS[card.type];
  const isAction = card.type === "action";

  return (
    <button
      onClick={() => !disabled && onClick(card)}
      disabled={disabled}
      className="flex items-center justify-center rounded-lg font-mono font-bold text-center transition-all duration-150"
      style={{
        width: isAction ? (small ? 80 : 90) : small ? 48 : 56,
        height: small ? 64 : 74,
        border: `2px solid ${colors.border}`,
        background: disabled ? "#2a2a3a" : colors.bg,
        color: disabled ? "#555" : colors.text,
        fontSize: isAction ? (small ? 11 : 13) : small ? 13 : 16,
        lineHeight: 1.1,
        padding: 2,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {card.value}
    </button>
  );
}
