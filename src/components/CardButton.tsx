import type { Card } from "../types/game";
import { getCardColors, CARD_DISPLAY_NAMES } from "../constants/deck";

interface CardButtonProps {
  card: Card;
  onClick: (card: Card) => void;
  small?: boolean;
  disabled?: boolean;
}

export function CardButton({ card, onClick, small, disabled }: CardButtonProps) {
  const colors = getCardColors(card.type, card.value);
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
        background: disabled ? "#E8DDCC" : colors.bg,
        color: disabled ? "#B5A898" : colors.text,
        fontSize: isAction ? (small ? 11 : 13) : small ? 13 : 16,
        lineHeight: 1.1,
        padding: 2,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {typeof card.value === "string" ? (CARD_DISPLAY_NAMES[card.value] ?? card.value) : card.value}
    </button>
  );
}
