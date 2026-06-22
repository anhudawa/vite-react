import { test } from "node:test";
import assert from "node:assert/strict";
import { lintVoice, hasErrors } from "./voiceLint";

// Calibrated examples from content/voice/VOICE.md (the new TLS voice).
const GOOD_FEATURE =
  "There is a moment in every long effort when the watch stops being information. You've looked at it too often; the numbers have stopped meaning anything your body can act on. And still the seconds hand sweeps — unhurried, built for exactly this, indifferent to all of it. Under the crystal a balance wheel is keeping its 28,800 beats an hour whether you finish or not. You are an oscillator too, tuned by years of training, and tonight you are running slow.";

const GOOD_GUIDE =
  "An ultra is a long argument with your own pacing, and the watch on your wrist is the only party to it that won't lie. These are the seven we'd trust to tell the truth at hour eleven, judged on the things that actually decide it once the field has thinned: battery that outlasts the night, a screen you can still read when your hands have stopped working, and a GPS track you'd stake a result on.";

const GOOD_REVIEW =
  "It isn't a watch you'll fall for across a room. It's one you come to trust over a winter of dark commutes, which is the more lasting kind of affection.";

// Slop examples from the "Slop vs TLS" section — these must be caught.
const SLOP_PRODUCT =
  "The Black Bay 58 is a game-changer that elevates any collection and unlocks new versatility on your watch journey.";
const SLOP_CATEGORY =
  "Join us as we delve into the world of dive watches and elevate your collection to the next level.";

const BAD_OPENER =
  "Here's what nobody tells you about luxury watches. It isn't about the movement. It's about the moment. Let me break this down.";

test("TLS feature/guide/review examples pass clean", () => {
  assert.deepEqual(lintVoice(GOOD_FEATURE), []);
  assert.deepEqual(lintVoice(GOOD_GUIDE), []);
  assert.deepEqual(lintVoice(GOOD_REVIEW), []);
});

test("a single 'It isn't X. It's Y.' (the review line) is allowed", () => {
  assert.equal(lintVoice(GOOD_REVIEW).filter((f) => f.rule === "antithesis-repetition").length, 0);
});

test("SLOP product line is caught on banned words", () => {
  const findings = lintVoice(SLOP_PRODUCT);
  assert.ok(hasErrors(findings));
  const words = findings.filter((f) => f.rule === "banned-word").map((f) => f.term.toLowerCase());
  assert.ok(words.some((w) => w.includes("game")), "game-changer");
  assert.ok(words.some((w) => w.includes("elevat")), "elevates");
  assert.ok(words.some((w) => w.includes("journey")), "journey");
});

test("SLOP category line is caught on banned words", () => {
  const findings = lintVoice(SLOP_CATEGORY);
  const words = findings.filter((f) => f.rule === "banned-word").map((f) => f.term.toLowerCase());
  assert.ok(words.some((w) => w.startsWith("delve")));
  assert.ok(words.some((w) => w.includes("elevat")));
});

test("BAD opener example is caught (banned openers, with errors)", () => {
  const findings = lintVoice(BAD_OPENER);
  assert.ok(hasErrors(findings));
  const openers = findings.filter((f) => f.rule === "banned-opener").map((f) => f.term.toLowerCase());
  assert.ok(openers.some((t) => t.includes("here")), "'Here's what nobody tells you'");
  assert.ok(openers.some((t) => t.includes("break")), "'let me break this down'");
});

test("banned words are flagged with location", () => {
  const f = lintVoice("We delve into the robust history of the piece.");
  const terms = f.map((x) => x.term.toLowerCase());
  assert.ok(terms.includes("delve"));
  assert.ok(terms.includes("robust"));
  assert.ok(f.every((x) => x.line >= 1 && x.column >= 1));
});

test("two 'It isn't X. It's Y.' constructions are flagged as a loop", () => {
  const two = lintVoice("It isn't the steel. It's the story. It wasn't the price. It was the day.");
  assert.ok(two.filter((x) => x.rule === "antithesis-repetition").length >= 2);
});

test("em-dash leaning is flagged; a single matched pair is not", () => {
  const heavy = lintVoice("The watch — the one — that he wore — every day — mattered.");
  assert.ok(heavy.some((x) => x.rule.startsWith("em-dash")));

  const aside = lintVoice(
    "He wore it through the night section — the part that actually decides an ultra — without once looking down.",
  );
  assert.equal(aside.filter((x) => x.rule.startsWith("em-dash")).length, 0);
});

test("the 'the [x] internet won't tell you' opener is caught", () => {
  const f = lintVoice("The watch internet won't tell you which one he actually bought.");
  assert.ok(f.some((x) => x.rule === "banned-opener"));
});

test("dismissive doubled negation 'Not a X, not a Y' is caught as an error", () => {
  const f = lintVoice("Not a shop, not a sermon. These guides are about how a watch is made.");
  assert.ok(hasErrors(f));
  assert.ok(f.some((x) => x.rule === "negation-opener"));
});

test("a resolved negation 'Not X, not Y, but Z' is allowed", () => {
  const resolved = lintVoice(
    "Not the watch as jewellery, not the watch as a sponsor's logo, but the watch as the final judge.",
  );
  assert.equal(resolved.filter((x) => x.rule === "negation-opener").length, 0);
});

test("a single 'X, not Y' contrast is not a doubled-negation tell", () => {
  const single = lintVoice("Worn to win Paris-Roubaix, not to dinner.");
  assert.equal(single.filter((x) => x.rule === "negation-opener").length, 0);
});

test("gendered generic 'Men buy watches for the money' is caught", () => {
  const f = lintVoice("Men buy watches for the movement, the money, or the statement.");
  assert.ok(hasErrors(f));
  assert.ok(f.some((x) => x.rule === "gendered-generic"));
});

test("a singular 'a man who…' about a specific person is allowed", () => {
  const f = lintVoice("This is the watch of a man who lived outdoors and against a clock.");
  assert.equal(f.filter((x) => x.rule === "gendered-generic").length, 0);
});

test("both-sidesing 'no reason here is purer than another' is caught", () => {
  const f = lintVoice("Buy for the movement or the look; no reason here is purer than another.");
  assert.ok(hasErrors(f));
  assert.ok(f.some((x) => x.rule === "both-sidesing"));
});

test("a factual comparison 'better time than another' is not both-sidesing", () => {
  const f = lintVoice("The hairspring is most of why one movement keeps better time than another.");
  assert.equal(f.filter((x) => x.rule === "both-sidesing").length, 0);
});

test("findings never rewrite — input is left untouched", () => {
  const input = "We delve into it.";
  const copy = String(input);
  lintVoice(input);
  assert.equal(input, copy);
});
