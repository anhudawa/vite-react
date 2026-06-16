import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AuthorModule } from "@/components/AuthorModule";
import { JsonLd, authorPersonJsonLd, breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Long Second is watches, and the athletes who live by them — told by Anthony Walsh, a masters racer who knows exactly what a second can cost.",
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          authorPersonJsonLd(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <PageHeader
        index="—"
        kicker="The publication"
        title="The other version"
        intro="A named publication. The masthead leads; Anthony Walsh signs the work — watch coverage from someone who has actually buried himself in the red."
      />

      <div className={`container ${styles.body}`}>
        <div className={styles.prose}>
          <p className={styles.lead}>Not every second is the same length.</p>
          <p>The clock says they are. Your body knows better.</p>
          <p>
            The last kilometre. The final 200 metres. The breath you hold at the start
            line. In those moments a single second stretches out long enough to live a
            small lifetime inside.
          </p>
          <p>
            That&rsquo;s the long second. The one that matters.
          </p>
          <p>
            I spent years chasing it on a bike. Then I started reading about the machines
            built to measure it — and fell as hard for the watch as I ever did for the
            race.
          </p>
          <p>
            Most watch writing comes from people who&rsquo;ve never buried themselves in
            the red. They describe the object. They miss the feeling.
          </p>
          <p>This is the other version.</p>
          <p>
            Watches, and the athletes who live by them. Told by someone who knows exactly
            what a second can cost.
          </p>
          <p className={styles.sign}>— {site.author.name}</p>

          <div className={styles.cta}>
            <Link href="/who-wears-what">See the reference →</Link>
            <Link href="/essays">Read the essays →</Link>
          </div>
        </div>

        <div className={styles.author}>
          <AuthorModule heading="Who's writing" />
        </div>
      </div>
    </>
  );
}
