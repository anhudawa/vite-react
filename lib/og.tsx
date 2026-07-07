import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";
import type { Pillar } from "./content";
import { PILLARS } from "./pillars";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Brand fonts for the card (Satori takes WOFF/TTF, not WOFF2). Read once at
// module load. Newsreader carries the masthead/title (latin + latin-ext for
// names like "Pogačar"); IBM Plex Mono carries the uppercase labels.
const fontDir = join(process.cwd(), "lib/og-fonts");
const SERIF = readFileSync(join(fontDir, "Newsreader-400.woff"));
const SERIF_EXT = readFileSync(join(fontDir, "Newsreader-400-ext.woff"));
const PLEX_MONO = readFileSync(join(fontDir, "PlexMono-500.woff"));

const OG_FONTS = [
  { name: "Newsreader", data: SERIF, weight: 400 as const, style: "normal" as const },
  // Registered under its own family name: Satori keys fonts by name+weight+style,
  // so a second "Newsreader" entry is shadowed by the first and its glyphs never
  // load — "č" in Pogačar fell through to the bundled default sans. A distinct
  // name keeps the subset in the per-glyph fallback chain.
  { name: "Newsreader Latin Ext", data: SERIF_EXT, weight: 400 as const, style: "normal" as const },
  { name: "Plex Mono", data: PLEX_MONO, weight: 500 as const, style: "normal" as const },
];

const INK = "#16181B";
const BONE = "#F2EEE6";
const STEEL = "#8B9095";
const LUME = "#D8F26A";

// The Elongated Second glyph (matches components/Mark.tsx): a seconds track with
// one long lume index overshooting at twelve.
function GlyphMark({ size = 96 }: { size?: number }) {
  const ticks = [];
  for (let i = 1; i < 60; i += 5) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const len = 6;
    ticks.push(
      <line
        key={i}
        x1={(50 + (38 - len) * Math.cos(a)).toFixed(2)}
        y1={(50 + (38 - len) * Math.sin(a)).toFixed(2)}
        x2={(50 + 38 * Math.cos(a)).toFixed(2)}
        y2={(50 + 38 * Math.sin(a)).toFixed(2)}
        stroke={STEEL}
        strokeWidth={2.4}
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" strokeLinecap="round">
      <circle cx={50} cy={50} r={38} stroke={STEEL} strokeWidth={1.2} opacity={0.4} />
      {ticks}
      <line x1={50} y1={50} x2={50} y2={6} stroke={LUME} strokeWidth={6} />
      <line x1={50} y1={50} x2={50} y2={60} stroke={LUME} strokeWidth={6} />
      <circle cx={50} cy={50} r={4.5} fill={LUME} />
    </svg>
  );
}

// --- Per-pillar motifs -------------------------------------------------------
// One quiet mark per hub, seated in the footer beside the pillar name. All of
// them sit in STEEL hairlines on the movement-black ground; only the sweep
// hand's tip borrows a sliver of lume. They differentiate — they don't shout.

const MOTIF_SIZE = 44;

/** Mechanical — a hairline escape-wheel arc: an open toothed wheel segment. */
function EscapeWheelArc() {
  const c = 20;
  const r = 14;
  const pt = (deg: number, radius: number) => ({
    x: +(c + radius * Math.cos((deg * Math.PI) / 180)).toFixed(2),
    y: +(c + radius * Math.sin((deg * Math.PI) / 180)).toFixed(2),
  });
  // Arc sweeps clockwise from 130° through the top to 50°, leaving the gap at
  // the bottom — the wheel escaping the frame.
  const a = pt(130, r);
  const b = pt(50, r);
  const teeth = [];
  for (let deg = 150; deg <= 390; deg += 24) {
    const inner = pt(deg, r);
    const outer = pt(deg, r + 3.5);
    teeth.push(
      <line key={deg} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} strokeWidth={1.2} />
    );
  }
  return (
    <svg
      width={MOTIF_SIZE}
      height={MOTIF_SIZE}
      viewBox="0 0 40 40"
      fill="none"
      stroke={STEEL}
      strokeLinecap="round"
    >
      <path d={`M ${a.x} ${a.y} A ${r} ${r} 0 1 1 ${b.x} ${b.y}`} strokeWidth={1} />
      {teeth}
      <circle cx={c} cy={c} r={2} strokeWidth={1} />
    </svg>
  );
}

/** Instrument — a sweep-hand tick caught mid-lap, lume only at the very tip. */
function SweepHandTick() {
  return (
    <svg width={MOTIF_SIZE} height={MOTIF_SIZE} viewBox="0 0 40 40" fill="none" strokeLinecap="round">
      {/* minimal chapter: ticks at 12 / 3 / 6 / 9 */}
      <line x1={20} y1={3} x2={20} y2={7} stroke={STEEL} strokeWidth={1.2} />
      <line x1={37} y1={20} x2={33} y2={20} stroke={STEEL} strokeWidth={1.2} />
      <line x1={20} y1={37} x2={20} y2={33} stroke={STEEL} strokeWidth={1.2} />
      <line x1={3} y1={20} x2={7} y2={20} stroke={STEEL} strokeWidth={1.2} />
      {/* the hand, sweeping past one o'clock; counterweight behind the pivot */}
      <line x1={15.5} y1={27.79} x2={26.75} y2={8.31} stroke={STEEL} strokeWidth={1.5} />
      <line x1={26.75} y1={8.31} x2={28.25} y2={5.71} stroke={LUME} strokeWidth={2.2} />
      <circle cx={20} cy={20} r={2} fill={STEEL} />
    </svg>
  );
}

/** Heritage — a date-stamp window, the day framed in a mono block. */
function DateStamp({ date }: { date?: string }) {
  const parsed = date ? new Date(date) : undefined;
  const day =
    parsed && !Number.isNaN(parsed.getTime())
      ? String(parsed.getUTCDate()).padStart(2, "0")
      : "31";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1.5px solid ${STEEL}`,
        padding: "3px 10px",
        fontSize: 20,
        letterSpacing: 3,
        color: BONE,
      }}
    >
      {day}
    </div>
  );
}

/** Owning — a strap threaded through its keeper loop. */
function StrapLoop() {
  return (
    <svg width={MOTIF_SIZE} height={MOTIF_SIZE} viewBox="0 0 40 40" fill="none" stroke={STEEL} strokeLinecap="round">
      {/* strap edges running through */}
      <line x1={14} y1={3} x2={14} y2={37} strokeWidth={1.2} />
      <line x1={26} y1={3} x2={26} y2={37} strokeWidth={1.2} />
      {/* the keeper */}
      <rect x={9} y={14.5} width={22} height={11} rx={3.5} strokeWidth={1.5} />
    </svg>
  );
}

/** Dispatch — a postmark: double ring, cancellation lines through the middle. */
function DispatchStamp() {
  return (
    <svg width={MOTIF_SIZE} height={MOTIF_SIZE} viewBox="0 0 40 40" fill="none" stroke={STEEL} strokeLinecap="round">
      <circle cx={20} cy={20} r={15} strokeWidth={1.2} />
      <circle cx={20} cy={20} r={11} strokeWidth={1} strokeDasharray="2 3" />
      <line x1={15} y1={17} x2={25} y2={17} strokeWidth={1.2} />
      <line x1={13} y1={20.5} x2={27} y2={20.5} strokeWidth={1.2} />
      <line x1={15} y1={24} x2={25} y2={24} strokeWidth={1.2} />
    </svg>
  );
}

function PillarMotif({ pillar, date }: { pillar: Pillar; date?: string }) {
  switch (pillar) {
    case "mechanical":
      return <EscapeWheelArc />;
    case "instrument":
      return <SweepHandTick />;
    case "heritage":
      return <DateStamp date={date} />;
    case "owning":
      return <StrapLoop />;
    case "dispatch":
      return <DispatchStamp />;
  }
}

export function ogCard({
  kicker,
  title,
  footer = "The Long Second",
  pillar,
  date,
}: {
  kicker: string;
  title: string;
  footer?: string;
  /** Pillar hub — adds the hub's quiet motif and mono small-caps name. */
  pillar?: Pillar;
  /** ISO date; feeds the heritage date-stamp window. */
  date?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          color: BONE,
          padding: "72px 80px",
          fontFamily: "Plex Mono",
          // a faint dial seam down the left, echoing the Fact Block
          borderLeft: `10px solid ${LUME}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Newsreader",
                fontSize: 40,
                letterSpacing: 1,
                color: BONE,
              }}
            >
              The Long Second
            </div>
            <div
              style={{
                fontSize: 16,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: STEEL,
                marginTop: 6,
              }}
            >
              By Anthony Walsh
            </div>
          </div>
          <GlyphMark size={84} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: LUME,
              marginBottom: 28,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              fontFamily: "Newsreader",
              fontSize: title.length > 48 ? 66 : 84,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 980,
              color: BONE,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: STEEL,
          }}
        >
          <span>{footer}</span>
          {pillar ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <PillarMotif pillar={pillar} date={date} />
              <span>{PILLARS[pillar].short}</span>
            </div>
          ) : (
            <span>Measured release.</span>
          )}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: OG_FONTS }
  );
}
