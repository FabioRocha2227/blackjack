import { useState } from "react";

const DEFAULT_CHIPS = 500;
const MAX_NAME_LENGTH = 20;

export default function GameDialog({onStart, onCancel}) {
    const [name, setName] = useState("");
    const [chips, setChips] = useState(String(DEFAULT_CHIPS));

    const trimmedName = name.trim();
    const chipsValue = Number(chips);
    const isNameValid = trimmedName.length > 0 && trimmedName.length <= MAX_NAME_LENGTH;
    const isChipsValid = Number.isFinite(chipsValue) && chipsValue > 0;
    const isValid = isNameValid && isChipsValid;

    function handleSubmit(e) {
        e.preventDefault();
        if (!isValid) return;
        onStart({name: trimmedName, chips: Math.floor(chipsValue)});
    }

    return(
        <div className = "popup-overlay">
            <div className = "popup">
                <h2>New Game</h2>

                <form onSubmit={handleSubmit} className = "new-game-form">
                    <label className="form-field">
                        <span>Player name</span>
                        <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        maxLength={MAX_NAME_LENGTH}
                        placeholder="Enter your name"
                        autoFocus
                        />
                    </label>

                    <label className="form-field">
                        <span>Starting chips</span>
                        <input
                        type="number"
                        value={chips}
                        onChange={e => setChips(e.target.value)}
                        min = {1}
                        step = {50}
                        inputMode = "numeric"
                        />
                    </label>

                    <div className = "popup-actions">
                        <button type = "button" className = "secondary" onClick = {onCancel}>Cancel</button>
                        <button type = "submit" disabled = {!isValid}>Start Game</button>
                    </div>                 
                    
                </form>
        
            </div>
        </div>
    );

}
