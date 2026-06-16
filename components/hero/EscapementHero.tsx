"use client";

import { useEffect, useRef } from "react";
import styles from "./EscapementHero.module.css";

/* -----------------------------------------------------------------------------
   Geometry — a lever escapement, drawn from its own dimensions.
   Escape wheel (lower), pallet fork / anchor (middle), balance + hairspring
   (the oscillator, behind). One source of numbers so the SVG and the motion
   agree.
----------------------------------------------------------------------------- */

const VB = 480;
const WHEEL = { cx: 240, cy: 312, tip: 132, root: 104, teeth: 18, hub: 16 };
const TOOTH = 360 / WHEEL.teeth;
const PIVOT = { x: 240, y: 150 }; // fork + balance axis (emblematic, coaxial)
const FORK_MAX = 6.4; // degrees of swing each side
const BAL_MAX = 58; // balance amplitude, degrees
const BEAT_HZ = 1.4; // slowed, hypnotic — drama over the realistic ~4 Hz
const PERIOD = 2 / BEAT_HZ; // seconds for a full oscillation (two beats)

function pt(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}

function escapeWheelPath(): string {
  const { cx, cy, tip, root, teeth } = WHEEL;
  const seg: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * 360;
    const a1 = ((i + 0.46) / teeth) * 360;
    const a2 = ((i + 1) / teeth) * 360;
    // club tooth: tip leans into rotation, steep locking face trailing
    const [tx, ty] = pt(cx, cy, tip, a0 + 4);
    const [vx, vy] = pt(cx, cy, root, a1);
    const [nx, ny] = pt(cx, cy, root, a2);
    seg.push(`${i === 0 ? "M" : "L"}${tx.toFixed(2)} ${ty.toFixed(2)}`);
    seg.push(`L${vx.toFixed(2)} ${vy.toFixed(2)}`);
    seg.push(`L${nx.toFixed(2)} ${ny.toFixed(2)}`);
  }
  return seg.join(" ") + " Z";
}

const WHEEL_D = escapeWheelPath();

// balance wheel spokes
const SPOKES = Array.from({ length: 4 }, (_, i) => i * 45);

// hairspring — an Archimedean spiral, the breathing heart
function hairspringPath(turns = 4, r0 = 8, r1 = 64): string {
  const steps = 220;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const ang = f * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * f;
    const x = PIVOT.x + r * Math.cos(ang);
    const y = PIVOT.y + r * Math.sin(ang);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(" ");
}
const HAIRSPRING_D = hairspringPath();

function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

/* -----------------------------------------------------------------------------
   Component
----------------------------------------------------------------------------- */

export function EscapementHero() {
  const wheelRef = useRef<SVGGElement>(null);
  const forkRef = useRef<SVGGElement>(null);
  const balanceRef = useRef<SVGGElement>(null);
  const glowLRef = useRef<SVGGElement>(null);
  const glowRRef = useRef<SVGGElement>(null);
  const rootRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // A composed still pose — mid-impulse, lume caught on the entry jewel.
    function pose(tSeconds: number) {
      const t = tSeconds;
      const osc = Math.sin((2 * Math.PI * t) / PERIOD);
      const halfBeat = PERIOD / 2;
      const n = Math.floor(t / halfBeat);
      const bf = (t % halfBeat) / halfBeat;
      const progress = easeInOut(Math.min(bf / 0.33, 1));

      const wheelDeg = -TOOTH * (n + progress);
      const forkDeg = FORK_MAX * Math.tanh(2.4 * osc);
      const balDeg = BAL_MAX * osc;

      // impulse pulse — sharp at the unlock crossing (bf ≈ 0 / ≈ 1)
      const pulse =
        Math.exp(-Math.pow(bf / 0.1, 2)) +
        Math.exp(-Math.pow((bf - 1) / 0.1, 2));
      const even = n % 2 === 0;

      wheelRef.current?.setAttribute(
        "transform",
        `rotate(${wheelDeg.toFixed(3)} ${WHEEL.cx} ${WHEEL.cy})`
      );
      forkRef.current?.setAttribute(
        "transform",
        `rotate(${forkDeg.toFixed(3)} ${PIVOT.x} ${PIVOT.y})`
      );
      balanceRef.current?.setAttribute(
        "transform",
        `rotate(${balDeg.toFixed(3)} ${PIVOT.x} ${PIVOT.y})`
      );
      glowLRef.current?.setAttribute(
        "opacity",
        (even ? pulse : pulse * 0.12).toFixed(3)
      );
      glowRRef.current?.setAttribute(
        "opacity",
        (even ? pulse * 0.12 : pulse).toFixed(3)
      );
    }

    if (reduce) {
      pose(PERIOD * 0.5 + 0.06); // a beautiful frozen instant
      return;
    }

    const start = performance.now();
    function frame(now: number) {
      if (!runningRef.current) return;
      pose((now - start) / 1000);
      rafRef.current = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !runningRef.current) {
          runningRef.current = true;
          rafRef.current = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && runningRef.current) {
          runningRef.current = false;
          cancelAnimationFrame(rafRef.current);
        }
      },
      { threshold: 0.05 }
    );
    if (rootRef.current) io.observe(rootRef.current);

    // Subtle scroll-reactivity — the view travels a touch *into* the movement as
    // the hero leaves. Decoupled from the 60fps tick loop: throttled to one
    // rAF per scroll burst so it stays cheap and smooth.
    let ticking = false;
    function applyTravel() {
      ticking = false;
      const svg = rootRef.current;
      if (!svg) return;
      const span = window.innerHeight * 0.85;
      const p = Math.min(Math.max(window.scrollY / span, 0), 1);
      const scale = (1 + p * 0.16).toFixed(4);
      svg.style.transform = `scale(${scale})`;
      svg.style.opacity = (1 - p * 0.6).toFixed(3);
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyTravel);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    applyTravel();

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <svg
      ref={rootRef}
      className={styles.svg}
      viewBox={`0 0 ${VB} ${VB}`}
      role="img"
      aria-label="A lever escapement — the escape wheel advancing tooth by tooth as the pallet fork locks, impulses, and releases."
      fill="none"
      stroke="currentColor"
    >
      <defs>
        <radialGradient id="lumeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--lume-glow)" stopOpacity="0.95" />
          <stop offset="45%" stopColor="var(--lume-glow)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--lume-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* schematic guides — blueprint linework, very faint */}
      <g className={styles.guides}>
        <circle cx={WHEEL.cx} cy={WHEEL.cy} r={WHEEL.tip + 16} />
        <circle cx={PIVOT.x} cy={PIVOT.y} r={74} />
        <line x1={PIVOT.x} y1={20} x2={PIVOT.x} y2={WHEEL.cy} />
        <line x1={60} y1={WHEEL.cy} x2={420} y2={WHEEL.cy} />
      </g>

      {/* balance wheel + hairspring — the oscillator, behind */}
      <g ref={balanceRef}>
        <path className={styles.hairspring} d={HAIRSPRING_D} />
        <circle
          className={styles.balanceRim}
          cx={PIVOT.x}
          cy={PIVOT.y}
          r={70}
        />
        {SPOKES.map((deg) => {
          const [x2, y2] = pt(PIVOT.x, PIVOT.y, 70, deg);
          const [x1, y1] = pt(PIVOT.x, PIVOT.y, -70, deg);
          return (
            <line
              key={deg}
              className={styles.spoke}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          );
        })}
        <circle cx={PIVOT.x} cy={PIVOT.y} r={6} className={styles.solid} />
      </g>

      {/* escape wheel */}
      <g ref={wheelRef} className={styles.wheel}>
        <path d={WHEEL_D} className={styles.wheelBody} />
        <circle cx={WHEEL.cx} cy={WHEEL.cy} r={WHEEL.hub} />
        <circle cx={WHEEL.cx} cy={WHEEL.cy} r={5} className={styles.solid} />
        {SPOKES.map((deg) => {
          const [x2, y2] = pt(WHEEL.cx, WHEEL.cy, WHEEL.root - 6, deg);
          const [x1, y1] = pt(WHEEL.cx, WHEEL.cy, WHEEL.hub, deg);
          return (
            <line
              key={deg}
              className={styles.spokeThin}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
          );
        })}
      </g>

      {/* lume glows on the pallet jewels at the instant of impulse */}
      <g ref={glowLRef} opacity="0">
        <circle cx={188} cy={196} r={34} fill="url(#lumeGlow)" stroke="none" />
      </g>
      <g ref={glowRRef} opacity="0">
        <circle cx={292} cy={196} r={34} fill="url(#lumeGlow)" stroke="none" />
      </g>

      {/* pallet fork / anchor */}
      <g ref={forkRef} className={styles.fork}>
        {/* arms */}
        <path
          className={styles.forkBody}
          d={`M${PIVOT.x} ${PIVOT.y - 4}
              L188 196 L182 206
              M${PIVOT.x} ${PIVOT.y - 4}
              L292 196 L298 206`}
        />
        {/* pallet stones (jewels) */}
        <rect
          className={styles.jewel}
          x={180}
          y={190}
          width={16}
          height={12}
          rx={1.5}
          transform="rotate(-26 188 196)"
        />
        <rect
          className={styles.jewel}
          x={284}
          y={190}
          width={16}
          height={12}
          rx={1.5}
          transform="rotate(26 292 196)"
        />
        {/* fork tail + lever to balance */}
        <line x1={PIVOT.x} y1={PIVOT.y - 4} x2={PIVOT.x} y2={PIVOT.y + 40} />
        <circle cx={PIVOT.x} cy={PIVOT.y} r={7} className={styles.solid} />
      </g>
    </svg>
  );
}
