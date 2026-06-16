import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

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
  { name: "Newsreader", data: SERIF_EXT, weight: 400 as const, style: "normal" as const },
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

export function ogCard({
  kicker,
  title,
  footer = "The Long Second",
}: {
  kicker: string;
  title: string;
  footer?: string;
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
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: STEEL,
          }}
        >
          <span>{footer}</span>
          <span>Measured release.</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: OG_FONTS }
  );
}
