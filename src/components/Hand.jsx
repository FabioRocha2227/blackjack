import Card from "./Card.jsx";
import { memo } from "react";

function Hand({ cards, hiddenIndexes = [], flipIndexes = [], rotatedIndexes = [], valueLabel }) {
  return (
    <>
      <div className="hand">
        {cards.map((c, i) => (
          <Card
            key={i}
            card={c}
            hidden={hiddenIndexes.includes(i)}
            flip={flipIndexes.includes(i)}
            rotated={rotatedIndexes.includes(i)}
          />
        ))}
      </div>
      {cards.length > 0 && valueLabel && <p className="hand-value">{valueLabel}</p>}
    </>
  );
}

export default memo(Hand);
