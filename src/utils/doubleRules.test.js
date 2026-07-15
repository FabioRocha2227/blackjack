// Plain-node test runner — no framework needed.
// Run with: node src/utils/doubleRules.test.js
import { isSoftHand, canDouble } from "./doubleRules.js";

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

console.log("isSoftHand()");
test("Ace + 6 is soft", isSoftHand([card("Ace"), card("6")]), true);
test("Ace + King is soft (soft 21 / blackjack)", isSoftHand([card("Ace"), card("King")]), true);
test("Ace + Ace is NOT soft (treated as hard 12)", isSoftHand([card("Ace"), card("Ace")]), false);
test("10 + 7 (no ace) is not soft", isSoftHand([card("10"), card("7")]), false);
test("3-card hand is never soft (double window closed)", isSoftHand([card("Ace"), card("2"), card("3")]), false);
test("empty hand is not soft", isSoftHand([]), false);

console.log("\ncanDouble()");
// Hard totals in the 9-11 window
test("hard 9 (5+4) can double", canDouble([card("5"), card("4")]), true);
test("hard 10 (6+4) can double", canDouble([card("6"), card("4")]), true);
test("hard 11 (6+5) can double", canDouble([card("6"), card("5")]), true);

// Hard totals outside the window
test("hard 8 (5+3) cannot double", canDouble([card("5"), card("3")]), false);
test("hard 12 (10+2) cannot double", canDouble([card("10"), card("2")]), false);
test("hard 20 (King+Queen) cannot double", canDouble([card("King"), card("Queen")]), false);

// Soft hands (any soft total should be allowed regardless of the 9-11 rule)
test("soft 13 (Ace+2) can double", canDouble([card("Ace"), card("2")]), true);
test("soft 18 (Ace+7) can double", canDouble([card("Ace"), card("7")]), true);
test("soft 20 (Ace+9) can double", canDouble([card("Ace"), card("9")]), true);

// Pair of Aces: hard 12, not soft — should NOT qualify under the 9-11/soft rule
test("Ace + Ace (hard 12) cannot double", canDouble([card("Ace"), card("Ace")]), false);

// Card-count restriction: double only allowed on exactly 2 cards
test("3-card 11 (5+3+3) cannot double (already hit)", canDouble([card("5"), card("3"), card("3")]), false);
test("empty hand cannot double", canDouble([]), false);
test("single card cannot double", canDouble([card("10")]), false);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
