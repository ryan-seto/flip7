export type CardType = "number" | "modifier" | "action";

export interface Card {
  type: CardType;
  value: number | string;
}

export interface CardOption extends Card {
  remaining: number;
}

export type PlayerStatus = "active" | "busted" | "frozen" | "stayed";

export type GameScreen = "setup" | "playing" | "roundEnd" | "gameOver";

export type DeckMode = "reset" | "persistent";

export interface RoundScore {
  round: number;
  scores: Record<string, number>;
}

export interface CardColors {
  bg: string;
  border: string;
  text: string;
}

export interface ActionMode {
  type: "freeze" | "flip3";
  sourcePlayer: string;
}

export interface Flip3State {
  sourcePlayer: string;
  targetPlayer: string;
  cardsDealt: number;
}

export interface UndoState {
  playerCards: Record<string, Card[]>;
  playerStatus: Record<string, PlayerStatus>;
  activePlayer: string | null;
  deckUsed: Card[];
  actionMode: ActionMode | null;
  flip3State: Flip3State | null;
}

export interface Flip7Game {
  // Screen
  screen: GameScreen;

  // Setup state
  players: string[];
  newPlayerName: string;
  targetScore: number;
  deckMode: DeckMode;
  setNewPlayerName: (name: string) => void;
  setTargetScore: (score: number) => void;
  setDeckMode: (mode: DeckMode) => void;
  addPlayer: () => void;
  removePlayer: (name: string) => void;
  startGame: () => void;

  // Game state
  totalScores: Record<string, number>;
  roundNumber: number;
  roundScoreHistory: RoundScore[];
  dealerIndex: number;

  // Round state
  playerCards: Record<string, Card[]>;
  playerStatus: Record<string, PlayerStatus>;
  activePlayer: string | null;
  showDeckView: boolean;
  setShowDeckView: (show: boolean) => void;
  setActivePlayer: (player: string) => void;

  // Action card state
  actionMode: ActionMode | null;
  flip3State: Flip3State | null;
  selectActionTarget: (targetPlayer: string) => void;
  cancelAction: () => void;

  // Derived values
  remainingNumbers: Record<number, number>;
  remainingMods: Record<string, number>;
  remainingActs: Record<string, number>;
  totalRemainingCards: number;
  allDone: boolean;
  anyFlip7: boolean;
  numberOptions: CardOption[];
  modOptions: CardOption[];
  actOptions: CardOption[];

  // Actions
  dealCard: (card: Card) => void;
  setStatusAndAdvance: (player: string, status: PlayerStatus) => void;
  advanceToNextPlayer: () => void;
  discardCard: (card: Card) => void;
  endRound: () => void;
  nextRound: () => void;
  resetGame: () => void;
  undo: () => void;
  canUndo: boolean;
}
