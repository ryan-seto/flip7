import type { Card, CardOption } from "../types/game";
import { CardButton } from "./CardButton";

interface CardDealingControlsProps {
  activePlayer: string;
  numberOptions: CardOption[];
  modOptions: CardOption[];
  actOptions: CardOption[];
  onDealCard: (card: Card) => void;
  onStay: () => void;
  onFreeze: () => void;
  onAdvance: () => void;
  onDiscard: (card: Card) => void;
}

export function CardDealingControls({
  activePlayer,
  numberOptions,
  modOptions,
  actOptions,
  onDealCard,
  onStay,
  onFreeze,
  onAdvance,
  onDiscard,
}: CardDealingControlsProps) {
  return (
    <>
      <div className="bg-flip-panel rounded-xl p-4 border border-flip-accent/25 mb-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-bold text-flip-accent font-display">
            Dealing to: {activePlayer}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={onStay}
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold font-mono cursor-pointer bg-flip-stay/10 text-flip-stay border border-flip-stay/25"
            >
              Stay
            </button>
            <button
              onClick={onFreeze}
              className="px-3 py-1.5 rounded-md text-[11px] font-semibold font-mono cursor-pointer bg-flip-blue/10 text-flip-blue border border-flip-blue/25"
            >
              Freeze
            </button>
          </div>
        </div>

        {/* Number cards */}
        <div className="mb-2.5">
          <div className="text-[10px] text-flip-subtle font-mono mb-1.5 tracking-widest">
            NUMBER CARDS <span className="text-flip-accent text-[9px]">→ auto-advances</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {numberOptions.map((opt) => (
              <CardButton
                key={opt.value}
                card={opt}
                onClick={() => onDealCard(opt)}
                disabled={opt.remaining <= 0}
                small
              />
            ))}
          </div>
        </div>

        {/* Modifiers */}
        <div className="mb-2.5">
          <div className="text-[10px] text-flip-subtle font-mono mb-1.5 tracking-widest">
            MODIFIERS <span className="text-flip-accent text-[9px]">→ auto-advances</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {modOptions.map((opt) => (
              <CardButton
                key={opt.value}
                card={opt}
                onClick={() => onDealCard(opt)}
                disabled={opt.remaining <= 0}
                small
              />
            ))}
          </div>
        </div>

        {/* Action cards */}
        <div>
          <div className="text-[10px] text-flip-subtle font-mono mb-1.5 tracking-widest">
            ACTION CARDS{" "}
            <span className="text-flip-gold text-[9px]">— resolve then tap Next ↓</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {actOptions.map((opt) => (
              <CardButton
                key={opt.value}
                card={opt}
                onClick={() => onDealCard(opt)}
                disabled={opt.remaining <= 0}
                small
              />
            ))}
          </div>
        </div>

        {/* Manual advance */}
        <div className="mt-3 border-t border-flip-border pt-3">
          <button
            onClick={onAdvance}
            className="w-full py-2 rounded-md text-xs font-bold font-mono cursor-pointer bg-flip-gold/10 text-flip-gold border border-flip-gold/20"
          >
            Done → Next Player
          </button>
        </div>
      </div>

      {/* Discard zone */}
      <details className="mb-4">
        <summary className="text-[11px] text-flip-muted cursor-pointer font-mono">
          ▸ Discard card from deck (not dealt to player)
        </summary>
        <div className="mt-2 flex flex-wrap gap-1">
          {numberOptions.map((opt) => (
            <CardButton
              key={`d_${opt.value}`}
              card={opt}
              onClick={() => onDiscard(opt)}
              disabled={opt.remaining <= 0}
              small
            />
          ))}
        </div>
      </details>
    </>
  );
}
