import Card from "./Card.jsx";
import { memo } from "react";

function Hand({ cards, hiddenIndexes = [], flipIndexes = [], valueLabel }) {
  return (
    <>
      <div className="hand">
        {cards.map((c, i) => (
          <Card
            key={i}
            card={c}
            hidden={hiddenIndexes.includes(i)}
            flip={flipIndexes.includes(i)}
          />
        ))}
      </div>
      {valueLabel && <p className="hand-value">{valueLabel}</p>}
    </>
  );
}

export default memo(Hand);
