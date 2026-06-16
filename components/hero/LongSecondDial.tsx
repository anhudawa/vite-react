"use client";

import { useEffect, useRef } from "react";
import styles from "./LongSecondDial.module.css";

/* -----------------------------------------------------------------------------
   THE LONG SECOND — the hero, as a luxury object.
   A domed dark dial: brushed-steel chapter ring, applied metallic indices, a
   single elongated lume index at twelve, and a seconds hand that sweeps, then
   slows and glows through one dilated long second before it resolves. Rendered
   in SVG with real depth, metal and light — not a schematic.
----------------------------------------------------------------------------- */

const VB = 480;
const C = 240;
const RING_OUT = 206;
const RING_IN = 188;
const TICK_R = 184;
const IDX_OUT = 178;
const IDX_IN = 150;
const HAND_LEN = 150;
const HAND_OVER = 30; // subtle stretch through the long second
const TAIL = 52;
const REV_SECONDS = 16;
const W0 = (Math.PI * 2) / REV_SECONDS;
const SLOW_MIN = 0.06;
const SLOW_WINDOW = 0.4;

function smooth(x: number) {
  const c = Math.min(Math.max(x, 0), 1);
  return c * c * (3 - 2 * c);
}
function P(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

// fine minute track
const MINUTES = Array.from({ length: 60 }, (_, i) => {
  if (i % 5 === 0) return null;
  const [x1, y1] = P(TICK_R, i * 6);
  const [x2, y2] = P(TICK_R - 5, i * 6);
  return { x1, y1, x2, y2 };
}).filter(Boolean) as { x1: number; y1: number; x2: number; y2: number }[];

// applied metallic indices at the 5-minute marks (12 handled as the long second)
const INDICES = Array.from({ length: 12 }, (_, i) => i * 30).filter((d) => d !== 0);

// a fine sunburst, for life under the light
const SUN = Array.from({ length: 120 }, (_, i) => {
  const [x2, y2] = P(RING_IN - 2, i * 3);
  return { x2, y2 };
});

export function LongSecondDial() {
  const rootRef = useRef<SVGSVGElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const handPoly = useRef<SVGPolygonElement>(null);
  const tipGlow = useRef<SVGCircleElement>(null);
  const tipLume = useRef<SVGRectElement>(null);
  const idxGlow = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function fromTop(theta: number) {
      let d = theta % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      return d;
    }

    function place(theta: number) {
      const near = 1 - Math.min(Math.abs(fromTop(theta)) / SLOW_WINDOW, 1);
      const dil = smooth(near);
      const len = HAND_LEN + HAND_OVER * dil;
      const deg = (theta * 180) / Math.PI;
      handRef.current?.setAttribute("transform", `rotate(${deg.toFixed(2)} ${C} ${C})`);
      // re-point the tapered hand to the (stretched) tip
      handPoly.current?.setAttribute(
        "points",
        `${C - 3},${C} ${C + 3},${C} ${C + 1.4},${C - len} ${C - 1.4},${C - len}`
      );
      tipLume.current?.setAttribute("y", (C - len).toFixed(1));
      tipGlow.current?.setAttribute("cy", (C - len).toFixed(1));
      tipGlow.current?.setAttribute("opacity", (0.25 + dil * 0.75).toFixed(3));
      // the static long-second index breathes as the hand passes it
      idxGlow.current?.setAttribute("opacity", (0.3 + dil * 0.6).toFixed(3));
    }

    if (reduce) {
      place(0);
      return;
    }

    let theta = Math.PI * 0.78;
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
      ([e]) => {
        if (e.isIntersecting && !runningRef.current) {
          runningRef.current = true;
          last = performance.now();
          rafRef.current = requestAnimationFrame(frame);
        } else if (!e.isIntersecting && runningRef.current) {
          runningRef.current = false;
          cancelAnimationFrame(rafRef.current);
        }
      },
      { threshold: 0.05 }
    );
    if (rootRef.current) io.observe(rootRef.current);

    let ticking = false;
    function travel() {
      ticking = false;
      const svg = rootRef.current;
      if (!svg) return;
      const span = window.innerHeight * 0.9;
      const p = Math.min(Math.max(window.scrollY / span, 0), 1);
      svg.style.transform = `scale(${(1 + p * 0.1).toFixed(4)}) translateY(${(p * 2).toFixed(1)}%)`;
      svg.style.opacity = (1 - p * 0.55).toFixed(3);
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(travel);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    travel();

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const [lx, ly] = P(IDX_IN - 18, 0); // long index inner end (toward centre)

  return (
    <svg
      ref={rootRef}
      className={styles.svg}
      viewBox={`0 0 ${VB} ${VB}`}
      role="img"
      aria-label="A watch dial: the seconds hand sweeps, then slows and glows through a single long second at twelve before resolving."
    >
      <defs>
        <radialGradient id="dialBase" cx="50%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#23272d" />
          <stop offset="55%" stopColor="#15181c" />
          <stop offset="100%" stopColor="#0c0e10" />
        </radialGradient>
        <linearGradient id="steel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5f6469" />
          <stop offset="22%" stopColor="#cfd4d9" />
          <stop offset="42%" stopColor="#7c8186" />
          <stop offset="62%" stopColor="#eef1f4" />
          <stop offset="82%" stopColor="#787d82" />
          <stop offset="100%" stopColor="#565b60" />
        </linearGradient>
        <linearGradient id="handSteel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e7eaee" />
          <stop offset="50%" stopColor="#9aa0a5" />
          <stop offset="100%" stopColor="#5a5f64" />
        </linearGradient>
        <radialGradient id="cap" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#eef1f4" />
          <stop offset="45%" stopColor="#a4a9ae" />
          <stop offset="100%" stopColor="#4c5156" />
        </radialGradient>
        <radialGradient id="lumeRad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e6ff7a" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#d8f26a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#d8f26a" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id="glassSheen" cx="32%" cy="22%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vig" cx="50%" cy="42%" r="62%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
      </defs>

      {/* case rim — brushed steel */}
      <circle cx={C} cy={C} r={222} fill="none" stroke="url(#steel)" strokeWidth={10} />
      <circle cx={C} cy={C} r={216} fill="none" stroke="#0c0e10" strokeWidth={3} />

      {/* dial */}
      <circle cx={C} cy={C} r={213} fill="url(#dialBase)" />

      {/* sunburst — fine radial life */}
      <g stroke="#2b3036" strokeWidth={0.6} opacity={0.5}>
        {SUN.map((s, i) => (
          <line key={i} x1={C} y1={C} x2={s.x2} y2={s.y2} />
        ))}
      </g>

      {/* chapter ring — brushed metal band */}
      <circle cx={C} cy={C} r={(RING_OUT + RING_IN) / 2} fill="none" stroke="url(#steel)" strokeWidth={RING_OUT - RING_IN} opacity={0.9} />
      <circle cx={C} cy={C} r={RING_IN} fill="none" stroke="#0c0e10" strokeWidth={1.5} />
      <circle cx={C} cy={C} r={RING_OUT} fill="none" stroke="#0c0e10" strokeWidth={1.5} opacity={0.6} />

      {/* minute track */}
      <g stroke="#aeb3b8" strokeWidth={1} opacity={0.55}>
        {MINUTES.map((m, i) => (
          <line key={i} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} />
        ))}
      </g>

      {/* applied metallic indices */}
      {INDICES.map((deg) => {
        const [ox, oy] = P(IDX_OUT, deg);
        const [ix, iy] = P(IDX_IN, deg);
        return (
          <line
            key={deg}
            x1={ox}
            y1={oy}
            x2={ix}
            y2={iy}
            stroke="url(#steel)"
            strokeWidth={7}
            strokeLinecap="butt"
          />
        );
      })}

      {/* the long second — one elongated lume index at twelve */}
      <circle ref={idxGlow} cx={C} cy={P(IDX_OUT - 30, 0)[1]} r={40} fill="url(#lumeRad)" opacity={0.3} />
      <rect
        x={C - 5}
        y={ly}
        width={10}
        height={P(IDX_OUT, 0)[1] - ly}
        rx={2}
        fill="#d8f26a"
      />

      {/* seconds hand */}
      <g ref={handRef}>
        <circle ref={tipGlow} cx={C} cy={C - HAND_LEN} r={26} fill="url(#lumeRad)" opacity="0.25" />
        {/* counterweight */}
        <rect x={C - 4} y={C} width={8} height={TAIL} rx={4} fill="url(#handSteel)" />
        <circle cx={C} cy={C + TAIL - 6} r={9} fill="url(#handSteel)" stroke="#4c5156" strokeWidth={0.6} />
        {/* tapered blade */}
        <polygon ref={handPoly} points={`${C - 3},${C} ${C + 3},${C} ${C + 1.4},${C - HAND_LEN} ${C - 1.4},${C - HAND_LEN}`} fill="url(#handSteel)" />
        {/* lume tip */}
        <rect ref={tipLume} x={C - 2} y={C - HAND_LEN} width={4} height={30} rx={2} fill="#d8f26a" />
      </g>

      {/* polished centre cap */}
      <circle cx={C} cy={C} r={11} fill="url(#cap)" stroke="#3b4045" strokeWidth={0.8} />
      <circle cx={C} cy={C} r={3.4} fill="#2a2e33" />

      {/* glass: sapphire sheen + vignette */}
      <circle cx={C} cy={C} r={213} fill="url(#glassSheen)" pointerEvents="none" />
      <circle cx={C} cy={C} r={213} fill="url(#vig)" pointerEvents="none" />
    </svg>
  );
}
