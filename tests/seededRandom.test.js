import assert from "node:assert/strict";
import test from "node:test";

import { createSeededRng } from "../src/utils/seededRandom.js";

test("createSeededRng preserves the known sequence for a seed", () => {
  const random = createSeededRng(123456789);

  assert.deepEqual(
    Array.from({ length: 5 }, () => random()),
    [
      0.2577907438389957,
      0.9707721115555614,
      0.7853280142880976,
      0.20616457983851433,
      0.30307188746519387,
    ],
  );
});

test("createSeededRng normalizes seeds to unsigned 32-bit values", () => {
  const fromNegative = createSeededRng(-1);
  const fromUnsigned = createSeededRng(0xffffffff);

  assert.deepEqual(
    Array.from({ length: 5 }, () => fromNegative()),
    Array.from({ length: 5 }, () => fromUnsigned()),
  );
});

test("createSeededRng returns values in the half-open unit interval", () => {
  const random = createSeededRng(0);

  for (let index = 0; index < 1000; index++) {
    const value = random();
    assert.ok(value >= 0);
    assert.ok(value < 1);
  }
});
