/**
 * The escalation ladder — the product's core state machine.
 *
 *   DRAFT → ISSUED → REMINDER_1 (day 30) → REMINDER_2 (day 60)
 *         → FORMAL_LETTER (day 90) → RECOVERY_DECISION (user gate)
 *         → BAR_REFERRAL_PACK | LSRA_COMPLAINT_PACK
 *         → SETTLED | WRITTEN_OFF | DISPUTED
 *
 * Everything here is a pure function: the store applies the results and
 * writes the audit trail. Two invariants are non-negotiable:
 *
 *  1. Every escalation beyond REMINDER_1 requires explicit user approval.
 *     The engine only ever *proposes*; nothing past REMINDER_1 is
 *     auto-sendable.
 *  2. The user can always pause, skip or reorder — a paused or disputed
 *     fee note never produces a proposed action.
 */

import { addDays, todayISO } from "./dates";
import {
  DEFAULT_TIMINGS,
  EscalationStepType,
  EscalationTimings,
  FeeNote,
  FeeNoteState,
  TERMINAL_STATES,
} from "./types";

/**
 * A cadence is valid when each rung is strictly after the previous one —
 * out-of-order timings would silently skip rungs in the ladder walk.
 */
export function validateTimings(t: EscalationTimings): string | null {
  const { reminder1Days: r1, reminder2Days: r2, formalLetterDays: fl } = t;
  if (![r1, r2, fl].every((d) => Number.isFinite(d) && d > 0)) {
    return "Each step must be a positive number of days.";
  }
  if (!(r1 < r2 && r2 < fl)) {
    return "Steps must be in order: reminder 1 before reminder 2 before the formal letter.";
  }
  return null;
}

export function effectiveTimings(
  fn: FeeNote,
  globalTimings: EscalationTimings = DEFAULT_TIMINGS,
): EscalationTimings {
  return fn.timingsOverride ?? globalTimings;
}

/** Ordered automatic rungs of the ladder (packs come via RECOVERY_DECISION). */
const AUTOMATIC_LADDER: {
  step: EscalationStepType & ("REMINDER_1" | "REMINDER_2" | "FORMAL_LETTER");
  daysKey: keyof EscalationTimings;
}[] = [
  { step: "REMINDER_1", daysKey: "reminder1Days" },
  { step: "REMINDER_2", daysKey: "reminder2Days" },
  { step: "FORMAL_LETTER", daysKey: "formalLetterDays" },
];

/** State the fee note lands in once a given step has been sent/generated. */
export function stateAfterStep(step: EscalationStepType): FeeNoteState {
  return step;
}

const LADDER_POSITION: Record<string, number> = {
  ISSUED: 0,
  REMINDER_1: 1,
  REMINDER_2: 2,
  FORMAL_LETTER: 3,
};

export type ProposedAction =
  | {
      kind: "SEND_STEP";
      step: EscalationStepType;
      dueDate: string; // ISO date
      due: boolean; // true once dueDate <= today
      requiresApproval: boolean;
    }
  | { kind: "RECOVERY_DECISION" };

/**
 * What the ladder proposes next for this fee note, or null when there is
 * nothing to do (draft, terminal, disputed, paused, or awaiting a pack
 * outcome).
 */
export function proposeNextAction(
  fn: FeeNote,
  globalTimings: EscalationTimings = DEFAULT_TIMINGS,
  now: Date = new Date(),
): ProposedAction | null {
  if (fn.paused || fn.state === "DISPUTED") return null;
  if (TERMINAL_STATES.includes(fn.state) || fn.state === "DRAFT") return null;
  if (fn.state === "BAR_REFERRAL_PACK" || fn.state === "LSRA_COMPLAINT_PACK")
    return null;
  if (fn.state === "RECOVERY_DECISION") return { kind: "RECOVERY_DECISION" };

  const position = LADDER_POSITION[fn.state];
  const timings = effectiveTimings(fn, globalTimings);
  const today = todayISO(now);

  for (const rung of AUTOMATIC_LADDER) {
    if (LADDER_POSITION[rung.step] <= position) continue;
    if (fn.skippedSteps.includes(rung.step)) continue;
    const dueDate = addDays(fn.issueDate, timings[rung.daysKey]);
    return {
      kind: "SEND_STEP",
      step: rung.step,
      dueDate,
      due: dueDate <= today,
      requiresApproval: rung.step !== "REMINDER_1",
    };
  }
  // Ladder exhausted (possibly via skips) → the recovery gate.
  return { kind: "RECOVERY_DECISION" };
}

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

export class TransitionError extends Error {}

/** Issue a draft fee note. */
export function issue(fn: FeeNote): FeeNote {
  if (fn.state !== "DRAFT")
    throw new TransitionError(`Cannot issue from ${fn.state}`);
  return { ...fn, state: "ISSUED" };
}

/**
 * Record that a ladder step was actually sent/generated. The caller is
 * responsible for having satisfied the approval gate first — pass
 * `approved: true` for anything beyond REMINDER_1.
 */
export function markStepSent(
  fn: FeeNote,
  step: EscalationStepType,
  approved: boolean,
): FeeNote {
  if (fn.paused) throw new TransitionError("Ladder is paused");
  if (fn.state === "DISPUTED")
    throw new TransitionError("Fee note is disputed");
  if (TERMINAL_STATES.includes(fn.state))
    throw new TransitionError(`Fee note is ${fn.state}`);
  if (step !== "REMINDER_1" && !approved)
    throw new TransitionError(`${step} requires explicit user approval`);

  if (step === "BAR_REFERRAL_PACK" || step === "LSRA_COMPLAINT_PACK") {
    if (fn.state !== "RECOVERY_DECISION")
      throw new TransitionError(
        `${step} is only available from RECOVERY_DECISION (state: ${fn.state})`,
      );
    return { ...fn, state: step };
  }

  const from = LADDER_POSITION[fn.state];
  const to = LADDER_POSITION[step];
  if (from === undefined || to === undefined || to <= from)
    throw new TransitionError(`Cannot send ${step} from ${fn.state}`);
  return { ...fn, state: stateAfterStep(step) };
}

/** After FORMAL_LETTER (or an exhausted ladder), enter the recovery gate. */
export function enterRecoveryDecision(fn: FeeNote): FeeNote {
  if (fn.state !== "FORMAL_LETTER" && LADDER_POSITION[fn.state] === undefined)
    throw new TransitionError(`Cannot enter recovery gate from ${fn.state}`);
  return { ...fn, state: "RECOVERY_DECISION" };
}

/** Disputes pause the ladder and are resumable to the prior state. */
export function dispute(fn: FeeNote): FeeNote {
  if (TERMINAL_STATES.includes(fn.state) || fn.state === "DRAFT")
    throw new TransitionError(`Cannot dispute from ${fn.state}`);
  if (fn.state === "DISPUTED") return fn;
  return { ...fn, state: "DISPUTED", stateBeforeDispute: fn.state };
}

export function resolveDispute(fn: FeeNote): FeeNote {
  if (fn.state !== "DISPUTED")
    throw new TransitionError("Fee note is not disputed");
  return {
    ...fn,
    state: fn.stateBeforeDispute ?? "ISSUED",
    stateBeforeDispute: null,
  };
}

export function settle(fn: FeeNote): FeeNote {
  if (fn.state === "DRAFT" || fn.state === "WRITTEN_OFF")
    throw new TransitionError(`Cannot settle from ${fn.state}`);
  return { ...fn, state: "SETTLED" };
}

export function writeOff(fn: FeeNote): FeeNote {
  if (fn.state === "DRAFT" || fn.state === "SETTLED")
    throw new TransitionError(`Cannot write off from ${fn.state}`);
  return { ...fn, state: "WRITTEN_OFF" };
}

export function setPaused(fn: FeeNote, paused: boolean): FeeNote {
  return { ...fn, paused };
}

export function skipStep(fn: FeeNote, step: EscalationStepType): FeeNote {
  if (fn.skippedSteps.includes(step)) return fn;
  return { ...fn, skippedSteps: [...fn.skippedSteps, step] };
}
