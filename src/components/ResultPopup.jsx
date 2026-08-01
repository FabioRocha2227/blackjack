import { useEffect, useState } from "react";

export default function ResultPopup({ show, message, onPlayAgain, onRepeatBet }) {
  const [minimized, setMinimized] = useState(false);

  // Whenever a new result comes in, make sure it shows in full (don't carry
  // a minimized state over from a previous round).
  useEffect(() => {
    if (show) setMinimized(false);
  }, [show]);

  if (!show) return null;

  if (minimized) {
    return (
      <button
        className="popup-restore"
        onClick={() => setMinimized(false)}
        aria-label="Show hand result"
      >
        View Result
      </button>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button
          className="popup-minimize"
          onClick={() => setMinimized(true)}
          aria-label="Minimize to view your hand"
          title="Minimize to view your hand"
        >
          &minus;
        </button>
        <h2>{message}</h2>
        <div className="popup-buttons">
          <button onClick={onRepeatBet}>Repeat Bet</button>
          <button onClick={onPlayAgain}>New bet</button>
        </div>
      </div>
    </div>
  );
}
