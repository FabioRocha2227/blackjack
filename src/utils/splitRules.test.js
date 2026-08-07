// Plain-node test runner — no framework needed.
// Run with: node src/utils/splitRules.test.js
import { canSplitHand } from "./splitRules.js";

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

console.log("canSplitHand()");
test("same rank can split", canSplitHand([card("7"), card("7")]), true);
test("jack and queen can split", canSplitHand([card("Jack"), card("Queen")]), true);
test("king and 10 can split", canSplitHand([card("King"), card("10")]), true);
test("queen and 9 cannot split", canSplitHand([card("Queen"), card("9")]), false);
test("ace and king cannot split", canSplitHand([card("Ace"), card("King")]), false);
test("single card cannot split", canSplitHand([card("10")]), false);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);