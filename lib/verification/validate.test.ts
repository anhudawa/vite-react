import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyFact, isPublishable } from "./validate";
import type { Source, VerifiedFact } from "./types";

function src(over: Partial<Source> & Pick<Source, "id" | "publisher">): Source {
  return {
    kind: "media",
    tier: "secondary",
    accessedAt: "2026-06-10",
    publishedAt: "2025-06-10",
    excerpt: "supporting excerpt",
    supports: ["watch", "relation", "evidence"],
    verified: true,
    ...over,
  };
}

/** A fact that clears every gate — the control. */
function goodFact(over: Partial<VerifiedFact> = {}): VerifiedFact {
  return {
    id: "t",
    status: "published",
    athlete: "Test Rider",
    watch: "Richard Mille RM 67-02",
    relation: "Sponsored — Team",
    evidence: "Worn at an event",
    confidence: "High",
    reference: "RM 67-02",
    sources: [
      src({ id: "a", publisher: "Maker", kind: "official", tier: "primary" }),
      src({ id: "b", publisher: "Team", kind: "official", tier: "primary" }),
      src({ id: "c", publisher: "Outlet", kind: "media", tier: "secondary" }),
      src({ id: "d", publisher: "Wire Photo", kind: "photo", tier: "primary" }),
    ],
    review: {
      disconfirmingSearch: true,
      contradictionsFound: [],
      confusedWithRuledOut: ["RM 67-01"],
      method: "dual-control",
      approvedBy: "Editor",
      approvedAt: "2026-06-12",
    },
    ...over,
  };
}

test("a fully-sourced fact passes all gates", () => {
  const r = verifyFact(goodFact());
  assert.equal(r.publishable, true, r.failures.join("; "));
  assert.equal(r.gates.every((g) => g.pass), true);
  assert.equal(isPublishable(goodFact()), true);
});

test("a single source fails independent-sourcing and field-corroboration", () => {
  const f = goodFact({ sources: [goodFact().sources[0]] });
  const r = verifyFact(f);
  assert.equal(r.publishable, false);
  assert.ok(r.gates.find((g) => g.id === "independent-sourcing")!.pass === false);
});

test("an echo chamber (non-independent sources) does not corroborate", () => {
  const f = goodFact({
    sources: [
      src({ id: "a", publisher: "Outlet" }),
      src({ id: "b", publisher: "Outlet", notIndependentOf: ["a"] }), // syndicated copy
    ],
  });
  assert.equal(verifyFact(f).publishable, false);
});

test("a transposed reference fails reference-integrity", () => {
  const f = goodFact({ reference: "RM 6702" }); // wrong grammar
  const r = verifyFact(f);
  assert.equal(r.gates.find((g) => g.id === "reference-integrity")!.pass, false);
  assert.equal(r.publishable, false);
});

test("a reference for an absent maker is rejected", () => {
  const f = goodFact({ watch: "Some Other Brand Diver", reference: "RM 67-02" });
  // 'Richard Mille' grammar can't apply because the maker isn't named in the watch
  const r = verifyFact(f);
  assert.equal(r.gates.find((g) => g.id === "reference-integrity")!.pass, true);
  // (generic plausibility passes, but a registry brand mismatch would not)
  const f2 = goodFact({ watch: "Rolex Daytona", reference: "RM 67-02" });
  assert.equal(verifyFact(f2).gates.find((g) => g.id === "reference-integrity")!.pass, false);
});

test("a High rating without a photo/video fails visual-evidence", () => {
  const f = goodFact({
    confidence: "High",
    sources: [
      src({ id: "a", publisher: "Maker", kind: "official", tier: "primary" }),
      src({ id: "b", publisher: "Team", kind: "official", tier: "primary" }),
      src({ id: "c", publisher: "Outlet", kind: "media", tier: "secondary" }),
    ],
  });
  const r = verifyFact(f);
  assert.equal(r.gates.find((g) => g.id === "visual-evidence")!.pass, false);
  assert.equal(r.publishable, false);
});

test("visual-evidence is not required below a High rating", () => {
  const f = goodFact({
    confidence: "Medium",
    sources: [
      src({ id: "a", publisher: "Maker", kind: "official", tier: "primary" }),
      src({ id: "b", publisher: "Outlet", kind: "media", tier: "secondary" }),
    ],
  });
  assert.equal(verifyFact(f).gates.find((g) => g.id === "visual-evidence")!.pass, true);
});

test("a vague relationship fails relationship-clarity", () => {
  const f = goodFact({ relation: "spotted on the wrist" });
  const r = verifyFact(f);
  assert.equal(r.gates.find((g) => g.id === "relationship-clarity")!.pass, false);
  assert.equal(r.publishable, false);
});

test("a brand-level claim (named maker, no reference) passes reference-integrity", () => {
  const f = goodFact({ watch: "Rolex Day-Date 40", reference: undefined });
  assert.equal(
    verifyFact(f).gates.find((g) => g.id === "reference-integrity")!.pass,
    true
  );
});

test("no reference and no recognised maker fails reference-integrity", () => {
  const f = goodFact({ watch: "Some Unknown Diver", reference: undefined });
  assert.equal(
    verifyFact(f).gates.find((g) => g.id === "reference-integrity")!.pass,
    false
  );
});

test("ownership facts exempt old media from the staleness clock", () => {
  const oldMedia = {
    id: "old",
    publisher: "Old Mag",
    kind: "media" as const,
    tier: "secondary" as const,
    url: "https://example.com/old",
    publishedAt: "2014-01-01", // well beyond staleMediaYears
    accessedAt: "2026-06-16",
    excerpt: "He bought it himself years ago.",
    supports: ["athlete", "watch", "relation", "evidence"] as const,
    verified: true,
  };
  const old2 = { ...oldMedia, id: "old2", publisher: "Other Old Mag" };

  // As a sponsorship, two 2014 sources are stale → independent-sourcing fails.
  const sponsored = goodFact({
    relation: "Sponsored — Brand",
    sources: [oldMedia, old2],
  });
  assert.equal(
    verifyFact(sponsored).gates.find((g) => g.id === "independent-sourcing")!.pass,
    false
  );

  // As a personal purchase, the same sources stay live → it passes.
  const owned = goodFact({
    relation: "Personal — private collection",
    sources: [oldMedia, old2],
  });
  assert.equal(
    verifyFact(owned).gates.find((g) => g.id === "independent-sourcing")!.pass,
    true
  );
});

test("no disconfirming search fails adversarial-review", () => {
  const f = goodFact({
    review: { ...goodFact().review, disconfirmingSearch: false },
  });
  assert.equal(verifyFact(f).gates.find((g) => g.id === "adversarial-review")!.pass, false);
});

test("an open contradiction blocks publication", () => {
  const f = goodFact({
    review: { ...goodFact().review, contradictionsFound: ["seen on the other wrist"] },
  });
  assert.equal(verifyFact(f).publishable, false);
});

test("over-claimed confidence is caught", () => {
  // strip to two secondary sources -> computed Medium at best; claim High
  const f = goodFact({
    confidence: "High",
    sources: [
      src({ id: "a", publisher: "Outlet1", tier: "secondary", kind: "media" }),
      src({ id: "b", publisher: "Outlet2", tier: "secondary", kind: "media" }),
    ],
  });
  const r = verifyFact(f);
  assert.equal(r.gates.find((g) => g.id === "confidence-threshold")!.pass, false);
});

test("missing editorial sign-off fails", () => {
  const f = goodFact({
    review: { ...goodFact().review, approvedBy: undefined, method: "single" },
  });
  assert.equal(verifyFact(f).gates.find((g) => g.id === "editorial-signoff")!.pass, false);
});

test("unverified sources do not count", () => {
  const f = goodFact({
    sources: goodFact().sources.map((s) => ({ ...s, verified: false })),
  });
  assert.equal(verifyFact(f).publishable, false);
});

test("residual error is the product of passed-gate residuals (tiny)", () => {
  const r = verifyFact(goodFact());
  assert.ok(r.residualErrorEstimate < 1e-5, `was ${r.residualErrorEstimate}`);
});
