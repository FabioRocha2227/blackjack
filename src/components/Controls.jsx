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
  return (
    <div className="controls-wrapper">
      <div className="controls">
        {!splitActive ? (
          <>
            <button onClick={onHit}>Hit</button>

            <button onClick={() => onStand()}>
              Stand
            </button>

            {/* Surrender available as initial action on two-card hands */}
            {player.length === 2 && (
              <button onClick={onSurrender}>Surrender</button>
            )}

            

            {canDouble(player) && chips >= bet && (
              <button onClick={onDouble}>Double</button>
            )}

            {canSplitHand(player) && chips >= bet && (
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
      </div>
    </div>
  );
}

export default memo(Controls);
