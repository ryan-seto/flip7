import type { Card, CardOption } from "../types/game";
import { CardButton } from "./CardButton";

interface CardDealingControlsProps {
  activePlayer: string;
  numberOptions: CardOption[];
  modOptions: CardOption[];
  actOptions: CardOption[];
  onDealCard: (card: Card) => void;
  onStay: () => void;
  onDiscard: (card: Card) => void;
  isFlip3?: boolean;
  flip3Target?: string;
  flip3Progress?: string;
}

export function CardDealingControls({
  activePlayer,
  numberOptions,
  modOptions,
  actOptions,
  onDealCard,
  onStay,
  onDiscard,
  isFlip3,
  flip3Target,
  flip3Progress,
}: CardDealingControlsProps) {
  return (
    <>
      <div className="bg-flip-panel rounded-xl p-4 border border-flip-accent/25 mb-4"
        style={isFlip3 ? { borderColor: "#f5a62340" } : undefined}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          {isFlip3 ? (
            <span className="text-[13px] font-bold text-flip-gold font-display">
              Flip 3: Dealing to {flip3Target} ({flip3Progress})
            </span>
          ) : (
            <>
              <span className="text-[13px] font-bold text-flip-accent font-display">
                Dealing to: {activePlayer}
              </span>
              <button
                onClick={onStay}
                className="px-3 py-1.5 rounded-md text-[11px] font-semibold font-mono cursor-pointer bg-flip-stay/10 text-flip-stay border border-flip-stay/25"
              >
                Stay
              </button>
            </>
          )}
        </div>

        {/* Number cards */}
        <div className="mb-2.5">
          <div className="text-[10px] text-flip-subtle font-mono mb-1.5 tracking-widest">
            NUMBER CARDS
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
            MODIFIERS
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

        {/* Action cards — only show during normal dealing, not during flip3 */}
        {!isFlip3 && (
          <div>
            <div className="text-[10px] text-flip-subtle font-mono mb-1.5 tracking-widest">
              ACTION CARDS
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
        )}
      </div>

      {/* Discard zone — only during normal dealing */}
      {!isFlip3 && (
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
      )}
    </>
  );
}
