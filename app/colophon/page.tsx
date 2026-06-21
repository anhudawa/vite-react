import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FactBlock } from "@/components/FactBlock";
import { Mark, Wordmark } from "@/components/Mark";
import { publishedAthletes, renderableFacts } from "@/data/athletes";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./colophon.module.css";

export const metadata: Metadata = {
  title: "Colophon",
  description:
    "The Long Second's design system, shown live: colour, the three type voices, the Fact Block, the mark, and the rules that hold them together.",
};

const COLOURS = [
  { name: "Movement Black", hex: "#16181B", role: "Base ink, the dial, dark backgrounds", varName: "--movement-black" },
  { name: "Graphite", hex: "#2A2D31", role: "Raised surfaces, cards, depth", varName: "--graphite" },
  { name: "Steel", hex: "#8B9095", role: "Secondary text, hairlines, the brushed register", varName: "--steel" },
  { name: "Bone", hex: "#F2EEE6", role: "Warm paper, light mode, long-form reading", varName: "--bone" },
  { name: "Lume", hex: "#C2D24A", role: "Accent (print). Used rarely — scarcity is its power", varName: "--lume" },
  { name: "Lume Glow", hex: "#D8F26A", role: "Accent (digital). The glow in the dark", varName: "--lume-glow" },
  { name: "Brass", hex: "#9E8455", role: "Physical touches only — foil, hardware. Almost never on screen", varName: "--brass" },
];

const VOICES = [
  {
    name: "Grotesque",
    spec: "Schibsted Grotesk (web) / Suisse Int'l · Söhne (licensed)",
    role: "UI, body, navigation — the everyday workhorse.",
    sample: "Precise, not clinical. Engineered, with a pulse.",
    cls: styles.grotesque,
  },
  {
    name: "Editorial serif",
    spec: "Newsreader (web) / GT Sectra · Canela (licensed)",
    role: "The masthead, headlines and essays — the voice.",
    sample: "Not every second is the same length.",
    cls: styles.serif,
  },
  {
    name: "Technical mono",
    spec: "IBM Plex Mono (web) / Monument Mono (licensed)",
    role: "Specs, references, the Fact Block — the engineered detail.",
    sample: "RM 67-02 · 4 Hz · lock → impulse → drop",
    cls: styles.mono,
  },
];

const SCALE = [
  { label: "Display", token: "--t-display", cls: styles.sDisplay },
  { label: "H1", token: "--t-h1", cls: styles.sH1 },
  { label: "H2", token: "--t-h2", cls: styles.sH2 },
  { label: "H3", token: "--t-h3", cls: styles.sH3 },
  { label: "Lead", token: "--t-lead", cls: styles.sLead },
  { label: "Body", token: "--t-body", cls: styles.sBody },
];

export default function ColophonPage() {
  const fact = renderableFacts(publishedAthletes()[0])[0];

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Colophon", path: "/colophon" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="The system"
        title="Colophon"
        intro="The identity, shown as it is built — every value a design token, nothing invented at the edges. This page is itself made of the system it documents."
      />

      {/* COLOUR */}
      <section className={`container ${styles.section}`} aria-labelledby="c-colour">
        <h2 id="c-colour" className={styles.h}>
          Colour
        </h2>
        <p className={styles.lede}>
          Deep restraint, one signature accent. The Lume is allowed exactly one precise
          hit at a time; everything else is ink, steel and paper.
        </p>
        <ul className={styles.swatches}>
          {COLOURS.map((c) => (
            <li key={c.hex} className={styles.swatch}>
              <span
                className={styles.chip}
                style={{ background: c.hex }}
                aria-hidden="true"
              />
              <span className={styles.swatchName}>{c.name}</span>
              <span className={styles.swatchHex}>{c.hex}</span>
              <span className={styles.swatchRole}>{c.role}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* TYPE */}
      <section className={`container ${styles.section}`} aria-labelledby="c-type">
        <h2 id="c-type" className={styles.h}>
          Three voices, never more
        </h2>
        <ul className={styles.voices}>
          {VOICES.map((v) => (
            <li key={v.name} className={styles.voice}>
              <div className={styles.voiceMeta}>
                <span className={styles.voiceName}>{v.name}</span>
                <span className={styles.voiceSpec}>{v.spec}</span>
                <span className={styles.voiceRole}>{v.role}</span>
              </div>
              <p className={v.cls}>{v.sample}</p>
            </li>
          ))}
        </ul>

        <div className={styles.scale}>
          <p className={styles.scaleLabel}>Type scale</p>
          {SCALE.map((s) => (
            <div key={s.label} className={styles.scaleRow}>
              <span className={styles.scaleTag}>{s.label}</span>
              <span className={s.cls}>Measured release</span>
              <code className={styles.scaleToken}>{s.token}</code>
            </div>
          ))}
        </div>
      </section>

      {/* THE FACT BLOCK */}
      <section className={`container ${styles.section}`} aria-labelledby="c-fact">
        <h2 id="c-fact" className={styles.h}>
          The Fact Block
        </h2>
        <p className={styles.lede}>
          The credibility signature — a spec plate on a movement. It renders only when its
          claim has been fully verified.
        </p>
        <div className={styles.factDemo}>
          <FactBlock fact={fact} as="div" />
        </div>
      </section>

      {/* THE MARK */}
      <section className={`container ${styles.section}`} aria-labelledby="c-mark">
        <h2 id="c-mark" className={styles.h}>
          The mark
        </h2>
        <p className={styles.lede}>
          The elongated second: a track of sixty even ticks with one index stretched
          long and overshooting, in lume. The name, drawn — and legible to 16px.
        </p>
        <div className={styles.markRow}>
          <div className={styles.markCell}>
            <Mark size={88} />
            <span className={styles.markCap}>Standalone mark</span>
          </div>
          <div className={styles.markCell}>
            <Wordmark withMark />
            <span className={styles.markCap}>Primary lockup</span>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className={`container ${styles.section}`} aria-labelledby="c-rules">
        <h2 id="c-rules" className={styles.h}>
          The rules that hold it together
        </h2>
        <ul className={styles.rules}>
          <li>Lead with restraint and white space. Leave things out.</li>
          <li>Treat precision as the aesthetic — engineered, exact, considered.</li>
          <li>Keep the Lume rare. One precise hit; never as body text.</li>
          <li>Never more than three type voices, never colour beyond the system.</li>
          <li>Motion is mechanical and purposeful, and yields to reduced-motion.</li>
          <li>
            Make the Fact Block beautiful and consistent — and never let a claim render
            until it has been{" "}
            <a href="/verification" className={styles.inlineLink}>
              fully verified
            </a>
            .
          </li>
        </ul>
      </section>
    </>
  );
}
