import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./accessibility.module.css";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "The standard this site is built to, what is actually in place, how it gets tested, and where to say so when something fails you.",
};

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Accessibility", path: "/accessibility" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="Built to be read"
        title="Accessibility"
        intro="This site is built and tested against WCAG 2.2 AA. A publication about reading time off a dial should be readable by everyone, on whatever terms they read."
      />

      <div className={`container ${styles.prose}`}>
        <h2>The standard</h2>
        <p>
          WCAG 2.2 at level AA is the bar we aim at. It covers the practical things:
          whether a screen reader can map the page, whether a keyboard alone can reach
          everything, whether the text holds enough contrast to read at a glance. Where
          a page falls short of that bar, we treat it as a defect — the same as a broken
          link or a wrong reference number.
        </p>

        <h2>What is in place</h2>
        <ul>
          <li>
            Semantic landmarks on every page — header, navigation, main, footer — with
            headings in order, so assistive technology gets the same structure the eye
            does.
          </li>
          <li>
            Full keyboard navigation, with a visible focus indicator and a skip link
            that jumps past the header straight to the content.
          </li>
          <li>
            Both colour themes, light and dark, run on contrast tokens verified against
            the AA thresholds.
          </li>
          <li>
            The hero respects your reduced-motion setting: turn it on and the animation
            holds a still frame.
          </li>
          <li>
            Photography carries written alt text — what the image shows, watch and
            wrist, described rather than left blank.
          </li>
        </ul>

        <h2>How it is tested</h2>
        <p>
          Automated axe sweeps run across representative pages, in both themes, as part
          of the test suite; a change that introduces a violation fails the build.
          Manual keyboard passes back that up — tabbing each template end to end,
          checking that focus lands where the eye expects and never disappears. All of
          that is our own testing, honestly described: there has been no formal
          certification and no external audit, and this page claims neither.
        </p>

        <h2>If something fails you</h2>
        <p>
          If a page fights your screen reader, traps your keyboard, hides its focus, or
          is simply harder for you than it should be, tell us — the quickest route is a
          reply to any dispatch. Reports like that get read, and what they describe gets
          fixed.
        </p>
      </div>
    </>
  );
}
