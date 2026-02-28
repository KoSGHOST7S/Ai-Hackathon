const assert = require("node:assert/strict");

const {
  shouldShowAnalyzeCta,
} = require("../src/lib/analysisViewState.ts");

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test("does not show analyze CTA before initial load check completes", () => {
  assert.equal(shouldShowAnalyzeCta("idle", false), false);
});

test("shows analyze CTA after initial load check completes in idle state", () => {
  assert.equal(shouldShowAnalyzeCta("idle", true), true);
});

test("does not show analyze CTA for non-idle states", () => {
  assert.equal(shouldShowAnalyzeCta("loading", true), false);
  assert.equal(shouldShowAnalyzeCta("done", true), false);
  assert.equal(shouldShowAnalyzeCta("error", true), false);
});
