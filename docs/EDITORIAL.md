# The Long Second — Editorial Standard

The bar every piece on this site is held to. If a sentence doesn't clear it, it
doesn't ship. This is not a style suggestion; it is the standard.

## The one-line test

Before publishing, answer: **what is the single argument only we would make here?**
If the piece could run unchanged on any watch blog, it isn't ready. Our argument is
almost always a version of the house thesis — *bought, or paid to wear it, and what
it cost* — made concrete on one wrist.

## Ten rules

1. **Open on a moment, never a throat-clear.** No "for a few weeks every four years,"
   no "in the world of luxury watches." Start on a wrist, a price, a decision, a
   number. The first sentence earns the second.
2. **The dek and the lede must not say the same thing.** The dek sells the argument;
   the lede drops you into a scene. If they rhyme, rewrite one.
3. **Specifics carry the weight, not adjectives.** Reference numbers, prices, dates,
   scorelines, names. "An off-catalogue Day-Date, ref. 228235JG, ~$62,700" beats
   "an incredibly rare and exclusive timepiece" every time.
4. **One idea per sentence. Vary the length.** A long, built sentence, then a short
   one that lands. Rhythm is the difference between prose and a spec sheet.
5. **Every claim about money or a deal is concrete or it's cut.** Name the figure,
   name the source of the figure, and say when a number is a guess ("a guess dressed
   up as a price"). Never launder a rumour into a fact.
6. **No machinery-speak in the reader's voice.** We don't say "verified," "sourced,"
   "corroborated," "to our standard," or describe our own process. We just write
   like we know, and let the citation sit quietly underneath.
7. **End on a line that lands, not a summary.** The last sentence is the one people
   quote. Don't spend it restating the headline.
8. **Authority, dryness, no hype.** Confident, a little dry, never breathless. No
   exclamation marks. We are the person in the room who actually knows.
9. **Earn every cliché's absence.** Banned: *delve, unpack, elevate, leverage, robust,
   journey, game-changer, "where X meets Y," "the world of," "needs no introduction,"
   "it's no secret that," "when it comes to."* Enforced by `npm run qa:copy`.
10. **Cut until it bleeds, then cut one more line.** Most drafts are 20% too long. The
    World Cup piece lost a third and got better.

## Structure of a piece

- **Dek (1–2 sentences):** the argument, sharp enough to quote.
- **Lede (1 short para):** the scene/number that proves the dek is worth your time.
- **The turn:** one line that flips the obvious reading into ours ("The number isn't
  the story. This is: no one paid him to wear it.").
- **Body (2–3 short sections):** each section advances the argument with new specifics,
  not new adjectives. One pull-quote, maximum, and only if it's genuinely quotable.
- **Close:** a single landing line.

## Length and reading time

- **Nothing thin ships.** A piece that reads in under 90 seconds isn't an essay, it's a
  caption. Features and essays run **900–1,500 words** of real prose. If you can't fill
  that with specifics, the piece isn't ready — it's a section of a bigger piece.
- **Reading time is computed, never typed.** It's derived from the actual word count at
  ~230 wpm (`content/essays/registry.ts`), so the label can't lie. Don't hand-author a
  reading time and expect it to survive; write the words.
- The fix for "this says 5 min and reads in 60 seconds" is never a smaller number on the
  label. It's more — and better — words.

## Images

Every article carries an image that pairs **the athlete and the watch** — the person
and the object, together, so the wrist story is shown, not just described. Sourcing,
treatment, and rights are tracked in `RIGHTS.md`; no piece ships its image without a
caption naming the watch (subject + reference).

## The reference example

`content/essays/watches-and-the-world-cup.mdx` is the canonical implementation of this
standard. Read it before writing or editing any other piece.
