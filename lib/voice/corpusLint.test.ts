import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countAcrossCorpus,
  hasCeilingBreaches,
  PHRASES,
  type CorpusPhrase,
} from "./corpusLint";

// A small test lexicon so ceilings stay stable regardless of grandfathering
// in the live PHRASES config.
const TEST_PHRASES: CorpusPhrase[] = [
  { term: "the receipt", re: /\bthe receipts?\b/gi, maxUses: 3 },
  { term: "you are an oscillator", re: /\byou are an oscillator\b/gi, maxUses: 1 },
];

test("under-ceiling usage passes clean", () => {
  const findings = countAcrossCorpus(
    [
      { label: "essays/a.mdx", text: "The watch is the receipt for the day." },
      { label: "essays/b.mdx", text: "He kept the receipt in a drawer for thirty years." },
    ],
    TEST_PHRASES,
  );
  assert.equal(hasCeilingBreaches(findings), false);
  const receipt = findings.find((f) => f.term === "the receipt");
  assert.ok(receipt);
  assert.equal(receipt.count, 2);
  assert.equal(receipt.maxUses, 3);
  assert.deepEqual(receipt.locations, ["essays/a.mdx", "essays/b.mdx"]);
});

test("over-ceiling usage is flagged with correct count and locations", () => {
  const findings = countAcrossCorpus(
    [
      { label: "essays/a.mdx", text: "You are an oscillator, tuned by years of training." },
      { label: "essays/b.mdx", text: "And you are an oscillator too, running slow tonight." },
    ],
    TEST_PHRASES,
  );
  assert.equal(hasCeilingBreaches(findings), true);
  const osc = findings.find((f) => f.term === "you are an oscillator");
  assert.ok(osc);
  assert.equal(osc.count, 2);
  assert.equal(osc.maxUses, 1);
  assert.ok(osc.count > osc.maxUses);
  assert.deepEqual(osc.locations, ["essays/a.mdx", "essays/b.mdx"]);
});

test("multiple hits in one unit count each hit but list the label once", () => {
  const findings = countAcrossCorpus(
    [
      {
        label: "essays/a.mdx",
        text: "The receipt on the wrist. The receipt in the drawer. The receipt he never framed. The receipt again.",
      },
    ],
    TEST_PHRASES,
  );
  const receipt = findings.find((f) => f.term === "the receipt");
  assert.ok(receipt);
  assert.equal(receipt.count, 4);
  assert.deepEqual(receipt.locations, ["essays/a.mdx"]);
  assert.equal(hasCeilingBreaches(findings), true);
});

test("a phrase that never appears reports zero with no locations", () => {
  const findings = countAcrossCorpus(
    [{ label: "essays/a.mdx", text: "A balance wheel keeps its beats whether you finish or not." }],
    TEST_PHRASES,
  );
  for (const f of findings) {
    assert.equal(f.count, 0);
    assert.deepEqual(f.locations, []);
  }
  assert.equal(hasCeilingBreaches(findings), false);
});

test("the seeded PHRASES config is well-formed (global regexes, positive ceilings)", () => {
  assert.ok(PHRASES.length >= 7);
  for (const p of PHRASES) {
    assert.ok(p.re.global, `“${p.term}” regex must be global`);
    assert.ok(p.maxUses >= 1, `“${p.term}” needs a positive ceiling`);
  }
});

test("counting never rewrites — input is left untouched", () => {
  const input = "The receipt sat in the drawer.";
  const copy = String(input);
  countAcrossCorpus([{ label: "x", text: input }], TEST_PHRASES);
  assert.equal(input, copy);
});
