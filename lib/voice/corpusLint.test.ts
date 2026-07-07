import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countAcrossCorpus,
  findTemplatedMeta,
  hasCeilingBreaches,
  hasTemplatedMetaFailures,
  HOUSE_SIGNOFFS,
  PHRASES,
  VERBATIM_FAIL_MIN,
  type CorpusPhrase,
  type MetaFieldKind,
  type MetaUnit,
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

// ── findTemplatedMeta ────────────────────────────────────────────────────────

const meta = (essay: string, field: MetaFieldKind, text: string): MetaUnit => ({
  essay,
  field,
  text,
});

// Pin the hard gate to its policy target (3) so these tests stay stable
// regardless of grandfathering in the live VERBATIM_FAIL_MIN config.
const TEST_META_OPTS = { verbatimFailMin: { emailHook: 3, emailOffer: 3 } };

const SIGNOFF = HOUSE_SIGNOFFS[0]; // "The occasional essay, written by a fan, no hype."

test("unique meta strings produce no findings", () => {
  const findings = findTemplatedMeta(
    [
      meta("a", "dek", "A watch and an athlete answer to the same governor."),
      meta("b", "dek", "The clock at the finish never argued with anyone."),
      meta("a", "emailHook", "The watch and the athlete, read as one thing."),
      meta("b", "emailHook", "Eight seconds, and the whole Tour inside them."),
      meta("a", "emailOffer", `The thinking behind the site, told slowly. ${SIGNOFF}`),
      meta("b", "emailOffer", `Every verified wrist on every start line. ${SIGNOFF}`),
    ],
    TEST_META_OPTS,
  );
  assert.deepEqual(findings, []);
  assert.equal(hasTemplatedMetaFailures(findings), false);
});

test("a dek shared verbatim by two essays is a warning, not a failure", () => {
  const findings = findTemplatedMeta(
    [
      meta("a", "dek", "The clock decides, and the clock does not care."),
      meta("b", "dek", "The clock decides, and the clock does not care."),
      meta("c", "dek", "A different dek entirely, about a different race."),
    ],
    TEST_META_OPTS,
  );
  assert.equal(findings.length, 1);
  const f = findings[0];
  assert.equal(f.field, "dek");
  assert.equal(f.kind, "verbatim");
  assert.equal(f.shared, "The clock decides, and the clock does not care.");
  assert.deepEqual(f.essays, ["a", "b"]);
  assert.equal(f.fails, false);
  assert.equal(hasTemplatedMetaFailures(findings), false);
});

test("verbatim emailHook/emailOffer duplication across 3+ essays trips the hard gate", () => {
  const findings = findTemplatedMeta(
    [
      meta("a", "emailHook", "The races the clock decided, in your inbox."),
      meta("b", "emailHook", "The races the clock decided, in your inbox."),
      meta("c", "emailHook", "The races the clock decided, in your inbox."),
      // Two essays sharing a hook stays a warning — the gate is 3.
      meta("d", "emailHook", "The records the clock decided, in your inbox."),
      meta("e", "emailHook", "The records the clock decided, in your inbox."),
    ],
    TEST_META_OPTS,
  );
  assert.equal(findings.length, 2);
  const gated = findings.find((f) => f.essays.length === 3);
  const warned = findings.find((f) => f.essays.length === 2);
  assert.ok(gated && warned);
  assert.equal(gated.fails, true);
  assert.deepEqual(gated.essays, ["a", "b", "c"]);
  assert.equal(warned.fails, false);
  assert.equal(hasTemplatedMetaFailures(findings), true);
});

test("whitespace-only differences still count as verbatim duplication", () => {
  const findings = findTemplatedMeta(
    [
      meta("a", "emailOffer", "One essay at a time, verified before it ships."),
      meta("b", "emailOffer", "One essay at a time,\n    verified before it ships. "),
    ],
    TEST_META_OPTS,
  );
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, "verbatim");
  assert.deepEqual(findings[0].essays, ["a", "b"]);
});

test("an opening 6-word prefix shared by 4+ essays is flagged as a mould", () => {
  const units = [
    meta("a", "dek", "Where watches and endurance genuinely meet, the timing tells."),
    meta("b", "dek", "Where watches and endurance genuinely meet, the craft shows."),
    meta("c", "dek", "Where watches and endurance genuinely meet, heritage matters most."),
    meta("d", "dek", "Where watches and endurance genuinely meet, the water wins."),
  ];
  const findings = findTemplatedMeta(units, TEST_META_OPTS);
  assert.equal(findings.length, 1);
  const f = findings[0];
  assert.equal(f.kind, "prefix");
  assert.equal(f.field, "dek");
  assert.equal(f.shared, "where watches and endurance genuinely meet,");
  assert.deepEqual(f.essays, ["a", "b", "c", "d"]);
  assert.equal(f.fails, false); // moulds warn; only verbatim email copy gates

  // Three essays sharing the opening stays under the mould threshold.
  assert.deepEqual(findTemplatedMeta(units.slice(0, 3), TEST_META_OPTS), []);
});

test("the shared house sign-off suffix is exempt — not duplication, not a mould", () => {
  // Distinct offers that all close on the house sign-off: full-string
  // comparison means no verbatim finding, and the sign-off is stripped
  // before the prefix check, so no mould either.
  const findings = findTemplatedMeta(
    [
      meta("a", "emailOffer", `The records kept far from any grandstand. ${SIGNOFF}`),
      meta("b", "emailOffer", `The machines that earned their place the hard way. ${SIGNOFF}`),
      meta("c", "emailOffer", `The endurance sport nobody televises, read closely. ${SIGNOFF}`),
      meta("d", "emailOffer", `Owning the machine well, hour four included. ${SIGNOFF}`),
    ],
    TEST_META_OPTS,
  );
  assert.deepEqual(findings, []);
});

test("a short lead cannot bleed the sign-off into its prefix", () => {
  // Leads under 6 words: without stripping, the prefix would be padded out
  // of the sign-off itself and four unrelated offers would collide.
  const findings = findTemplatedMeta(
    [
      meta("a", "emailOffer", `New wrists, verified. ${SIGNOFF}`),
      meta("b", "emailOffer", `New wrists, verified. ${SIGNOFF} ${SIGNOFF}`),
      meta("c", "emailOffer", `New wrists, verified. ${SIGNOFF} ${SIGNOFF} ${SIGNOFF}`),
      meta("d", "emailOffer", `New wrists, verified. ${SIGNOFF} ${SIGNOFF} ${SIGNOFF} ${SIGNOFF}`),
    ],
    TEST_META_OPTS,
  );
  assert.equal(findings.filter((f) => f.kind === "prefix").length, 0);
});

test("the live gate config only grandfathers email copy, and never below the policy target", () => {
  const gated = Object.keys(VERBATIM_FAIL_MIN) as MetaFieldKind[];
  assert.deepEqual(gated.sort(), ["emailHook", "emailOffer"]);
  for (const field of gated) {
    const min = VERBATIM_FAIL_MIN[field];
    assert.ok(min !== undefined && min >= 3, `${field} gate must stay at or above the policy target of 3`);
  }
});
