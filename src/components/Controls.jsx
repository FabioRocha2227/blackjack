import { canDouble } from "../utils/doubleRules.js";
import { memo, useState } from "react";
import { getBasicStrategyAction, ACTION_LABELS } from "../utils/strategy.js";

function Controls({
  splitActive,
  player,
  playerHands,
  activeHandIndex,
  chips,
  bet,
  handBets,
  dealerUpCard,
  onHit,
  onStand,
  onDouble,
  onSplit,
  onHitSplit,
  onStandSplit,
  onDoubleSplit,
}) {
  const [showStrategy, setShowStrategy] = useState(false);

  const currentHand = splitActive
  ? playerHands[activeHandIndex]
  : player;

  const strategyAction =
    currentHand?.length >= 2 && dealerUpCard
      ? getBasicStrategyAction(currentHand, dealerUpCard, {
          canSplit:
            currentHand.length === 2 &&
            currentHand[0].rank === currentHand[1].rank,
          canDoubleNow: canDouble(currentHand),
        })
      : null;

   return (
    <div className="controls-wrapper">
      

      <div className="controls">
        {!splitActive ? (
          <>
            <button onClick={onHit}>Hit</button>

            <button onClick={() => onStand()}>
              Stand
            </button>

            {canDouble(player) && chips >= bet && (
              <button onClick={onDouble}>Double</button>
            )}

            {player.length === 2 &&
              player[0].rank === player[1].rank &&
              chips >= bet && (
                <button onClick={onSplit}>Split</button>
              )}
          </>
        ) : (
          <>
            <button onClick={() => onHitSplit(activeHandIndex)}>
              Hit
            </button>

            <button onClick={() => onStandSplit(activeHandIndex)}>
              Stand
            </button>

            {canDouble(playerHands[activeHandIndex]) &&
              chips >= handBets[activeHandIndex] && (
                <button
                  onClick={() => onDoubleSplit(activeHandIndex)}
                >
                  Double
                </button>
              )}
          </>
        )}
        <div className="strategy-panel">
          <button
            className="strategy-toggle"
            onClick={() => setShowStrategy((prev) => !prev)}
          >
            {showStrategy ? "Hide Strategy ▲" : "Show Strategy ▼"}
          </button>

          {showStrategy && strategyAction && (
            <div className="strategy-content">
              <strong>Recommended move:</strong>{" "}
              {ACTION_LABELS?.[strategyAction] ?? strategyAction}
            </div>
          )}
        </div>  
      </div>
    </div>
  );
}

export default memo(Controls);
