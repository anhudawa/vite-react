"use client";

import { useEffect, useRef } from "react";
import styles from "./LongSecondHero.module.css";

/* -----------------------------------------------------------------------------
   THE LONG SECOND — the hero.
   A seconds hand sweeps an even track of sixty ticks. As it reaches twelve it
   slows and STRETCHES — one second dilating, overshooting the track, the lume
   glowing — then releases and resolves. Clock-time all around it; the long
   second is the one that breaks the rhythm.
----------------------------------------------------------------------------- */

const VB = 480;
const C = 240;
const RING = 190;
const BASE_LEN = 168; // seconds-hand length at normal sweep
const OVERSHOOT = 52; // extra length at full dilation (past the ring)
const TAIL = 46; // counterweight
const REV_SECONDS = 14; // one sweep
const W0 = (Math.PI * 2) / REV_SECONDS; // base angular velocity
const SLOW_MIN = 0.07; // angular speed at the heart of the long second
const SLOW_WINDOW = 0.42; // radians around twelve where the second dilates

function smooth(x: number) {
  const c = Math.min(Math.max(x, 0), 1);
  return c * c * (3 - 2 * c);
}

// even seconds track
const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
  const major = i % 5 === 0;
  const len = i === 0 ? 24 : major ? 16 : 8;
  return {
    i,
    x1: C + (RING - len) * Math.cos(a),
    y1: C + (RING - len) * Math.sin(a),
    x2: C + RING * Math.cos(a),
    y2: C + RING * Math.sin(a),
    major,
    top: i === 0,
  };
});

export function LongSecondHero() {
  const rootRef = useRef<SVGSVGElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const handLineRef = useRef<SVGLineElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // signed angular distance from twelve, in (-π, π]
    function fromTop(theta: number) {
      let d = theta % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      return d;
    }

    // place the hand for a given angle (radians clockwise from twelve)
    function place(theta: number) {
      const near = 1 - Math.min(Math.abs(fromTop(theta)) / SLOW_WINDOW, 1);
      const dilate = smooth(near);
      const len = BASE_LEN + OVERSHOOT * dilate;
      const deg = (theta * 180) / Math.PI;

      handRef.current?.setAttribute("transform", `rotate(${deg.toFixed(3)} ${C} ${C})`);
      handLineRef.current?.setAttribute("y2", (C - len).toFixed(2));
      handLineRef.current?.setAttribute("stroke-width", (5 + dilate * 2.5).toFixed(2));
      glowRef.current?.setAttribute("cy", (C - len).toFixed(2));
      glowRef.current?.setAttribute("opacity", (dilate * 0.95).toFixed(3));
    }

    if (reduce) {
      place(0); // frozen at the long second — stretched, glowing
      return;
    }

    let theta = Math.PI * 0.8; // start away from the top
    let last = performance.now();
    function frame(now: number) {
      if (!runningRef.current) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const near = 1 - Math.min(Math.abs(fromTop(theta)) / SLOW_WINDOW, 1);
      const factor = SLOW_MIN + (1 - SLOW_MIN) * (1 - smooth(near));
      theta = (theta + W0 * factor * dt) % (Math.PI * 2);
      place(theta);
      rafRef.current = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !runningRef.current) {
          runningRef.current = true;
          last = performance.now();
          rafRef.current = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && runningRef.current) {
          runningRef.current = false;
          cancelAnimationFrame(rafRef.current);
        }
      },
      { threshold: 0.05 }
    );
    if (rootRef.current) io.observe(rootRef.current);

    // Subtle scroll-reactivity — the dial recedes a touch as the hero leaves.
    let ticking = false;
    function applyTravel() {
      ticking = false;
      const svg = rootRef.current;
      if (!svg) return;
      const span = window.innerHeight * 0.85;
      const p = Math.min(Math.max(window.scrollY / span, 0), 1);
      svg.style.transform = `scale(${(1 + p * 0.12).toFixed(4)})`;
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
      aria-label="A seconds hand sweeps an even track, then slows and stretches through a single long second before resolving."
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <defs>
        <radialGradient id="lsGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--lume-glow)" stopOpacity="0.9" />
          <stop offset="45%" stopColor="var(--lume-glow)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--lume-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* chapter ring */}
      <circle className={styles.ring} cx={C} cy={C} r={RING} />

      {/* the even seconds track — clock-time */}
      <g>
        {TICKS.map((t) => (
          <line
            key={t.i}
            x1={t.x1.toFixed(2)}
            y1={t.y1.toFixed(2)}
            x2={t.x2.toFixed(2)}
            y2={t.y2.toFixed(2)}
            className={t.top ? styles.tickLong : t.major ? styles.tickMajor : styles.tick}
          />
        ))}
      </g>

      {/* the long second — a hand that stretches and glows through twelve */}
      <g ref={handRef}>
        <circle ref={glowRef} cx={C} cy={C - BASE_LEN} r={46} fill="url(#lsGlow)" stroke="none" opacity="0" />
        <line
          ref={handLineRef}
          x1={C}
          y1={C}
          x2={C}
          y2={C - BASE_LEN}
          className={styles.hand}
        />
        <line x1={C} y1={C} x2={C} y2={C + TAIL} className={styles.tail} />
      </g>

      {/* pivot */}
      <circle className={styles.pivotRing} cx={C} cy={C} r={11} />
      <circle className={styles.pivot} cx={C} cy={C} r={5} />
    </svg>
  );
}
