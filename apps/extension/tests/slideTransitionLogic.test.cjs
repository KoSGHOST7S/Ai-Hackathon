const assert = require("node:assert/strict");

const {
  getSlideTransitionLayers,
} = require("../src/lib/slideTransitionLogic.ts");

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test("forward transition uses from as base and to as moving layer", () => {
  const result = getSlideTransitionLayers("list", "detail", "forward");
  assert.deepEqual(result, {
    baseKey: "list",
    movingKey: "detail",
    movingClassName: "assignmint-slide-in-right",
  });
});

test("back transition uses to as base and from as moving layer", () => {
  const result = getSlideTransitionLayers("detail", "list", "back");
  assert.deepEqual(result, {
    baseKey: "list",
    movingKey: "detail",
    movingClassName: "assignmint-slide-out-right",
  });
});
