import React, { useState } from "react";
import { buildDeck, shuffleDeck, handValue } from "./utils/deck.js";
//import { basicStrategyHint } from "./utils/strategy.js";
import "./App.css";

export default function App() {
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [message, setMessage] = useState("");
  const [dealerRevealed, setDealerRevealed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [playerHands, setPlayerHands] = useState([]); // novas maos apos split
  const [activeHandIndex, setActiveHandIndex] = useState(0); // indica a mao atual durante split
  const [splitActive, setSplitActive] = useState(false); // controla se o split está ativo


  function startGame() {
    const newDeck = buildDeck();
    shuffleDeck(newDeck);
    //forçar carta para teste
    const forcedCard = { rank: "8", suit: "Hearts" }; 
    const playerHand = [forcedCard, { rank: "8", suit: "Hearts" }]; 
    //const playerHand = [newDeck.pop(), newDeck.pop()];
    const dealerHand = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayer(playerHand);
    setDealer(dealerHand);
    setPlayerHands([]); // limpa splits anteriores
    setActiveHandIndex(0);
    setSplitActive(false);
    setMessage("");
    setDealerRevealed(false); //Dealer volta a esconder a 2ª carta
    setGameStarted(true);
  }

  async function playerHit() {
    if (handValue(player) >= 21) return;

    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newPlayerHand = [...player, newCard];

    setDeck(newDeck);
    setPlayer(newPlayerHand);


    if (handValue(newPlayerHand) === 21) {
      // revelar dealer
      setDealerRevealed(true);
      // mensagem
      setMessage("Player hits 21! Player wins!");
      // botoes com os porcos
      setGameStarted(false);
      //delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // pop up
      setShowPopup(true);
    }
    // se o burro perdeu
    if (handValue(newPlayerHand) > 21) {
      //revelar dealer
      setDealerRevealed(true);
      // mensagem
      setMessage("Player busts! Dealer wins!");
      // botoes com os porcos
      setGameStarted(false);
      //delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // pop up
      setShowPopup(true);
    }
  }

  async function playerStand() {
  let newDeck = [...deck];
  let dealerHand = [...dealer];

  // Revela carta escondida
  setDealerRevealed(true);

  // Pausa breve antes do dealer agir
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Dealer compra cartas uma a uma com pausa
  while (handValue(dealerHand) < 17 && newDeck.length > 0) {
    const newCard = newDeck.pop();
    dealerHand.push(newCard);
    setDealer([...dealerHand]); // atualiza visualmente
    setDeck([...newDeck]);
    await new Promise(resolve => setTimeout(resolve, 800)); // pequena pausa
  }

  // Calcula resultado final
  const playerTotal = handValue(player);
  const dealerTotal = handValue(dealerHand);

  let resultMessage = "";

  if (dealerTotal > 21) {
    resultMessage = "Dealer busts! Player wins!";
  } else if (playerTotal > 21) {
    resultMessage = "Player busts! Dealer wins!";
  } else if (playerTotal > dealerTotal) {
    resultMessage = "Player wins!";
  } else if (playerTotal < dealerTotal) {
    resultMessage = "Dealer wins!";
  } else {
    resultMessage = "Push (tie)!";
  }

  // Atualiza estados finais
  setDealer([...dealerHand]);
  setDeck([...newDeck]);
  setMessage(resultMessage);

  // Pausa pequena antes de mostrar o pop-up
  await new Promise(resolve => setTimeout(resolve, 1000));

  setShowPopup(true);  
  setGameStarted(false);
}


  function getDealerDisplayValue() {
  if (dealer.length === 0) return 0;
  if (!dealerRevealed) {
    // só conta a primeira carta
    return handValue([dealer[0]]);
  }
  return handValue(dealer);
}

function playAgain(){
  setShowPopup(false);
  startGame();
}


async function playerDouble(){
  if (!gameStarted || player.length !== 2) return;

  let newDeck = [...deck];
  const newCard = newDeck.pop();
  const newPlayerHand = [...player, newCard];

  setDeck([...newDeck]);
  setPlayer([...newPlayerHand]);

  //para o jogador e revelar o dealer

  setDealerRevealed(true);
  setGameStarted(false);

  await new Promise(resolve => setTimeout(resolve, 800));
 // se ele perder  com double
  if (handValue(newPlayerHand) > 21) {
    setDealerRevealed(true);
    setMessage("Player busts after doubling! Dealer wins!");
    setGameStarted(false);
    await new Promise(resolve => setTimeout(resolve, 800));
    setShowPopup(true);
    return;
  }

  playerStand();
}


async function playerSplit(){
  if(player.length !== 2 || player[0].rank !== player[1].rank) return;

  const newDeck = [...deck];
  const firstHand = [player[0], newDeck.pop()];
  const secondHand = [player[1], newDeck.pop()];

  setSplitActive(true);
  setDeck(newDeck);
  setPlayerHands([firstHand, secondHand]);
  setActiveHandIndex(0);
  setPlayer([]); // limpa a mão "original"
  setMessage("Playing Hand 1...");
}

async function playerHitSplit(index) {
  const newDeck = [...deck];
  const newCard = newDeck.pop();

  const newHands = [...playerHands];
  newHands[index] = [...newHands[index], newCard];

  setDeck(newDeck);
  setPlayerHands(newHands);

  if (handValue(newHands[index]) > 21) {
    setMessage(`Hand ${index + 1} busts!`);
    await new Promise(res => setTimeout(res, 800));
    nextSplitHand(index);
  }
}

async function playerStandSplit(index) {
  setMessage(`Hand ${index + 1} stands.`);
  await new Promise(res => setTimeout(res, 800));
  nextSplitHand(index);
}

async function nextSplitHand(index) {
  if (index + 1 < playerHands.length) {
    setMessage(`Hand ${index + 1} done! Moving to Hand ${index + 2}...`);
    await new Promise(res => setTimeout(res, 400));
    setActiveHandIndex(index + 1);
    setMessage(`Playing Hand ${index + 2}...`);
  } else {
    setMessage("Dealer's turn...");
    await new Promise(res => setTimeout(res, 400));
    dealerPlayAfterSplit();
  }
}
async function dealerPlayAfterSplit() {
  let newDeck = [...deck];
  let dealerHand = [...dealer];

  setDealerRevealed(true);

  while (handValue(dealerHand) < 17) {
    await new Promise(res => setTimeout(res, 600));
    dealerHand.push(newDeck.pop());
    setDealer([...dealerHand]);
  }

  setDeck(newDeck);

  // Avaliar resultado de cada mão
  const results = playerHands.map((hand, i) => {
    const playerTotal = handValue(hand);
    const dealerTotal = handValue(dealerHand);

    if (playerTotal > 21) return `Hand ${i + 1}: Bust`;
    if (dealerTotal > 21) return `Hand ${i + 1}: Dealer busts — Player wins!`;
    if (playerTotal > dealerTotal) return `Hand ${i + 1}: Player wins!`;
    if (playerTotal < dealerTotal) return `Hand ${i + 1}: Dealer wins!`;
    return `Hand ${i + 1}: Push (tie)`;
  });

  setMessage(results.join(" | "));
  await new Promise(res => setTimeout(res, 1000));
  setShowPopup(true);
  setGameStarted(false);
}


return (
  <div className="table-contairer">
    <h1 className="game-title">♠ Blackjack</h1>

    {/* Dealer Area */}
    <div className="dealer-area">
  <h2>Dealer</h2>
  <div className="hand">
    {dealer.map((c, i) => {
      const isBack = !dealerRevealed && i === 1; // segunda carta escondida
      return (
        <div
          key={i}
          className={`card ${isBack ? "back" : ""} ${dealerRevealed && i === 1 ? "flip" : ""}`}
        >
          {dealerRevealed || i === 0 ? `${c.rank}${c.suit}` : "🂠"}
        </div>
      );
    })}
  </div>
  <p className="hand-value">
    {dealerRevealed ? `Value: ${handValue(dealer)}` : "Value: ?"}
  </p>
  <p className="table-rule">Dealer hits on 16</p>
</div>

    {/* Player Area */}
    <div className="player-area">
      <h2>Your Hand{splitActive ? "s" : ""}</h2>

      {!splitActive ? (
        <>
          <div className="hand">
            {player.map((c, i) => (
              <div key={i} className="card">{`${c.rank}${c.suit}`}</div>
            ))}
          </div>
          <p className="hand-value">Value: {handValue(player)}</p>
        </>
      ) : (
        playerHands.map((hand, i) => (
          <div
            key={i}
            className={`split-hand ${activeHandIndex === i ? "active-hand" : ""}`}
          >
            <div className="hand">
              {hand.map((c, j) => (
                <div key={j} className="card">{`${c.rank}${c.suit}`}</div>
              ))}
            </div>
            <p className="hand-value">Hand {i + 1} Value: {handValue(hand)}</p>
          </div>
        ))
      )}
    </div>

    {/* Buttons */}
    <div className="controls">
      {!gameStarted && !showPopup && (
        <button onClick={startGame}>Start Game</button>
      )}
      {gameStarted && !showPopup && (
        <>
          {!splitActive ? (
            <>
              <button onClick={playerHit}>Hit</button>
              <button onClick={playerStand}>Stand</button>
              { player.length === 2 && (
                <button onClick={playerDouble}>Double</button>  
              )}
              {player.length === 2 && player[0].rank === player[1].rank && (
                <button onClick={playerSplit}>Split</button>
              )}
            </>
          ) : (
            <>
              <button onClick={() => playerHitSplit(activeHandIndex)}>Hit</button>
              <button onClick={() => playerStandSplit(activeHandIndex)}>Stand</button>
            </>
          )}
        </>
      )}
    </div>

    {/* Pop-up */}
    {showPopup && (
      <div className="popup-overlay">
        <div className="popup">
          <h2>{message}</h2>
          <button onClick={playAgain}>Play Again</button>
        </div>
      </div>
    )}
  </div>
);

}