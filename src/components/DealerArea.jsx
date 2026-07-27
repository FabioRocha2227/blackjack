import Hand from "./Hand.jsx";
import { handValue } from "../utils/deck.js";
import { memo } from "react";

function DealerArea({ dealer, dealerRevealed }) {
  return (
    <div className="dealer-area">
      <h2>Dealer</h2>
      <Hand
        cards={dealer}
        hiddenIndexes={!dealerRevealed ? [1] : []}
        flipIndexes={dealerRevealed ? [1] : []}
        valueLabel={dealerRevealed ? `Value: ${handValue(dealer)}` : "Value: ?"}
      />
    </div>
  );
}

export default memo(DealerArea);
