export function buildDeck(){
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    const deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({suit, rank});
        }
    }

    return deck;
}

export function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

export function handValue(cards){
    let total = 0;
    let aces = 0;

    for(const card of cards){
        if(card.rank === 'Ace'){
            aces += 1;
            total += 11;
        } else if(['King', 'Queen', 'Jack'].includes(card.rank)){
            total += 10;
        } else {
            total += parseInt(card.rank);
        }
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }

    return total;
}

    