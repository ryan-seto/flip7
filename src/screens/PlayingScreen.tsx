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
  advanceToNextPlayer,
  discardCard,
  endRound,
  undo,
  canUndo,
}: PlayingProps) {
  return (
    <div className="min-h-screen bg-flip-bg text-flip-text font-display flex justify-center p-4">
      <div className="w-full max-w-[480px] pt-6 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black text-white font-mono tracking-[4px] m-0 [text-shadow:0_0_30px_#e9456040]">
              FLIP<span className="text-flip-red">7</span>
            </h1>
            <span className="text-[11px] text-flip-muted font-mono">
              ROUND {roundNumber} · {totalRemainingCards} cards left
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`px-3 py-1.5 rounded-md border border-flip-dark-border bg-flip-border text-flip-subtle text-[11px] font-semibold font-mono cursor-pointer ${
                !canUndo ? "opacity-30" : ""
              }`}
            >
              ↩ Undo
            </button>
            <button
              onClick={() => setShowDeckView(!showDeckView)}
              className="px-3 py-1.5 rounded-md border border-flip-dark-border bg-flip-border text-flip-subtle text-[11px] font-semibold font-mono cursor-pointer"
            >
              {showDeckView ? "Hide" : "Deck"}
            </button>
          </div>
        </div>

        <ScoreboardStrip players={players} totalScores={totalScores} />

        {/* Turn indicator */}
        {activePlayer && playerStatus[activePlayer] === "active" && (
          <div className="text-center py-2 mb-3 text-[13px] font-bold text-flip-accent font-display bg-flip-accent/[0.03] rounded-lg">
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
            return (
              <PlayerCard
                key={p}
                player={p}
                isActive={activePlayer === p}
                isDealer={players[dealerIndex] === p}
                onClick={() => setActivePlayer(p)}
                bustProb={bustProb}
                score={score}
                cards={cards}
                status={playerStatus[p]}
                uniqueNumberCount={uniqueNums.size}
              />
            );
          })}
        </div>

        {/* Card dealing controls */}
        {activePlayer && playerStatus[activePlayer] === "active" && (
          <CardDealingControls
            activePlayer={activePlayer}
            numberOptions={numberOptions}
            modOptions={modOptions}
            actOptions={actOptions}
            onDealCard={(card) => dealCard(card)}
            onStay={() => setStatusAndAdvance(activePlayer, "stayed")}
            onFreeze={() => setStatusAndAdvance(activePlayer, "frozen")}
            onAdvance={advanceToNextPlayer}
            onDiscard={discardCard}
          />
        )}

        {/* End round button */}
        {(allDone || anyFlip7) && (
          <button
            onClick={endRound}
            className="w-full py-3.5 rounded-[10px] border-none bg-flip-accent text-flip-bg text-sm font-extrabold tracking-[2px] font-mono cursor-pointer transition-all hover:brightness-110"
          >
            END ROUND
          </button>
        )}
        {!activePlayer && !allDone && !anyFlip7 && (
          <p className="text-center text-flip-muted text-[13px] italic">
            Tap a player to deal them cards
          </p>
        )}
      </div>
    </div>
  );
}
