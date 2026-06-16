import type { ClaimField, GateId, GateResult, VerifiedFact } from "./types";
import { POLICY } from "./policy";
import { checkReference } from "./references";
import {
  computeConfidence,
  independentSources,
  liveSources,
  rankConfidence,
} from "./confidence";

export interface Gate {
  id: GateId;
  label: string;
  /** one-line description of what class of error this gate catches */
  catches: string;
  run: (fact: VerifiedFact) => GateResult;
}

function countIndependentForField(fact: VerifiedFact, field: ClaimField): number {
  const supporting = liveSources(fact.sources).filter((s) => s.supports.includes(field));
  return independentSources(supporting).length;
}

/** THE GAUNTLET. Each gate is independent and catches a distinct failure mode. */
export const GATES: Gate[] = [
  {
    id: "independent-sourcing",
    label: "Independent sourcing",
    catches: "a single source, or an echo chamber, masquerading as corroboration",
    run: (fact) => {
      const n = independentSources(liveSources(fact.sources)).length;
      const pass = n >= POLICY.minIndependentSources;
      return {
        id: "independent-sourcing",
        label: "Independent sourcing",
        pass,
        detail: `${n} independent, verified, live source(s); ${POLICY.minIndependentSources} required.`,
      };
    },
  },
  {
    id: "field-corroboration",
    label: "Field corroboration",
    catches: "a right watch attached to the wrong relationship, event, or person",
    run: (fact) => {
      const weak = POLICY.criticalFields
        .map((f) => ({ f, n: countIndependentForField(fact, f) }))
        .filter((x) => x.n < POLICY.minCorroborationPerField);
      const pass = weak.length === 0;
      return {
        id: "field-corroboration",
        label: "Field corroboration",
        pass,
        detail: pass
          ? `Every critical field (${POLICY.criticalFields.join(", ")}) is independently corroborated ≥${POLICY.minCorroborationPerField}×.`
          : `Under-corroborated: ${weak.map((x) => `${x.f} (${x.n})`).join(", ")}.`,
      };
    },
  },
  {
    id: "reference-integrity",
    label: "Reference integrity",
    catches: "a transposed or invented reference number",
    run: (fact) => {
      const r = checkReference(fact.watch, fact.reference);
      return {
        id: "reference-integrity",
        label: "Reference integrity",
        pass: r.ok,
        detail: r.reason,
      };
    },
  },
  {
    id: "adversarial-review",
    label: "Adversarial review",
    catches: "confirmation bias — only ever looking for evidence that agrees",
    run: (fact) => {
      const { disconfirmingSearch, contradictionsFound, confusedWithRuledOut } =
        fact.review;
      const pass = disconfirmingSearch && contradictionsFound.length === 0;
      return {
        id: "adversarial-review",
        label: "Adversarial review",
        pass,
        detail: pass
          ? `Disconfirming search performed; no contradictions. Look-alikes ruled out: ${
              confusedWithRuledOut.length ? confusedWithRuledOut.join(", ") : "none noted"
            }.`
          : !disconfirmingSearch
            ? "No disconfirming search was recorded."
            : `Open contradictions: ${contradictionsFound.join("; ")}.`,
      };
    },
  },
  {
    id: "confidence-threshold",
    label: "Confidence threshold",
    catches: "over-claiming certainty the evidence does not support",
    run: (fact) => {
      const computed = computeConfidence(fact);
      const meetsFloor =
        rankConfidence(computed) >= rankConfidence(POLICY.minConfidenceToPublish);
      const notOverclaimed = rankConfidence(fact.confidence) <= rankConfidence(computed);
      const pass = meetsFloor && notOverclaimed;
      return {
        id: "confidence-threshold",
        label: "Confidence threshold",
        pass,
        detail: !meetsFloor
          ? `Computed confidence ${computed} is below the publish floor (${POLICY.minConfidenceToPublish}).`
          : !notOverclaimed
            ? `Stated confidence ${fact.confidence} exceeds computed ${computed}.`
            : `Stated ${fact.confidence} ≤ computed ${computed}, at or above floor.`,
      };
    },
  },
  {
    id: "editorial-signoff",
    label: "Editorial sign-off",
    catches: "an automated pipeline shipping with no human accountable",
    run: (fact) => {
      const { approvedBy, approvedAt, method } = fact.review;
      const dateOk = !!approvedAt && !Number.isNaN(Date.parse(approvedAt));
      const pass = !!approvedBy && dateOk && method === "dual-control";
      return {
        id: "editorial-signoff",
        label: "Editorial sign-off",
        pass,
        detail: pass
          ? `Approved by ${approvedBy} under dual control on ${approvedAt!.slice(0, 10)}.`
          : "Requires a named approver, a valid date, and dual-control method.",
      };
    },
  },
];

export const GATE_COUNT = GATES.length;
