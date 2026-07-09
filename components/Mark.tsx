import * as React from "react";

/**
 * THE MARK — "The Elongated Second" (identity direction A).
 *
 * A seconds track of sixty even ticks — clock-time — with one index frozen at
 * twelve, stretched long and overshooting the track, drawn in lume. Literally
 * "the long second" as a glyph. Single-colour track in currentColor; the long
 * index in lume. Built to survive to 16px, where the track recedes and the bold
 * lume index reads alone.
 */

const CX = 50;
const CY = 50;
const R = 38; // chapter-ring radius

function ticks(): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 60; i++) {
    if (i === 0) continue; // twelve o'clock belongs to the long second
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const major = i % 5 === 0;
    const len = major ? 6 : 3.5;
    const x1 = CX + (R - len) * Math.cos(a);
    const y1 = CY + (R - len) * Math.sin(a);
    const x2 = CX + R * Math.cos(a);
    const y2 = CY + R * Math.sin(a);
    out.push(
      <line
        key={i}
        x1={x1.toFixed(2)}
        y1={y1.toFixed(2)}
        x2={x2.toFixed(2)}
        y2={y2.toFixed(2)}
        strokeWidth={major ? 2 : 1.4}
        opacity={major ? 0.55 : 0.32}
      />
    );
  }
  return out;
}

export function Mark({
  size = 28,
  title = "The Long Second",
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
      strokeLinecap="round"
    >
      {/* the even seconds track — clock-time, all around it */}
      <g>{ticks()}</g>

      {/* the long second — one index, stretched long and overshooting the track,
          frozen mid-sweep at twelve, in lume */}
      <line
        x1={CX}
        y1={CY}
        x2={CX}
        y2={4}
        stroke="var(--lume-glow, #D8F26A)"
        strokeWidth={5}
      />
      {/* counterweight tail for balance */}
      <line
        x1={CX}
        y1={CY}
        x2={CX}
        y2={62}
        stroke="var(--lume-glow, #D8F26A)"
        strokeWidth={5}
      />
      {/* pivot */}
      <circle cx={CX} cy={CY} r={4.2} fill="var(--lume-glow, #D8F26A)" stroke="none" />
      <circle cx={CX} cy={CY} r={7.5} strokeWidth={1.4} opacity={0.5} />
    </svg>
  );
}

/**
 * The masthead lockup — "THE LONG SECOND" set in the editorial serif, with
 * "THE" subordinate and a quiet elongation of "LONG" (felt, never a gimmick).
 * Optionally signed "BY ANTHONY WALSH". The masthead always leads; the byline
 * only authenticates — never louder.
 */
export function Wordmark({
  className,
  withMark = false,
  byline = false,
}: {
  className?: string;
  withMark?: boolean;
  byline?: boolean;
}) {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.55em" }}
    >
      {withMark && <Mark size="1.7em" />}
      <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.4em",
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            fontSize: "1.05em",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.42em",
              letterSpacing: "0.34em",
              fontWeight: 500,
              alignSelf: "center",
              color: "var(--label-muted)",
            }}
          >
            THE
          </span>
          {/* the long second — LONG given a quiet extra width */}
          <span style={{ letterSpacing: "0.26em", paddingRight: "0.1em" }}>Long</span>
          <span style={{ letterSpacing: "0.02em" }}>Second</span>
        </span>
        {byline && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.34em",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--label-muted)",
              marginTop: "0.5em",
            }}
          >
            By Anthony Walsh
          </span>
        )}
      </span>
    </span>
  );
}

/** Monogram — TLS — for the app icon / tight spaces. */
export function Monogram({ size = 28, className }: { size?: number | string; className?: string }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 600,
        fontSize: typeof size === "number" ? `${size}px` : size,
        letterSpacing: "0.04em",
        lineHeight: 1,
      }}
    >
      TLS
    </span>
  );
}
