import type { CardColors } from "../types/game";

export const NUMBER_CARDS: Record<number, number> = {};
for (let i = 0; i <= 12; i++) NUMBER_CARDS[i] = i === 0 ? 1 : i;

export const MODIFIERS = ["+2", "+4", "+6", "+8", "+10", "X2"] as const;

export const ACTION_NAMES = ["Freeze", "Flip3", "2ndChance"] as const;

export const CARD_COLORS: Record<string, CardColors> = {
  number: { bg: "#1a1a2e", border: "#e94560", text: "#e94560" },
  modifier: { bg: "#1a1a2e", border: "#0f3460", text: "#53d8fb" },
  action: { bg: "#1a1a2e", border: "#f5a623", text: "#f5a623" },
};
