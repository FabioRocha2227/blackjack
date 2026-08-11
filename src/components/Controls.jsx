import { canDouble } from "../utils/doubleRules.js";
import { canSplitHand } from "../utils/splitRules.js";
import { memo } from "react";

function Controls({
  splitActive,
  player,
  playerHands,
  activeHandIndex,
  chips,
  bet,
  handBets,
  onHit,
  onStand,
  onDouble,
  onSplit,
  onHitSplit,
  onStandSplit,
  onDoubleSplit,
  onSurrender,
}) {
  const currentHand = splitActive
    ? playerHands?.[activeHandIndex] ?? []
    : player;
  const currentBet = splitActive
    ? handBets?.[activeHandIndex] ?? bet
    : bet;

  return (
    <div className="controls-wrapper">
      <div className="controls">
        {!splitActive ? (
          <>
            <button type="button" onClick={onHit}>Hit</button>

            <button type="button" onClick={() => onStand()}>
              Stand
            </button>

            {/* Surrender available as initial action on two-card hands */}
            {player.length === 2 && (
              <button type="button" onClick={onSurrender}>Surrender</button>
            )}

            

            {canDouble(currentHand) && chips >= currentBet && (
              <button type="button" onClick={onDouble}>Double</button>
            )}

            {canSplitHand(currentHand) && chips >= currentBet && (
              <button type="button" onClick={onSplit}>Split</button>
            )}
          </>
        ) : (
          <>
            <button type="button" onClick={() => onHitSplit(activeHandIndex)}>
              Hit
            </button>

            <button type="button" onClick={() => onStandSplit(activeHandIndex)}>
              Stand
            </button>

            {canDouble(currentHand) && chips >= currentBet && (
                <button
                  type="button"
                  onClick={() => onDoubleSplit(activeHandIndex)}
                >
                  Double
                </button>
              )}
          </>
        )}
      </div>
    </div>
  );
}

export default memo(Controls);
