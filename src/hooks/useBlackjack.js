import { useState } from "react";
import { buildDeck, shuffleDeck, handValue } from "../utils/deck.js";
import { canDouble } from "../utils/doubleRules.js";

// Below this many cards left in the shoe, we cut and bring in a fresh deck
// instead of reshuffling a full 52-card deck every single hand.
const RESHUFFLE_THRESHOLD = 15;

export function useBlackjack(initialChips = 500) {
  const [deck, setDeck] = useState([]);
  const [player, setPlayer] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [message, setMessage] = useState("");
  const [dealerRevealed, setDealerRevealed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [awaitingPlayerInput, setAwaitingPlayerInput] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [playerHands, setPlayerHands] = useState([]); // hands after a split
  const [activeHandIndex, setActiveHandIndex] = useState(0); // which split hand is being played
  const [splitActive, setSplitActive] = useState(false);
  const [showStrategy, setShowStrategy] = useState(false);
  const [chips, setChips] = useState(initialChips);
  const [bet, setBet] = useState(0);
  const [handBets, setHandBets] = useState([]); // bets for each hand after a split
  const [doubled, setDoubled] = useState(false); // was the main (non-split) hand doubled down?
  const [handDoubled, setHandDoubled] = useState([]); // was each split hand doubled down?

  //Betting
  function placeBet(amount) {
    if (gameStarted) return;

    const wager = Math.floor(Number(amount));
    if (!Number.isFinite(wager) || wager <= 0 || wager > chips) return;

    setChips((c) => c - wager);
    setBet(wager);
    deal(wager);
  }

  async function deal(wager) {
    let newDeck = deck.length < RESHUFFLE_THRESHOLD ? shuffleDeck(buildDeck()) : [...deck];

    // Uncomment the next line to force a split test hand.
    //const playerHand = [{ rank: "4", suit: "Spades" }, { rank: "4", suit: "Diamonds" }];
    // Uncomment the next line to force a double test hand.
    //const playerHand = [{ rank: "8", suit: "Spades" }, { rank: "3", suit: "Diamonds" }];

    const playerHand = [newDeck.pop(), newDeck.pop()];
    const dealerHand = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayer(playerHand);
    setDealer(dealerHand);
    setPlayerHands([]);
    setHandBets([]);
    setDoubled(false);
    setHandDoubled([]);
    setActiveHandIndex(0);
    setSplitActive(false);
    setMessage("");
    setDealerRevealed(false);
    setGameStarted(true);
    setAwaitingPlayerInput(true);

    const playerTotal = handValue(playerHand);
    const dealerTotal = handValue(dealerHand);

    if (playerTotal === 21) {
      setDealerRevealed(true);

      if (dealerTotal === 21) {
        setChips((c) => c + wager); // push, bet returned
        setMessage("Push! Both player and dealer have Blackjack!");
      } else {
        // Blackjack pays 3:2 on the original wager amount
        const winnings = Math.floor(wager * 1.5);
        setChips((c) => c + wager + winnings);
        setMessage(`Blackjack! You win ${winnings + wager} chips!`);
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowPopup(true);
      setGameStarted(false);
    } else {
      setAwaitingPlayerInput(true);
    }
  }
  
  async function playerHit() {
    if (handValue(player) >= 21) return;

    setAwaitingPlayerInput(false);

    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newPlayerHand = [...player, newCard];

    setDeck(newDeck);
    setPlayer(newPlayerHand);

    const total = handValue(newPlayerHand);

    if (total === 21) {
      await playerStand(bet, newPlayerHand);
    } else if (total > 21) {
      setDealerRevealed(true);
      setMessage("Player busts! You lose your bet.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowPopup(true);
      setGameStarted(false);
    } else {
      setAwaitingPlayerInput(true);
    }
  }

  async function playerStand(wager = bet, hand = player) {
    setAwaitingPlayerInput(false);

    let newDeck = [...deck];
    let dealerHand = [...dealer];

    setDealerRevealed(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    while (handValue(dealerHand) < 17 && newDeck.length > 0) {
      const newCard = newDeck.pop();
      dealerHand.push(newCard);
      setDealer([...dealerHand]);
          setDealer([...dealerHand]);
      setDeck([...newDeck]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const playerTotal = handValue(hand);
    const dealerTotal = handValue(dealerHand);

    let resultMessage;
    if (dealerTotal > 21) {
      // player wins: return wager + winnings equal to wager
      setChips((c) => c + wager * 2);
      resultMessage = `Dealer busts! You win ${wager * 2} chips!`;
    }
    else if (playerTotal > 21){
      resultMessage = `Player busts! You lose your bet of ${wager} chips.`;
    }
    else if (playerTotal > dealerTotal) {
      setChips((c) => c + wager * 2);
      resultMessage = `You win ${wager * 2} chips!`;
    }
    else if (playerTotal < dealerTotal) resultMessage = `Dealer wins! You lose your bet of ${wager} chips.`;
    else{
      setChips( c=> c + wager );
      resultMessage = "Push, bet returned!";
    } 

    setDealer([...dealerHand]);
    setDeck([...newDeck]);
    setMessage(resultMessage);

    

    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowPopup(true);
    setGameStarted(false);
  }

  async function playerDouble() {
    if (!gameStarted || !canDouble(player)) return;
    if (chips < bet) {
      setMessage("Not enough chips to double down!");
      return;
    }

    let newDeck = [...deck];
    const newCard = newDeck.pop();
    const newPlayerHand = [...player, newCard];

    // deduct the additional wager immediately
    setChips((c) => c - bet);
    setDeck([...newDeck]);
    setPlayer([...newPlayerHand]);
    setDealerRevealed(true);
    setDoubled(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const doubleWager = bet * 2;


    if (handValue(newPlayerHand) > 21) {
      setMessage("Player busts after doubling! Dealer wins!");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setShowPopup(true);
      setGameStarted(false);
      return;
    }

    await playerStand(doubleWager, newPlayerHand);
  }

  async function playerSurrender() {
    if (!gameStarted || splitActive) return;
    // give back half the original wager
    const half = Math.floor(bet / 2);
    setChips((c) => c + half);
    setMessage(`Player surrendered. Returned ${half} chips.`);
    await new Promise((res) => setTimeout(res, 800));
    setShowPopup(true);
    setGameStarted(false);
    
  }

  async function playerSplit() {
    if (player.length !== 2 || player[0].rank !== player[1].rank) return;
    if (chips < bet) {
      setMessage("Not enough chips to split!");
      return;
    }

    setAwaitingPlayerInput(false);
    // deduct the additional wager for the second hand
    setChips((c) => c - bet);

    const newDeck = [...deck];
    const firstHand = [player[0], newDeck.pop()];
    const secondHand = [player[1], newDeck.pop()];

    setSplitActive(true);
    setDeck(newDeck);
    setPlayerHands([firstHand, secondHand]);
    setHandBets([bet, bet]);
    setHandDoubled([false, false]);
    setActiveHandIndex(0);
    setPlayer([]);
    setMessage("Playing Hand 1...");
    setAwaitingPlayerInput(true);

  }

  async function playerHitSplit(index) {
    setAwaitingPlayerInput(false);

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
      nextSplitHand(index, newHands, newDeck, handBets);
    } else if (handTotal === 21) {
      setMessage(`Hand ${index + 1} hits 21!`);
      await new Promise(res => setTimeout(res, 800));
      nextSplitHand(index, newHands, newDeck, handBets);
    } else {
      setAwaitingPlayerInput(true); // still this hand's turn
    }
  }


  async function playerStandSplit(index) {
    setAwaitingPlayerInput(false);
    setMessage(`Hand ${index + 1} stands.`);
    await new Promise(res => setTimeout(res, 400));
    nextSplitHand(index, playerHands, deck, handBets);
  }


  async function playerDoubleSplit(index) {
    if (!canDouble(playerHands[index])) return;
    if (chips < handBets[index]) {
      setMessage("Not enough chips to double down!");
      return;
    }

    setAwaitingPlayerInput(false);

    const additionalWager = handBets[index];
    setChips(c => c - additionalWager);

    const newHandBets = [...handBets];
    newHandBets[index] = handBets[index] * 2;
    setHandBets(newHandBets);

    const newHandDoubled = [...handDoubled];
    newHandDoubled[index] = true;
    setHandDoubled(newHandDoubled);

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
    nextSplitHand(index, newHands, newDeck, handBets);
  }


  async function nextSplitHand(index, hands, currentDeck) {
    if (index + 1 < hands.length) {
      setMessage(`Hand ${index + 1} done! Moving to Hand ${index + 2}...`);
      await new Promise(res => setTimeout(res, 400));
      setActiveHandIndex(index + 1);
      setAwaitingPlayerInput(true);
      setMessage(`Playing Hand ${index + 2}...`);
    } else {
      setMessage("Dealer's turn...");
      await new Promise(res => setTimeout(res, 400));
      dealerPlayAfterSplit(hands, currentDeck);
    }
  }

  async function dealerPlayAfterSplit(hands, currentDeck, bets = handBets) {
    let newDeck = [...currentDeck];
    let dealerHand = [...dealer];

    setDealerRevealed(true);

    while (handValue(dealerHand) < 17) {
      await new Promise(res => setTimeout(res, 600));
      dealerHand.push(newDeck.pop());
      setDealer([...dealerHand]);
    }

    setDeck(newDeck);
    let totalReturned = 0;
    const results = hands.map((hand, i) => {
      const playerTotal = handValue(hand);
      const dealerTotal = handValue(dealerHand);
      const wager = bets[i];

      if (playerTotal > 21) return `Hand ${i + 1}: Bust`;
      if (dealerTotal > 21 || playerTotal > dealerTotal){
        totalReturned += wager * 2;
        return `Hand ${i + 1}: Win (+${wager * 2})`;
      } 
      if (playerTotal < dealerTotal) {
        return `Hand ${i + 1}: Dealer wins`;
      }
      totalReturned += wager;
      return `Hand ${i + 1}: Push`;
    });

    // add chips returned for split hands
    if (totalReturned > 0) setChips((c) => c + totalReturned);

    setMessage(results.join(" | "));
    await new Promise(res => setTimeout(res, 1000));
    setShowPopup(true);
    setGameStarted(false);
  }

  function playAgain() {
    setShowPopup(false);
    setGameStarted(false);
    setAwaitingPlayerInput(false);
    setPlayer([]);
    setDealer([]);
    setPlayerHands([]);
    setHandBets([]);
    setDoubled(false);
    setHandDoubled([]);
    setActiveHandIndex(0);
    setSplitActive(false);
    setDealerRevealed(false);
    setMessage("");
  }
  function repeatBet() {
    if (bet <= 0 || bet > chips) {
      setMessage("Cannot repeat bet: invalid amount or insufficient chips.");
      return;
    }
    setShowPopup(false);
    setPlayer([]);
    setDealer([]);
    setPlayerHands([]);
    setHandBets([]);
    setDoubled(false);
    setHandDoubled([]);
    setActiveHandIndex(0);
    setSplitActive(false);
    setDealerRevealed(false);
    setMessage("");
    placeBet(bet);
  }

  return {
    // round state
    player,
    dealer,
    message,
    dealerRevealed,
    gameStarted,
    awaitingPlayerInput,
    showPopup,
    playerHands,
    activeHandIndex,
    splitActive,
    // betting state
    chips,
    bet,
    handBets,
    doubled,
    handDoubled,
    // actions
    placeBet,
    playerHit,
    playerStand,
    playerDouble,
    playerSplit,
    playerHitSplit,
    playerStandSplit,
    playerDoubleSplit,
    playerSurrender,
    playAgain,
    repeatBet,
  };
}
