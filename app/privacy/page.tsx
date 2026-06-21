import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./privacy.module.css";

// Founder to confirm the public contact address before launch.
const CONTACT_EMAIL = "hello@thelongsecond.com";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What we collect when you subscribe, why, and the control you keep over it. Short, plain, and honest.",
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="The small print, in plain words"
        title="Privacy"
        intro="The short version: we collect your email so we can send you the newsletter, we tag where you signed up so it stays relevant, and we never sell any of it. The longer version is below."
      />

      <div className={`container ${styles.prose}`}>
        <h2>What we collect</h2>
        <p>
          Your email address, and a little context about where you subscribed — which
          page or, if you took the quiz, your sport, budget band, and the watch profile
          it gave you. That context is used for one thing: to send you email that fits,
          rather than email that doesn’t.
        </p>

        <h2>Why we collect it, and the legal basis</h2>
        <p>
          We process this on the basis of your consent, given when you tick the box and
          subscribe. You can withdraw it at any time, and withdrawing is as easy as
          giving it — every email has a one-click unsubscribe.
        </p>

        <h2>Who handles it</h2>
        <p>
          Our newsletter runs on{" "}
          <a href="https://www.beehiiv.com/privacy" rel="nofollow noreferrer" target="_blank">
            beehiiv
          </a>
          , which stores the subscriber list and sends the email on our behalf. Your
          address is shared with beehiiv for that purpose and no other. We don’t sell,
          rent, or trade your data to anyone, for anything.
        </p>

        <h2>How long we keep it</h2>
        <p>
          For as long as you’re subscribed. Unsubscribe and you’re removed from the active
          list; ask us to delete you entirely and we will.
        </p>

        <h2>Your rights</h2>
        <p>
          The publisher is based in the EU, and we extend the same rights to everyone
          regardless of where they live: you can ask to see the data we hold on you,
          correct it, export it, or have it erased. Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we’ll sort it.
        </p>

        <h2>Cookies and tracking</h2>
        <p>
          We keep a small marker in your browser so the newsletter pop-up doesn’t pester
          you twice in a session, and so the quiz can remember your progress if you
          refresh. That’s local to your device and isn’t used to follow you around the
          web.
        </p>

        <p className={styles.updated}>Last updated 21 June 2026.</p>
      </div>
    </>
  );
}
