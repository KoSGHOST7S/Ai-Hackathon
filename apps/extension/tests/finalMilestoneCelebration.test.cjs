const assert = require("node:assert/strict");

const {
  shouldCelebrateFinalMilestone,
} = require("../src/lib/finalMilestoneCelebration.ts");

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test("fires when transitioning from partial completion to full completion", () => {
  const result = shouldCelebrateFinalMilestone({
    prevDone: 2,
    prevTotal: 4,
    nextDone: 4,
    nextTotal: 4,
  });
  assert.equal(result, true);
});

test("does not fire when remaining fully complete", () => {
  const result = shouldCelebrateFinalMilestone({
    prevDone: 4,
    prevTotal: 4,
    nextDone: 4,
    nextTotal: 4,
  });
  assert.equal(result, false);
});

test("does not fire when becoming less complete", () => {
  const result = shouldCelebrateFinalMilestone({
    prevDone: 4,
    prevTotal: 4,
    nextDone: 3,
    nextTotal: 4,
  });
  assert.equal(result, false);
});

test("does not fire when there are no milestones", () => {
  const result = shouldCelebrateFinalMilestone({
    prevDone: 0,
    prevTotal: 0,
    nextDone: 0,
    nextTotal: 0,
  });
  assert.equal(result, false);
});
