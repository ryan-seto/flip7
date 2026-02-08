import type { Card } from "../types/game";
import { NUMBER_CARDS, MODIFIERS } from "../constants/deck";

export function getRemainingNumberCounts(
  allPlayersCards: Record<string, Card[]>,
  deckUsed: Card[]
): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let i = 0; i <= 12; i++) counts[i] = NUMBER_CARDS[i];

  for (const cards of Object.values(allPlayersCards)) {
    for (const c of cards) {
      if (c.type === "number" && typeof c.value === "number" && counts[c.value] !== undefined) {
        counts[c.value]--;
      }
    }
  }
  for (const c of deckUsed) {
    if (c.type === "number" && typeof c.value === "number" && counts[c.value] !== undefined) {
      counts[c.value]--;
    }
  }
  return counts;
}

export function getRemainingSpecialCounts(
  allPlayersCards: Record<string, Card[]>,
  deckUsed: Card[]
): { modCounts: Record<string, number>; actCounts: Record<string, number> } {
  const modCounts: Record<string, number> = {};
  MODIFIERS.forEach((m) => (modCounts[m] = 1));
  const actCounts: Record<string, number> = { Freeze: 3, Flip3: 3, "2ndChance": 3 };

  for (const cards of Object.values(allPlayersCards)) {
    for (const c of cards) {
      if (c.type === "modifier" && typeof c.value === "string" && modCounts[c.value] !== undefined) {
        modCounts[c.value]--;
      }
      if (c.type === "action" && typeof c.value === "string" && actCounts[c.value] !== undefined) {
        actCounts[c.value]--;
      }
    }
  }
  for (const c of deckUsed) {
    if (c.type === "modifier" && typeof c.value === "string" && modCounts[c.value] !== undefined) {
      modCounts[c.value]--;
    }
    if (c.type === "action" && typeof c.value === "string" && actCounts[c.value] !== undefined) {
      actCounts[c.value]--;
    }
  }
  return { modCounts, actCounts };
}
