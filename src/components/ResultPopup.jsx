export default function ResultPopup({ show, message, onPlayAgain, onRepeatBet }) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{message}</h2>
        <div className="popup-buttons">
          <button onClick={onPlayAgain}>Play Again</button>
          <button onClick={onRepeatBet}>Repeat Bet</button>
        </div>
      </div>
    </div>
  );
}
