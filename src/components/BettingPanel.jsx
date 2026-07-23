import { useState, useEffect } from "react";

const CHIP_PRESETS = [10, 25, 50, 100];
const MIN_BET = 10;

export default function BettingPanel({ chips, lastBet, onDeal }) {
    const startingBValue = Math.max(Math.min(lastBet || MIN_BET, chips), 0);
  const [betInput, setBetInput] = useState(String(startingBValue));

useEffect(() => {
    setBetInput(prev => {
      const n = Number(prev);
      if (!Number.isFinite(n) || n > chips) {
        return String(Math.min(chips, MIN_BET));
      }
      return prev;
    });
  }, [chips]);

  const betValue = Number(betInput);
  const isValid = Number.isFinite(betValue) && betValue >= MIN_BET && betValue <= chips && chips > 0;

  function addChip(amount) {
    setBetInput(prev => {
      const n = Number(prev) || 0;
      return String(Math.min(n + amount, chips));
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

      <div className="chip-presets">
        {CHIP_PRESETS.map(amount => (
          <button
            type="button"
            key={amount}
            className="secondary"
            onClick={() => addChip(amount)}
            disabled={amount > chips}
          >
            +{amount}
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
          onChange={e => setBetInput(e.target.value)}
          min={MIN_BET}
          max={chips}
          step={5}
          inputMode="numeric"
        />
      </label>

      <button type="submit" disabled={!isValid}>
        Deal
      </button>
    </form>
  );    
}
