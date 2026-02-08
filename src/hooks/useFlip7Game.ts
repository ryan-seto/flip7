import { useState, useCallback, useMemo } from "react";
import type {
  Card,
  CardOption,
  PlayerStatus,
  GameScreen,
  RoundScore,
  UndoState,
  ActionMode,
  Flip3State,
  Flip7Game,
} from "../types/game";
import { MODIFIERS } from "../constants/deck";
import { getRemainingNumberCounts, getRemainingSpecialCounts } from "../utils/deck";
import { calcScore } from "../utils/scoring";

export function useFlip7Game(): Flip7Game {
  const [screen, setScreen] = useState<GameScreen>("setup");
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [targetScore, setTargetScore] = useState(200);

  // Game state
  const [totalScores, setTotalScores] = useState<Record<string, number>>({});
  const [roundNumber, setRoundNumber] = useState(0);
  const [roundScoreHistory, setRoundScoreHistory] = useState<RoundScore[]>([]);
  const [dealerIndex, setDealerIndex] = useState(0);

  // Round state
  const [playerCards, setPlayerCards] = useState<Record<string, Card[]>>({});
  const [playerStatus, setPlayerStatus] = useState<Record<string, PlayerStatus>>({});
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [deckUsed, setDeckUsed] = useState<Card[]>([]);
  const [undoStack, setUndoStack] = useState<UndoState[]>([]);
  const [showDeckView, setShowDeckView] = useState(false);

  // Action card state
  const [actionMode, setActionMode] = useState<ActionMode | null>(null);
  const [flip3State, setFlip3State] = useState<Flip3State | null>(null);

  // Helper: get next active player after given player
  const getNextActivePlayer = useCallback(
    (afterPlayer: string, statusOverride: Record<string, PlayerStatus> | null = null) => {
      const st = statusOverride || playerStatus;
      const currentIdx = players.indexOf(afterPlayer);
      if (currentIdx === -1) return null;
      for (let offset = 1; offset <= players.length; offset++) {
        const nextIdx = (currentIdx + offset) % players.length;
        const nextP = players[nextIdx];
        if (st[nextP] === "active") return nextP;
      }
      return null;
    },
    [players, playerStatus]
  );

  // Derived: remaining deck composition
  const remainingNumbers = useMemo(
    () => getRemainingNumberCounts(playerCards, deckUsed),
    [playerCards, deckUsed]
  );
  const { modCounts: remainingMods, actCounts: remainingActs } = useMemo(
    () => getRemainingSpecialCounts(playerCards, deckUsed),
    [playerCards, deckUsed]
  );
  const totalRemainingCards = useMemo(() => {
    let t = 0;
    for (let i = 0; i <= 12; i++) t += Math.max(0, remainingNumbers[i]);
    Object.values(remainingMods).forEach((v) => (t += Math.max(0, v)));
    Object.values(remainingActs).forEach((v) => (t += Math.max(0, v)));
    return t;
  }, [remainingNumbers, remainingMods, remainingActs]);

  const addPlayer = () => {
    const name = newPlayerName.trim();
    if (name && !players.includes(name)) {
      setPlayers([...players, name]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (name: string) => setPlayers(players.filter((p) => p !== name));

  const initRound = (dIdx: number) => {
    const cards: Record<string, Card[]> = {};
    const status: Record<string, PlayerStatus> = {};
    players.forEach((p) => {
      cards[p] = [];
      status[p] = "active";
    });
    setPlayerCards(cards);
    setPlayerStatus(status);
    const starter = players[(dIdx + 1) % players.length];
    setActivePlayer(starter);
    setDeckUsed([]);
    setUndoStack([]);
    setActionMode(null);
    setFlip3State(null);
  };

  const startGame = () => {
    if (players.length < 2) return;
    const scores: Record<string, number> = {};
    players.forEach((p) => (scores[p] = 0));
    setTotalScores(scores);
    setRoundNumber(1);
    setDealerIndex(0);
    setRoundScoreHistory([]);
    initRound(0);
    setScreen("playing");
  };

  const saveUndoState = () => {
    setUndoStack((prev) => [
      ...prev,
      {
        playerCards: JSON.parse(JSON.stringify(playerCards)),
        playerStatus: { ...playerStatus },
        activePlayer,
        deckUsed: [...deckUsed],
        actionMode,
        flip3State,
      },
    ]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setPlayerCards(prev.playerCards);
    setPlayerStatus(prev.playerStatus);
    setActivePlayer(prev.activePlayer);
    setDeckUsed(prev.deckUsed);
    setActionMode(prev.actionMode);
    setFlip3State(prev.flip3State);
    setUndoStack((s) => s.slice(0, -1));
  };

  // Helper: check for bust when dealing a number card, returns updated status
  const checkBust = (
    target: string,
    newCards: Record<string, Card[]>,
    currentStatus: Record<string, PlayerStatus>
  ): { newStatus: Record<string, PlayerStatus>; busted: boolean } => {
    const numCards = newCards[target].filter((c) => c.type === "number");
    const nums = numCards.map((c) => c.value);
    const hasDuplicate = nums.length !== new Set(nums).size;

    if (!hasDuplicate) return { newStatus: currentStatus, busted: false };

    const has2ndChance = newCards[target].some(
      (c) => c.type === "action" && c.value === "2ndChance"
    );
    if (has2ndChance) {
      const scIdx = newCards[target].findIndex(
        (c) => c.type === "action" && c.value === "2ndChance"
      );
      const removed1 = newCards[target].splice(scIdx, 1)[0];
      const dupIdx = newCards[target].length - 1;
      const removed2 = newCards[target].splice(dupIdx, 1)[0];
      setDeckUsed((prev) => [...prev, removed1, removed2]);
      return { newStatus: { ...currentStatus, [target]: "stayed" }, busted: true };
    } else {
      return { newStatus: { ...currentStatus, [target]: "busted" }, busted: true };
    }
  };

  const dealCard = (card: Card) => {
    // Block dealing while waiting for action target selection
    if (actionMode) return;

    // ── Flip3 forced draw mode ──
    if (flip3State) {
      const target = flip3State.targetPlayer;
      if (playerStatus[target] !== "active") {
        // Target already out, end flip3
        setFlip3State(null);
        const next = getNextActivePlayer(flip3State.sourcePlayer);
        setActivePlayer(next);
        return;
      }

      saveUndoState();

      const newCards = { ...playerCards };
      newCards[target] = [...newCards[target], card];
      let newStatus = { ...playerStatus };
      let knockedOut = false;
      const newCardsDealt = flip3State.cardsDealt + 1;

      // During flip3, only number cards can cause bust; actions/modifiers just go to hand
      if (card.type === "number") {
        const result = checkBust(target, newCards, newStatus);
        newStatus = result.newStatus;
        knockedOut = result.busted;
      }

      setPlayerCards(newCards);
      setPlayerStatus(newStatus);

      if (knockedOut || newCardsDealt >= 3) {
        // Flip3 done — advance from the player who drew Flip3
        setFlip3State(null);
        const next = getNextActivePlayer(flip3State.sourcePlayer, newStatus);
        setActivePlayer(next);
      } else {
        setFlip3State({ ...flip3State, cardsDealt: newCardsDealt });
      }
      return;
    }

    // ── Normal dealing mode ──
    const target = activePlayer;
    if (!target || playerStatus[target] !== "active") return;
    saveUndoState();

    const newCards = { ...playerCards };
    newCards[target] = [...newCards[target], card];
    let newStatus = { ...playerStatus };
    let knockedOut = false;

    if (card.type === "number") {
      const result = checkBust(target, newCards, newStatus);
      newStatus = result.newStatus;
      knockedOut = result.busted;
    }

    setPlayerCards(newCards);
    setPlayerStatus(newStatus);

    if (card.type === "action") {
      if (card.value === "2ndChance") {
        // 2nd Chance is passive — goes to hand, auto-advance
        const next = getNextActivePlayer(target, knockedOut ? newStatus : null);
        setActivePlayer(next);
        return;
      }

      // Freeze or Flip3
      const isInitialDeal = (playerCards[target]?.length || 0) === 0;
      if (isInitialDeal) {
        // First card of the round — action has no effect, auto-advance
        const next = getNextActivePlayer(target);
        setActivePlayer(next);
      } else {
        // Enter targeting mode
        setActionMode({
          type: card.value === "Freeze" ? "freeze" : "flip3",
          sourcePlayer: target,
        });
      }
      return;
    }

    // Number and modifier cards: auto-advance to next player
    const nextPlayer = getNextActivePlayer(target, knockedOut ? newStatus : null);
    setActivePlayer(nextPlayer);
  };

  const selectActionTarget = (targetPlayer: string) => {
    if (!actionMode) return;
    if (playerStatus[targetPlayer] !== "active") return;

    saveUndoState();

    if (actionMode.type === "freeze") {
      const newStatus: Record<string, PlayerStatus> = { ...playerStatus, [targetPlayer]: "frozen" };
      setPlayerStatus(newStatus);
      setActionMode(null);
      const next = getNextActivePlayer(actionMode.sourcePlayer, newStatus);
      setActivePlayer(next);
    } else if (actionMode.type === "flip3") {
      setFlip3State({
        sourcePlayer: actionMode.sourcePlayer,
        targetPlayer,
        cardsDealt: 0,
      });
      setActionMode(null);
    }
  };

  const cancelAction = () => {
    setActionMode(null);
  };

  const setStatusAndAdvance = (player: string, status: PlayerStatus) => {
    saveUndoState();
    const newStatus = { ...playerStatus, [player]: status };
    setPlayerStatus(newStatus);
    const next = getNextActivePlayer(player, newStatus);
    setActivePlayer(next);
  };

  const advanceToNextPlayer = () => {
    const next = getNextActivePlayer(activePlayer!);
    if (next) setActivePlayer(next);
  };

  const discardCard = (card: Card) => {
    saveUndoState();
    setDeckUsed((prev) => [...prev, card]);
  };

  const allDone = useMemo(() => {
    return players.every((p) => playerStatus[p] !== "active");
  }, [players, playerStatus]);

  const anyFlip7 = useMemo(() => {
    return players.some((p) => {
      const nums = new Set(
        playerCards[p]?.filter((c) => c.type === "number").map((c) => c.value)
      );
      return nums.size >= 7 && playerStatus[p] !== "busted";
    });
  }, [players, playerCards, playerStatus]);

  const endRound = () => {
    const roundScores: Record<string, number> = {};
    players.forEach((p) => {
      if (playerStatus[p] === "busted") {
        roundScores[p] = 0;
      } else {
        const uniqueNums = new Set(
          playerCards[p]?.filter((c) => c.type === "number").map((c) => c.value)
        );
        roundScores[p] = calcScore(playerCards[p] || [], uniqueNums.size >= 7);
      }
    });
    setRoundScoreHistory((prev) => [...prev, { round: roundNumber, scores: roundScores }]);

    const newTotals = { ...totalScores };
    players.forEach((p) => {
      newTotals[p] = (newTotals[p] || 0) + roundScores[p];
    });
    setTotalScores(newTotals);

    const maxScore = Math.max(...Object.values(newTotals));
    if (maxScore >= targetScore) {
      setScreen("gameOver");
    } else {
      setScreen("roundEnd");
    }
  };

  const nextRound = () => {
    const newDealer = (dealerIndex + 1) % players.length;
    setDealerIndex(newDealer);
    setRoundNumber((r) => r + 1);
    initRound(newDealer);
    setScreen("playing");
  };

  const resetGame = () => {
    setScreen("setup");
    setPlayers([]);
    setTotalScores({});
    setRoundNumber(0);
    setRoundScoreHistory([]);
    setDealerIndex(0);
  };

  // Card selector options
  const numberOptions: CardOption[] = [];
  for (let i = 0; i <= 12; i++) {
    numberOptions.push({
      type: "number",
      value: i,
      remaining: Math.max(0, remainingNumbers[i]),
    });
  }
  const modOptions: CardOption[] = MODIFIERS.map((m) => ({
    type: "modifier" as const,
    value: m,
    remaining: Math.max(0, remainingMods[m] || 0),
  }));
  const actOptions: CardOption[] = [
    { type: "action", value: "Freeze", remaining: Math.max(0, remainingActs["Freeze"] || 0) },
    { type: "action", value: "Flip3", remaining: Math.max(0, remainingActs["Flip3"] || 0) },
    { type: "action", value: "2ndChance", remaining: Math.max(0, remainingActs["2ndChance"] || 0) },
  ];

  return {
    screen,
    players,
    newPlayerName,
    targetScore,
    setNewPlayerName,
    setTargetScore,
    addPlayer,
    removePlayer,
    startGame,
    totalScores,
    roundNumber,
    roundScoreHistory,
    dealerIndex,
    playerCards,
    playerStatus,
    activePlayer,
    showDeckView,
    setShowDeckView,
    setActivePlayer,
    actionMode,
    flip3State,
    selectActionTarget,
    cancelAction,
    remainingNumbers,
    remainingMods,
    remainingActs,
    totalRemainingCards,
    allDone,
    anyFlip7,
    numberOptions,
    modOptions,
    actOptions,
    dealCard,
    setStatusAndAdvance,
    advanceToNextPlayer,
    discardCard,
    endRound,
    nextRound,
    resetGame,
    undo,
    canUndo: undoStack.length > 0,
  };
}

// Re-export scoring for components that need it directly
export { calcBustProb, calcScore } from "../utils/scoring";
