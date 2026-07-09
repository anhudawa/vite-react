import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { corrections, correctionsPolicy } from "@/data/corrections";
import { formatDate } from "@/lib/content";
import styles from "./standards.module.css";

export const metadata: Metadata = {
  title: "Editorial Standards",
  description:
    "How The Long Second works: what we check before we publish, how we handle what we don't know, the commercial firewall, and the corrections record.",
  alternates: { canonical: "/editorial-standards" },
};

export default function EditorialStandards() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Editorial Standards", path: "/editorial-standards" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Editorial Standards",
            url: `${site.url}/editorial-standards`,
            publisher: { "@type": "Organization", name: site.name, url: site.url },
          },
        ]}
      />
      <PageHeader
        index="—"
        kicker="How we work"
        title="Editorial Standards"
        intro="The whole asset here is trust. These are the rules that protect it — what we check, what we admit we don't know, and how we put it right when we get it wrong."
      />

      <div className={`container ${styles.prose}`}>
        <h2>What you can trust on the page</h2>
        <p>
          For every wrist we cover, we name three things: the watch, the nature of the
          relationship (did the athlete buy it, or are they paid to wear it), and how sure
          we are. We check a reference before it goes live. If it can&rsquo;t be stood up,
          it stays in the workshop — visible as a name we&rsquo;re still working on, not
          presented as fact.
        </p>

        <h2>When we don&rsquo;t know, we say so</h2>
        <p>
          The writer comes at watches as a fan and a student, not the final authority on
          watchmaking. So when a detail isn&rsquo;t certain, you&rsquo;ll read it as an
          account rather than a fact — &ldquo;I had to check this one,&rdquo; &ldquo;a
          reader put me right on this.&rdquo; We never bluff a spec to sound expert. Faking
          it would forfeit the only thing this brand actually has.
        </p>

        <h2>The commercial firewall</h2>
        <p>
          Reviews carry no commercial pressure on the verdict. Where a link earns a
          commission it is disclosed plainly, and the flaws go in regardless. We do not
          sell stock, and we never sell the verdict.
        </p>

        <h2>Corrections</h2>
        <p>{correctionsPolicy}</p>
        {corrections.length === 0 ? (
          <p className={styles.empty}>
            Nothing to correct yet. That won&rsquo;t hold forever — and when it happens,
            you&rsquo;ll see it here, dated, not quietly edited away.
          </p>
        ) : (
          <ul className={styles.log}>
            {corrections.map((c) => (
              <li key={c.id} className={styles.logItem}>
                <p className={styles.logMeta}>
                  {formatDate(c.date)} · {c.kind}
                </p>
                <p style={{ margin: 0, color: "var(--text)" }}>{c.subject}</p>
                <p style={{ margin: "0.4rem 0 0", color: "var(--text-dim)" }}>{c.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
