import { test } from "node:test";
import assert from "node:assert/strict";
import { checkReference } from "./references";

test("brand aliases match whole words only — 'RM' must not hide in 'unconfirmed'", () => {
  // Regression: the sign-off audit found "unconfirmed" substring-matching the
  // Richard Mille "RM" alias and mis-attributing the brand.
  const r = checkReference("unconfirmed");
  assert.notEqual(r.reason.includes("Richard Mille"), true);
});

test("'AP' must not hide in 'strap'", () => {
  const r = checkReference("watch on a leather strap");
  assert.notEqual(r.reason.includes("Audemars Piguet"), true);
});

test("real alias hits still work", () => {
  const rm = checkReference("Richard Mille RM 67-02", "RM 67-02");
  assert.equal(rm.ok, true);
  const alias = checkReference("RM on the wrist", "RM 67-02");
  assert.equal(alias.ok, true);
});

test("grammar accepts both real RM forms and rejects junk", () => {
  // RM 011 (Felipe Massa line) is a genuine three-digit reference.
  assert.equal(checkReference("Richard Mille", "RM 011").ok, true);
  assert.equal(checkReference("Richard Mille", "RM 67-02").ok, true);
  assert.equal(checkReference("Richard Mille", "RM 6702X").ok, false);
});
