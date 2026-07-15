export default function ResultPopup({ show, message, onPlayAgain }) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{message}</h2>
        <button onClick={onPlayAgain}>Play Again</button>
      </div>
    </div>
  );
}
