import { memo } from "react";
import { breakdownIntoChips, chipStackedImageSrc } from "../utils/chipsImages.js";

function ChipStack({ amount, size = "md" }) {
  const { stacks, remainder } = breakdownIntoChips(amount);

  if (stacks.length === 0) return null;

  return (
    <span className={`chip-stack chip-stack--${size}`}>
      {stacks.map(({ value, count }) => (
        <span key={value} className="chip-stack__item">
          <img src={chipStackedImageSrc(value)} alt={`${value}-chip stack`} />
          {count > 1 && <span className="chip-stack__count">×{count}</span>}
        </span>
      ))}
      {remainder > 0 && <span className="chip-stack__remainder">+{remainder}</span>}
    </span>
  );
}

export default memo(ChipStack);
