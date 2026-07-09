import type { VerificationReport, VerifiedFact } from "./types";
import { GATES } from "./gates";
import { GATE_RESIDUALS } from "./policy";
import { computeConfidence } from "./confidence";

/** Run the full gauntlet against a fact and produce an auditable report. */
export function verifyFact(fact: VerifiedFact): VerificationReport {
  const gates = GATES.map((g) => g.run(fact));
  const failures = gates.filter((g) => !g.pass).map((g) => `${g.label}: ${g.detail}`);

  // Joint modeled residual: the product over gates that passed. Independent
  // gates multiply, which is what drives the probability toward zero.
  const residualErrorEstimate = gates.reduce(
    (acc, g) => (g.pass ? acc * GATE_RESIDUALS[g.id] : acc),
    1
  );

  return {
    factId: fact.id,
    publishable: failures.length === 0,
    gates,
    computedConfidence: computeConfidence(fact),
    residualErrorEstimate,
    failures,
  };
}

/** A fact is allowed to render only if it is marked published AND clears every
 *  gate. Status alone is never trusted. */
export function isPublishable(fact: VerifiedFact): boolean {
  return fact.status === "published" && verifyFact(fact).publishable;
}

export function publishableFacts(facts: VerifiedFact[]): VerifiedFact[] {
  return facts.filter(isPublishable);
}

/**
 * Build-time enforcement. Any fact marked `published` that does NOT clear the
 * gauntlet is a contradiction the build refuses to ship. Throwing here fails
 * `next build`, so wrong information cannot reach production.
 */
export function assertPublishedFactsAreValid(facts: VerifiedFact[]): void {
  const offenders = facts
    .filter((f) => f.status === "published")
    .map((f) => ({ f, report: verifyFact(f) }))
    .filter(({ report }) => !report.publishable);

  if (offenders.length > 0) {
    const lines = offenders
      .map(
        ({ f, report }) =>
          `  ✗ ${f.id} (${f.athlete} — ${f.watch})\n` +
          report.failures.map((x) => `      · ${x}`).join("\n")
      )
      .join("\n");
    throw new Error(
      `Verification gate failed: ${offenders.length} fact(s) marked "published" ` +
        `did not clear the gauntlet.\n${lines}\n` +
        `Fix the evidence or change status away from "published".`
    );
  }
}
