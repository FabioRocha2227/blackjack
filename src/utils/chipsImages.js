function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export const CHIP_VALUES = [100, 50, 25, 10, 5];

export function chipImageSrc(value) {
  return assetUrl(`chips/chip_${value}.png`);
}

export function chipStackedImageSrc(value) {
  return assetUrl(`chips/chip_stacked_${value}.png`);
}

export function breakdownIntoChips(amount) {
  let remaining = Math.max(0, Math.floor(amount));
  const stacks = [];

  for (const value of CHIP_VALUES) {
    const count = Math.floor(remaining / value);
    if (count > 0) {
      stacks.push({ value, count });
      remaining -= count * value;
    }
  }

  return { stacks, remainder: remaining };
}
