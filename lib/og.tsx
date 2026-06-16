import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Brand fonts for the card (Satori takes WOFF/TTF, not WOFF2). Read once at
// module load. Fraunces carries the title (latin + latin-ext for names like
// "Pogačar"); IBM Plex Mono carries the uppercase labels.
const fontDir = join(process.cwd(), "lib/og-fonts");
const FRAUNCES = readFileSync(join(fontDir, "Fraunces-400.woff"));
const FRAUNCES_EXT = readFileSync(join(fontDir, "Fraunces-400-ext.woff"));
const PLEX_MONO = readFileSync(join(fontDir, "PlexMono-500.woff"));

const OG_FONTS = [
  { name: "Fraunces", data: FRAUNCES, weight: 400 as const, style: "normal" as const },
  { name: "Fraunces", data: FRAUNCES_EXT, weight: 400 as const, style: "normal" as const },
  { name: "Plex Mono", data: PLEX_MONO, weight: 500 as const, style: "normal" as const },
];

const INK = "#16181B";
const BONE = "#F2EEE6";
const STEEL = "#8B9095";
const LUME = "#D8F26A";

// Escape-wheel + pallet-fork glyph (same geometry as components/Mark.tsx).
const WHEEL_D =
  "M51.98 27.06 L55.98 35.73 L61.62 37.86 L67.06 31.75 L66.58 41.29 L70.57 45.80 L78.23 42.92 L73.38 51.13 L74.82 56.99 L82.94 57.99 L74.82 63.01 L73.38 68.87 L80.10 73.53 L70.57 74.20 L66.58 78.71 L70.36 85.97 L61.62 82.14 L55.98 84.27 L55.96 92.46 L50.00 85.00 L44.02 84.27 L40.20 91.51 L38.38 82.14 L33.42 78.71 L26.68 83.34 L29.43 74.20 L26.62 68.87 L18.50 69.83 L25.18 63.01 L25.18 56.99 L17.54 54.07 L26.62 51.13 L29.43 45.80 L24.01 39.66 L33.42 41.29 L38.38 37.86 L36.44 29.91 L44.02 35.73 L50.00 35.00 Z";

function GlyphMark({ size = 96, color = BONE }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d={WHEEL_D} />
      <circle cx={50} cy={60} r={6} />
      <path d="M50 8 L50 22" />
      <path d="M50 22 L31 41 L37 47" />
      <path d="M50 22 L69 41 L63 47" />
      <circle cx={50} cy={20} r={3.4} fill={color} stroke="none" />
    </svg>
  );
}

export function ogCard({
  kicker,
  title,
  footer = "Escapement",
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
          <div
            style={{
              fontSize: 22,
              letterSpacing: 11,
              textTransform: "uppercase",
              color: BONE,
            }}
          >
            ESCAPEMENT
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
              fontFamily: "Fraunces",
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
