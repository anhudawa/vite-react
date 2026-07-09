# Rights, Licensing & Legal Readiness

The verification gauntlet protects against publishing a *wrong* fact. It does not
protect against publishing an *unlicensed image* or an actionable claim about a
person. Those are separate launch gates, tracked here so the gap is never silent.

This document is the honest ledger of what still needs a human / legal owner
before public launch. The engineering structure is in place; the clearances are
not.

---

## 1. Photography licensing — **BLOCKER (needs licensing owner)**

Every athlete image carries a `rights` field in `data/athletes.ts`:

| value                     | meaning                                                        |
| ------------------------- | ------------------------------------------------------------- |
| `licensed`                | a paid/granted licence is on file for this use                |
| `editorial-use`           | usable under editorial-use terms, credit required             |
| `unlicensed-placeholder`  | on-file rough — **must be replaced before public launch**     |

**Current status:** all athlete photography is `unlicensed-placeholder`. These
are editorial roughs used to build and demonstrate the product. They are *not*
cleared for commercial publication.

**Before launch, each image needs one of:**
- a licence from a sports photo agency (Getty, Reuters, Imago, etc.), **or**
- a brand-supplied press image used within its press terms, **or**
- original commissioned photography we own outright.

Once cleared, set `rights` and add a `credit` line; the UI is ready to surface
it. A pre-launch check should fail if any *published* athlete still carries an
`unlicensed-placeholder` image.

## 2. Trademark & brand marks — **needs review**

Brand and model names (Rolex, Richard Mille, Day-Date, RM 67-02) are used
nominatively — to report which watch is on a wrist — which is generally
defensible editorial use. We do **not** imply endorsement *by* the watch brands.
Confirm with counsel that nominative use is clean for our jurisdiction(s) and add
a standard "not affiliated with / not endorsed by" notice in the footer.

## 3. Accuracy, defamation & right of publicity — **partially covered**

- **Accuracy** is covered structurally by the gauntlet (`npm run verify:facts`).
- **Right of publicity:** stating a true, sourced fact about a public figure's
  watch is editorial reporting, but using their likeness *commercially* (ads,
  merchandise) is not. Keep usage editorial.
- **Corrections policy:** a public corrections/retractions process is required
  for a credible publication (see roadmap — trust surface).

## 4. Pre-launch legal checklist

- [ ] Replace every `unlicensed-placeholder` image with a licensed/owned one.
- [ ] Add per-image `credit` lines and render them.
- [ ] Footer: "Not affiliated with or endorsed by the watch brands named."
- [ ] Privacy policy + terms (if collecting newsletter emails).
- [ ] Counsel sign-off on nominative trademark use and editorial-use scope.

> None of the above blocks *development*. They block *publishing to the world*.
> They are listed so launch is a decision, not an accident.
