import { useState, useEffect } from "react";
import { chipImageSrc } from "../utils/chipsImages.js";
import ChipStack from "./ChipsStack.jsx";

const CHIP_PRESETS = [10, 25, 50, 100];
const MIN_BET = 10;

export default function BettingPanel({ chips, lastBet, onDeal }) {
  const [betInput, setBetInput] = useState("0");

  useEffect(() => {
    const nextBet = Math.max(0, Math.min(Number(lastBet) || 0, chips));
    setBetInput(String(nextBet));
  }, [lastBet, chips]);

  const betValue = Number(betInput);
  const isValid = Number.isFinite(betValue) && betValue >= MIN_BET && betValue <= chips && chips > 0;

  function addPresetBet(amount) {
    setBetInput(prev => {
      const currentBet = Number(prev) || 0;
      return String(Math.min(currentBet + amount, chips));
    });
  }

  function handleDeal(e) {
    e.preventDefault();
    if (!isValid) return;
    onDeal(Math.floor(betValue));
  }

  if (chips <= 0) {
    return (
      <div className="betting-panel">
        <p className="chips-readout">You're out of chips.</p>
        <p className="game-subtitle">Head back to the menu to start a new bankroll.</p>
      </div>
    );
  }

  return (
    <form className="betting-panel" onSubmit={handleDeal}>
      <p className="chips-readout">Chips: {chips}</p>
      <ChipStack amount={chips} size="sm" />

      <div className="chip-presets">
        {CHIP_PRESETS.map(amount => (
          <button
            type="button"
            key={amount}
            className="chip-preset"
            onClick={() => addPresetBet(amount)}
            disabled={amount > chips}
            aria-label={`Add ${amount} chip`}
          >
            <img src={chipImageSrc(amount)} alt="" />
            <span className="chip-preset__label">{amount}</span>
          </button>
        ))}
        <button type="button" className="secondary" onClick={() => setBetInput("0")}>
          Clear
        </button>
      </div>

      <label className="form-field">
        <span>Bet amount</span>
        <input
          type="number"
          value={betInput}
          readOnly
          min={MIN_BET}
          max={chips}
          step={5}
        />
      </label>
      <div className="bet-preview" aria-live="polite">
        <ChipStack amount={betValue} size="sm" />
      </div>

      <button type="submit" disabled={!isValid}>
        Deal
      </button>
    </form>
  );    
}
