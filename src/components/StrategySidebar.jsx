import { getBasicStrategyAction, ACTION_LABELS } from "../utils/strategy.js";
import { canDouble } from "../utils/doubleRules.js";
import { canSplitHand } from "../utils/splitRules.js";

export default function StrategySidebar({
  show,
  player,
  playerHands,
  splitActive,
  activeHandIndex,
  dealerUpCard,
  onClose,
}) {
  if (!show) return null;

  const currentHand = splitActive ? playerHands[activeHandIndex] : player;

  const strategyAction =
    currentHand?.length >= 2 && dealerUpCard
      ? getBasicStrategyAction(currentHand, dealerUpCard, {
          canSplit:
            canSplitHand(currentHand),
          canDoubleNow: canDouble(currentHand),
        })
      : null;

  return (
    <aside className="strategy-sidebar" aria-hidden={!show}>
      <div className="strategy-header">
        <strong>Basic Strategy</strong>
        <button className="strategy-close" onClick={onClose} aria-label="Close strategy">
          ×
        </button>
      </div>
      <div className="strategy-body">
        {strategyAction ? (
          <div className="strategy-content">
            <strong>Recommended move:</strong> {ACTION_LABELS?.[strategyAction] ?? strategyAction}
          </div>
        ) : (
          <div className="strategy-empty">No recommendation available.</div>
        )}
      </div>
    </aside>
  );
}
