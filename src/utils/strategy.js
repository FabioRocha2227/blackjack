import {handValue} from './deck.js';

const RANK_VALUE = {
    Ace : 11,
    King : 10,
    Queen : 10,
    Jack : 10,
    "10" : 10,
    "9" : 9,
    "8" : 8,
    "7" : 7,
    "6" : 6,
    "5" : 5,
    "4" : 4,
    "3" : 3,
    "2" : 2
};

const DEALER_COLUMNS = [2,3,4,5,6,7,8,9,10,11];

function dealerColumnIndex(dealerUpCard) {
    const value = RANK_VALUE[dealerUpCard.rank];
    return DEALER_COLUMNS.indexOf(value);
}

function isPair(hand){
    if(hand.length === 2 && hand[0].rank == hand[1].rank){
        return true;
    }
    return false;
}

// hand is soft, hast at least one Ace counted as 11
function isSoft(hand){
    const hasAce = hand.some( card => card.rank === 'Ace');
    if(!hasAce) return false;
    let lowTotal = 0;
    for(const card of hand){
        if(card.rank == 'Ace'){
            lowTotal += 1;
        }
        else if(['King', 'Queen', 'Jack'].includes(card.rank)){
            lowTotal +=10;
        }
        else{
            lowTotal += parseInt(card.rank);
        }
    }
    return lowTotal + 10 <= 21;
}

const HARD_TABLE = {
    9 : ["H","Dh","Dh","Dh","Dh","H","H","H","H","H"],
    10 : ["Dh","Dh","Dh","Dh","Dh","Dh","Dh","Dh","H","H"],
    11 : ["Dh","Dh","Dh","Dh","Dh","Dh","Dh","Dh","Dh","Dh"],
    12 : ["H","H","S","S","S","H","H","H","H","H"],
    13 : ["S","S","S","S","S","H","H","H","H","H"],
    14 : ["S","S","S","S","S","H","H","H","H","H"],
    15 : ["S","S","S","S","S","H","H","H","H","H"],
    16 : ["S","S","S","S","S","H","H","H","H","H"],
};

const SOFT_TABLE = {
    13 : ["H","H","H","Dh","Dh","H","H","H","H","H"],
    14 : ["H","H","H","Dh","Dh","H","H","H","H","H"],
    15 : ["H","H","Dh","Dh","Dh","H","H","H","H","H"],
    16 : ["H","H","Dh","Dh","Dh","H","H","H","H","H"],
    17 : ["H","Dh","Dh","Dh","Dh","H","H","H","H","H"],
    18 : ["S","Ds","Ds","Ds","Ds","S","S","H","H","H"],
};

const PAIR_TABLE = {
    Ace : ["P","P","P","P","P","P","P","P","P","P"],
    "9" : ["P","P","P","P","P","S","P","P","S","S"],
    "8" : ["P","P","P","P","P","P","P","P","P","P"],
    "7" : ["P","P","P","P","P","P","H","H","H","H"],
    "6" : ["P","P","P","P","P","H","H","H","H","H"],
    "4" : ["H","H","H","P","P","H","H","H","H","H"],
    "3" : ["P","P","P","P","P","P","H","H","H","H"],
    "2" : ["P","P","P","P","P","P","H","H","H","H"],
};

function resolveCode(code, canDouble){
    if (code ==="Dh") return canDouble ? "D" : "H";
    if (code ==="Ds") return canDouble ? "D" : "S";
    return code;
}

export function getBasicStrategyAction(hand, dealerUpCard, { canSplit = true, canDoubleNow = true } = {}) {
    if(!hand || hand.length < 2 || !dealerUpCard) return null;

    const col = dealerColumnIndex(dealerUpCard);
    if(col === -1 ) return null;

    if(hand.length === 2 && canSplit && isPair(hand)) {
        const row = PAIR_TABLE[hand[0].rank];
        if(row) {
            const code = row[col];
            if(code === "P") return "P";
            return resolveCode(code, canDoubleNow);
        }
    }

    if(isSoft(hand)){
        const total = handValue(hand);
        const row = SOFT_TABLE[total];
        if(row) {
            return resolveCode(row[col], canDoubleNow);
        }
        return total >= 19 ? "S" : "H";
    }

    const total = handValue(hand);
    if(total >= 17) return "S";
    if(total <= 8) return "H";

    const row = HARD_TABLE[total];
    return row ? resolveCode(row[col], canDoubleNow) : "H";
}

export const ACTION_LABELS = {
    "H" : "Hit",
    "S" : "Stand",
    "D" : "Double",
    "P" : "Split"
};