import { test } from "node:test";
import assert from "node:assert/strict";
import { acquisitionOf, formatGBP, valueLine } from "./economics";

test("Personal relation reads as bought-it-himself (own money)", () => {
  const a = acquisitionOf("Personal — private collection");
  assert.equal(a.stance, "own-money");
  assert.equal(a.label, "Bought it himself");
});

test("Sponsored and Ambassador both read as paid placements", () => {
  assert.equal(acquisitionOf("Sponsored — UAE Team Emirates").stance, "paid");
  assert.equal(acquisitionOf("Ambassador — Rolex testimonee since 2011").stance, "paid");
  assert.equal(acquisitionOf("Sponsored — UAE Team Emirates").label, "Paid to wear it");
});

test("Team-issued is paid but labelled distinctly", () => {
  const a = acquisitionOf("Team-issued");
  assert.equal(a.stance, "paid");
  assert.equal(a.label, "Team-issued");
});

test("Gifted and Loan keep their own stances", () => {
  assert.equal(acquisitionOf("Gifted").stance, "gifted");
  assert.equal(acquisitionOf("Loan — for the final").stance, "loan");
});

test("an unrecognised relation falls back to unverified", () => {
  assert.equal(acquisitionOf("Reportedly affiliated").stance, "unverified");
});

test("formatGBP renders rounded sterling with separators", () => {
  assert.equal(formatGBP(150000), "£150,000");
  assert.equal(formatGBP(15000.7), "£15,001");
});

test("valueLine prefixes a tilde, or is null when no value set", () => {
  assert.equal(
    valueLine({
      athlete: "X",
      watch: "Y",
      relation: "Sponsored",
      evidence: "Z",
      confidence: "High",
      value: { gbpApprox: 150000 },
    }),
    "~£150,000"
  );
  assert.equal(
    valueLine({
      athlete: "X",
      watch: "Y",
      relation: "Sponsored",
      evidence: "Z",
      confidence: "High",
    }),
    null
  );
});
