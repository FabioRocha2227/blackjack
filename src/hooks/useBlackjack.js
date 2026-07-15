import { useState } from "react";
import { buildDeck, shuffleDeck, handValue } from "../utils/deck.js";
import { canDouble } from "../utils/doubleRules.js";

// Below this many cards left in the shoe, we cut and bring in a fresh deck
// instead of reshuffling a full 52-card deck every single hand.
const RESHUFFLE_THRESHOLD = 15;

export function useBlackjack() {
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [message, setMessage] = useState("");
  const [dealerRevealed, setDealerRevealed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [playerHands, setPlayerHands] = useState([]); // hands after a split
  const [activeHandIndex, setActiveHandIndex] = useState(0); // which split hand is being played
  const [splitActive, setSplitActive] = useState(false);

  async function startGame() {
    let newDeck = deck.length < RESHUFFLE_THRESHOLD ? shuffleDeck(buildDeck()) : [...deck];

    const playerHand = [newDeck.pop(), newDeck.pop()];
    const dealerHand = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayer(playerHand);
    setDealer(dealerHand);
    setPlayerHands([]);
    setActiveHandIndex(0);
    setSplitActive(false);
    setMessage("");
    setDealerRevealed(false);
    setGameStarted(true);

    const playerTotal = handValue(playerHand);
    const dealerTotal = handValue(dealerHand);

    if (playerTotal === 21) {
      setDealerRevealed(true);
      setGameStarted(false);
      setMessage(dealerTotal === 21 ? "Push!" : "Blackjack! Player wins!");
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowPopup(true);
    }
  }

  async function playerHit() {
    if (handValue(player) >= 21) return;

    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newPlayerHand = [...player, newCard];

    setDeck(newDeck);
    setPlayer(newPlayerHand);

    const total = handValue(newPlayerHand);

    if (total === 21) {
      setDealerRevealed(true);
      setMessage("Player hits 21! Player wins!");
      setGameStarted(false);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowPopup(true);
    } else if (total > 21) {
      setDealerRevealed(true);
      setMessage("Player busts! Dealer wins!");
      setGameStarted(false);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowPopup(true);
    }
  }

  async function playerStand() {
    let newDeck = [...deck];
    let dealerHand = [...dealer];

    setDealerRevealed(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    while (handValue(dealerHand) < 17 && newDeck.length > 0) {
      const newCard = newDeck.pop();
      dealerHand.push(newCard);
      setDealer([...dealerHand]);
      setDeck([...newDeck]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const playerTotal = handValue(player);
    const dealerTotal = handValue(dealerHand);

    let resultMessage;
    if (dealerTotal > 21) resultMessage = "Dealer busts! Player wins!";
    else if (playerTotal > 21) resultMessage = "Player busts! Dealer wins!";
    else if (playerTotal > dealerTotal) resultMessage = "Player wins!";
    else if (playerTotal < dealerTotal) resultMessage = "Dealer wins!";
    else resultMessage = "Push (tie)!";

    setDealer([...dealerHand]);
    setDeck([...newDeck]);
    setMessage(resultMessage);

    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowPopup(true);
    setGameStarted(false);
  }

  async function playerDouble() {
    if (!gameStarted || !canDouble(player)) return;

    let newDeck = [...deck];
    const newCard = newDeck.pop();
    const newPlayerHand = [...player, newCard];

    setDeck([...newDeck]);
    setPlayer([...newPlayerHand]);
    setDealerRevealed(true);
    setGameStarted(false);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (handValue(newPlayerHand) > 21) {
      setMessage("Player busts after doubling! Dealer wins!");
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowPopup(true);
      return;
    }

    await playerStand();
  }

  async function playerSplit() {
    if (player.length !== 2 || player[0].rank !== player[1].rank) return;

    const newDeck = [...deck];
    const firstHand = [player[0], newDeck.pop()];
    const secondHand = [player[1], newDeck.pop()];

    setSplitActive(true);
    setDeck(newDeck);
    setPlayerHands([firstHand, secondHand]);
    setActiveHandIndex(0);
    setPlayer([]);
    setMessage("Playing Hand 1...");
  }

  async function playerHitSplit(index) {
    const newDeck = [...deck];
    const newCard = newDeck.pop();

    const newHands = [...playerHands];
    newHands[index] = [...newHands[index], newCard];

    setDeck(newDeck);
    setPlayerHands(newHands);

    const handTotal = handValue(newHands[index]);

    if (handTotal > 21) {
      setMessage(`Hand ${index + 1} busts!`);
      await new Promise(res => setTimeout(res, 800));
      nextSplitHand(index);
    } else if (handTotal === 21) {
      setMessage(`Hand ${index + 1} hits 21!`);
      await new Promise(res => setTimeout(res, 800));
      nextSplitHand(index);
    }
  }

  async function playerStandSplit(index) {
    setMessage(`Hand ${index + 1} stands.`);
    await new Promise(res => setTimeout(res, 800));
    nextSplitHand(index);
  }

  async function playerDoubleSplit(index) {
    if (!canDouble(playerHands[index])) return;

    const newDeck = [...deck];
    const newCard = newDeck.pop();

    const newHands = [...playerHands];
    newHands[index] = [...newHands[index], newCard];

    setDeck(newDeck);
    setPlayerHands(newHands);

    const handTotal = handValue(newHands[index]);
    setMessage(
      handTotal > 21
        ? `Hand ${index + 1} busts after doubling!`
        : `Hand ${index + 1} stands after doubling.`
    );

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

  function playAgain() {
    setShowPopup(false);
    startGame();
  }

  return {
    // state
    player,
    dealer,
    message,
    dealerRevealed,
    gameStarted,
    showPopup,
    playerHands,
    activeHandIndex,
    splitActive,
    // actions
    startGame,
    playerHit,
    playerStand,
    playerDouble,
    playerSplit,
    playerHitSplit,
    playerStandSplit,
    playerDoubleSplit,
    playAgain,
  };
}
