// Plain-node test runner — no framework needed.
// Run with: node src/utils/payouts.test.js
import { blackjackReturn, winReturn, pushReturn, splitResults, surrenderReturn } from "./payouts.js";

const card = (rank, suit = "Spades") => ({ rank, suit });

let passed = 0;
let failed = 0;

function test(name, actual, expected) {
  const ok = actual === expected;
  if (ok) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}  (expected ${expected}, got ${actual})`);
  }
}

console.log("blackjackReturn()");
test("10 -> 25 (3:2)", blackjackReturn(10), 25);
test("11 -> 27 (floor(11*1.5)=16)", blackjackReturn(11), 27);

console.log("\nwinReturn()");
test("10 -> 20", winReturn(10), 20);

console.log("\npushReturn()");
test("10 -> 10", pushReturn(10), 10);

console.log("\nsplitResults()");
// Case: dealer busts
const dealerBust = [card("King"), card("King"), card("2")]; // 22
const hands1 = [[card("10"), card("9")]]; // 19
const bets1 = [10];
const res1 = splitResults(hands1, dealerBust, bets1);
test("dealer bust -> return 20", res1.totalReturned, 20);
test("result text matches", res1.results[0], "Hand 1: Win (+20)");

// Case: dealer 18, player 19 -> win; player 17 -> dealer wins; player 18 -> push
const dealer18 = [card("10"), card("8")];
const hands2 = [[card("10"), card("9")], [card("10"), card("7")], [card("10"), card("8")]];
const bets2 = [10, 5, 2];
const res2 = splitResults(hands2, dealer18, bets2);
// expected: hand1 win -> +20, hand2 lose -> 0, hand3 push -> +2
test("mixed split returns total", res2.totalReturned, 22);
test("hand messages", res2.results.join(" | "), "Hand 1: Win (+20) | Hand 2: Dealer wins | Hand 3: Push");

console.log("\nsurrenderReturn()");
test("surrender 11 -> 5 (floor)", surrenderReturn(11), 5);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
