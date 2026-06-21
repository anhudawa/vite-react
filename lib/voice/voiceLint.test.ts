import { test } from "node:test";
import assert from "node:assert/strict";
import { lintVoice, hasErrors } from "./voiceLint";

// Calibrated examples from content/voice/VOICE.md (placeholders, no real facts).
const GOOD_BLOG =
  "When [Athlete] crossed the line in [Event], the watch on his wrist had already been there for every dark morning that made the win possible. It wasn't a trophy bought afterwards. It was the [Brand Model], picked up years earlier for reasons he can still describe exactly — and worn through the whole long climb toward that day.";

const GOOD_PODCAST =
  "I'm not here as the watch expert. I'm here as the guy who got obsessed somewhere along the way and wants to know the story. Today I'm sitting down with [Athlete] — and we're talking about one watch. The one that was on his wrist when everything he'd worked for came down to a single day.";

const BAD =
  "Here's what nobody tells you about luxury watches. It isn't about the movement. It's about the moment. Let me break this down.";

test("BAD example is caught (banned openers, with errors)", () => {
  const findings = lintVoice(BAD);
  assert.ok(findings.length >= 2, "expected multiple findings");
  assert.ok(hasErrors(findings), "expected at least one error-severity finding");
  const openers = findings.filter((f) => f.rule === "banned-opener");
  const terms = openers.map((f) => f.term.toLowerCase());
  assert.ok(
    terms.some((t) => t.includes("here")),
    "expected the 'Here's what nobody tells you' opener flagged",
  );
  assert.ok(
    terms.some((t) => t.includes("break")),
    "expected the 'let me break this down' phrase flagged",
  );
});

test("GOOD blog example passes clean", () => {
  assert.deepEqual(lintVoice(GOOD_BLOG), []);
});

test("GOOD podcast example passes clean", () => {
  assert.deepEqual(lintVoice(GOOD_PODCAST), []);
});

test("banned words are flagged with location", () => {
  const f = lintVoice("We delve into the robust history of the piece.");
  const terms = f.map((x) => x.term.toLowerCase());
  assert.ok(terms.includes("delve"));
  assert.ok(terms.includes("robust"));
  assert.ok(f.every((x) => x.line >= 1 && x.column >= 1));
});

test("a single 'It isn't X. It's Y.' is allowed; two are flagged", () => {
  const one = lintVoice("It wasn't a trophy. It was the [Brand Model].");
  assert.equal(one.filter((x) => x.rule === "antithesis-repetition").length, 0);

  const two = lintVoice("It isn't the steel. It's the story. It wasn't the price. It was the day.");
  assert.ok(two.filter((x) => x.rule === "antithesis-repetition").length >= 2);
});

test("em-dash overuse is flagged; a single em-dash is not", () => {
  const heavy = lintVoice("The watch — the one — that he wore — every day — mattered.");
  assert.ok(heavy.some((x) => x.rule.startsWith("em-dash")));

  const light = lintVoice(
    "He wore it — every single day of that long hard season, and never once thought to take it off.",
  );
  assert.equal(light.filter((x) => x.rule.startsWith("em-dash")).length, 0);
});

test("the 'the [X] won't tell you' opener is caught", () => {
  const f = lintVoice("The brand won't tell you which one he actually bought.");
  assert.ok(f.some((x) => x.rule === "banned-opener"));
});

test("findings never rewrite — input is returned untouched conceptually (pure read)", () => {
  const input = "We delve into it.";
  const copy = String(input);
  lintVoice(input);
  assert.equal(input, copy);
});
