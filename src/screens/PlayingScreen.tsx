import { useState } from "react";
import type { Flip7Game } from "../types/game";
import { calcBustProb, calcScore } from "../hooks/useFlip7Game";
import { PlayerCard } from "../components/PlayerCard";
import { ScoreboardStrip } from "../components/ScoreboardStrip";
import { DeckView } from "../components/DeckView";
import { CardDealingControls } from "../components/CardDealingControls";

type PlayingProps = Pick<
  Flip7Game,
  | "players"
  | "totalScores"
  | "roundNumber"
  | "totalRemainingCards"
  | "dealerIndex"
  | "playerCards"
  | "playerStatus"
  | "activePlayer"
  | "showDeckView"
  | "setShowDeckView"
  | "setActivePlayer"
  | "actionMode"
  | "flip3State"
  | "selectActionTarget"
  | "cancelAction"
  | "remainingNumbers"
  | "remainingMods"
  | "remainingActs"
  | "numberOptions"
  | "modOptions"
  | "actOptions"
  | "allDone"
  | "anyFlip7"
  | "dealCard"
  | "setStatusAndAdvance"
  | "advanceToNextPlayer"
  | "discardCard"
  | "endRound"
  | "undo"
  | "canUndo"
  | "resetGame"
>;

export function PlayingScreen({
  players,
  totalScores,
  roundNumber,
  totalRemainingCards,
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
  numberOptions,
  modOptions,
  actOptions,
  allDone,
  anyFlip7,
  dealCard,
  setStatusAndAdvance,
  discardCard,
  endRound,
  undo,
  canUndo,
  resetGame,
}: PlayingProps) {
  const [showOdds, setShowOdds] = useState(true);
  const isTargeting = actionMode !== null;
  const isFlip3Dealing = flip3State !== null;

  return (
    <div className="min-h-screen bg-flip-bg text-flip-text font-display flex justify-center p-4">
      <div className="w-full max-w-[480px] pt-6 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <img
              src={`${import.meta.env.BASE_URL}banner.png`}
              alt="Flip 7"
              className="h-10 rounded"
            />
            <span className="text-xs text-flip-muted font-mono block mt-0.5">
              ROUND {roundNumber} · {totalRemainingCards} cards left
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`px-3 py-1.5 rounded-md border border-flip-dark-border bg-flip-border text-flip-subtle text-xs font-semibold font-mono cursor-pointer ${
                !canUndo ? "opacity-30" : ""
              }`}
            >
              Undo
            </button>
            <button
              onClick={() => setShowOdds(!showOdds)}
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold font-mono cursor-pointer ${
                showOdds
                  ? "border-flip-accent bg-flip-accent/10 text-flip-accent"
                  : "border-flip-dark-border bg-flip-border text-flip-subtle"
              }`}
            >
              Odds
            </button>
            <button
              onClick={() => setShowDeckView(!showDeckView)}
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold font-mono cursor-pointer ${
                showDeckView
                  ? "border-flip-accent bg-flip-accent/10 text-flip-accent"
                  : "border-flip-dark-border bg-flip-border text-flip-subtle"
              }`}
            >
              Deck
            </button>
            <button
              onClick={resetGame}
              className="px-3 py-1.5 rounded-md border border-flip-red/30 bg-flip-red/10 text-flip-red text-xs font-semibold font-mono cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        <ScoreboardStrip players={players} totalScores={totalScores} />

        {/* Action targeting banner */}
        {isTargeting && (
          <div className="text-center py-3 mb-3 rounded-lg bg-flip-gold/10 border border-flip-gold/30">
            <div className="text-sm font-bold text-flip-gold font-mono mb-1">
              {actionMode.sourcePlayer} drew{" "}
              {actionMode.type === "freeze" ? "Freeze" : "Flip 3"}
            </div>
            <div className="text-xs text-flip-gold/70 font-mono">
              Tap a player to{" "}
              {actionMode.type === "freeze" ? "freeze them" : "force them to draw 3 cards"}
            </div>
            <button
              onClick={cancelAction}
              className="mt-2 px-3 py-1 rounded text-xs font-mono text-flip-subtle border border-flip-dark-border cursor-pointer bg-transparent"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Flip3 dealing banner */}
        {isFlip3Dealing && (
          <div className="text-center py-2 mb-3 text-sm font-bold text-flip-gold font-mono bg-flip-gold/[0.06] rounded-lg">
            Flip 3: Dealing to {flip3State.targetPlayer} ({flip3State.cardsDealt}/3)
          </div>
        )}

        {/* Normal turn indicator */}
        {!isTargeting && !isFlip3Dealing && activePlayer && playerStatus[activePlayer] === "active" && (
          <div className="text-center py-2 mb-3 text-sm font-bold text-flip-accent font-mono bg-flip-accent/[0.03] rounded-lg">
            ▶ {activePlayer}'s turn
          </div>
        )}

        {/* Deck view */}
        {showDeckView && (
          <DeckView
            remainingNumbers={remainingNumbers}
            remainingMods={remainingMods}
            remainingActs={remainingActs}
          />
        )}

        {/* Players list */}
        <div className="flex flex-col gap-2.5 mb-4">
          {players.map((p) => {
            const cards = playerCards[p] || [];
            const uniqueNums = new Set(
              cards.filter((c) => c.type === "number").map((c) => c.value)
            );
            const bustProb = calcBustProb(cards, playerCards, []);
            const score = calcScore(cards, uniqueNums.size >= 7);

            // During targeting, only active players are targetable
            const targetable = isTargeting && playerStatus[p] === "active";

            return (
              <PlayerCard
                key={p}
                player={p}
                isActive={!isTargeting && activePlayer === p}
                isDealer={players[dealerIndex] === p}
                isTargetable={targetable}
                onClick={() => {
                  if (isTargeting && targetable) {
                    selectActionTarget(p);
                  } else if (!isTargeting && !isFlip3Dealing) {
                    setActivePlayer(p);
                  }
                }}
                bustProb={bustProb}
                score={score}
                cards={cards}
                status={playerStatus[p]}
                uniqueNumberCount={uniqueNums.size}
                showOdds={showOdds}
              />
            );
          })}
        </div>

        {/* Flip3 forced dealing controls */}
        {isFlip3Dealing && (
          <CardDealingControls
            activePlayer={flip3State.sourcePlayer}
            numberOptions={numberOptions}
            modOptions={modOptions}
            actOptions={actOptions}
            onDealCard={dealCard}
            onStay={() => {}}
            onDiscard={discardCard}
            isFlip3
            flip3Target={flip3State.targetPlayer}
            flip3Progress={`${flip3State.cardsDealt}/3`}
          />
        )}

        {/* Normal card dealing controls */}
        {!isTargeting && !isFlip3Dealing && activePlayer && playerStatus[activePlayer] === "active" && (
          <CardDealingControls
            activePlayer={activePlayer}
            numberOptions={numberOptions}
            modOptions={modOptions}
            actOptions={actOptions}
            onDealCard={dealCard}
            onStay={() => setStatusAndAdvance(activePlayer, "stayed")}
            onDiscard={discardCard}
          />
        )}

        {/* End round button */}
        {(allDone || anyFlip7) && !isTargeting && !isFlip3Dealing && (
          <button
            onClick={endRound}
            className="w-full py-3.5 rounded-[10px] border-none bg-flip-accent text-flip-card text-sm font-extrabold tracking-[2px] font-mono cursor-pointer transition-all hover:brightness-110"
          >
            END ROUND
          </button>
        )}
        {!activePlayer && !allDone && !anyFlip7 && !isTargeting && !isFlip3Dealing && (
          <p className="text-center text-flip-muted text-sm italic">
            Tap a player to deal them cards
          </p>
        )}
      </div>
    </div>
  );
}
