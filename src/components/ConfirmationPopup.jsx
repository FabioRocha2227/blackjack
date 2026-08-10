import { useEffect, useState } from "react";

export default function ConfirmationPopup({ show, message, onConfirm, onCancel }) {

    if (!show) return null;

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>{message}</h2>
                <div className="popup-buttons">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
}