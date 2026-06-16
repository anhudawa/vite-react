import * as React from "react";

/**
 * THE ESCAPEMENT MARK (Territory A — the hero glyph).
 *
 * An abstract glyph built from the escapement's own geometry: the pointed
 * teeth of the escape wheel and the anchor of the pallet fork. Single-colour
 * (currentColor), no fills that depend on theme, designed to survive at 16px
 * and as a blind emboss. The soul of a watch rendered as one mark.
 */

const TEETH = 13;
const WHEEL_CX = 50;
const WHEEL_CY = 60;
const TIP_R = 33;
const ROOT_R = 25;

function escapeWheelPath(): string {
  const seg: string[] = [];
  for (let i = 0; i < TEETH; i++) {
    const a0 = (i / TEETH) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.5) / TEETH) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / TEETH) * Math.PI * 2 - Math.PI / 2;
    // tip leans into the direction of rotation (club-tooth suggestion)
    const tipX = WHEEL_CX + TIP_R * Math.cos(a0 + 0.06);
    const tipY = WHEEL_CY + TIP_R * Math.sin(a0 + 0.06);
    const valX = WHEEL_CX + ROOT_R * Math.cos(a1);
    const valY = WHEEL_CY + ROOT_R * Math.sin(a1);
    const nextRootX = WHEEL_CX + ROOT_R * Math.cos(a2);
    const nextRootY = WHEEL_CY + ROOT_R * Math.sin(a2);
    if (i === 0) seg.push(`M ${tipX.toFixed(2)} ${tipY.toFixed(2)}`);
    else seg.push(`L ${tipX.toFixed(2)} ${tipY.toFixed(2)}`);
    seg.push(`L ${valX.toFixed(2)} ${valY.toFixed(2)}`);
    seg.push(`L ${nextRootX.toFixed(2)} ${nextRootY.toFixed(2)}`);
  }
  seg.push("Z");
  return seg.join(" ");
}

const WHEEL = escapeWheelPath();

export function Mark({
  size = 28,
  title = "Escapement",
  className,
}: {
  size?: number | string;
  title?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* escape wheel */}
      <path d={WHEEL} />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r={6} />
      {/* pallet fork / anchor — pivots above the wheel, two pallet stones
          reaching down to lock the teeth at roughly 10 and 2 o'clock */}
      <path d="M50 8 L50 22" />
      <path d="M50 22 L31 41 L37 47" strokeLinejoin="miter" />
      <path d="M50 22 L69 41 L63 47" strokeLinejoin="miter" />
      <circle cx={50} cy={20} r={3.4} fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Wordmark — ESCAPEMENT set with precision: letter-spaced, confident, with one
 * quiet distinctive detail (the lume tick that replaces the dot of the "I"
 * register is carried via the mark elsewhere; here restraint rules). Rendered
 * in the grotesque so it stays crisp at every size.
 */
export function Wordmark({
  className,
  withMark = false,
}: {
  className?: string;
  withMark?: boolean;
}) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6em",
        fontFamily: "var(--font-grotesque)",
        fontWeight: 600,
        letterSpacing: "0.34em",
        textTransform: "uppercase",
        lineHeight: 1,
        // optical: pull the trailing letter-space back so the word sits centred
        paddingLeft: "0.17em",
      }}
    >
      {withMark && <Mark size="1.15em" />}
      <span>Escapement</span>
    </span>
  );
}
