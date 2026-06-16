import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { site } from "@/lib/site";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Escapement is the insider's record of where serious athletes and fine watches meet — told by an athlete who fell down the rabbit hole, for the ones falling down it too.",
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHeader
        index="05"
        kicker="The brand"
        title="From the inside"
        intro="Not a dealer. Not a horology authority performing expertise. The credible voice on the one obsession an athlete and a watch share: time."
      />

      <div className={`container ${styles.body}`}>
        <div className={styles.portrait}>
          <Image
            src="/brand/founder-bone.png"
            alt={`${site.founder}, founder of Escapement`}
            width={328}
            height={508}
            sizes="(max-width: 760px) 60vw, 320px"
            priority
          />
          <p className={styles.caption}>
            {site.founder}
            <span aria-hidden="true"> · </span>founder
          </p>
        </div>

        <div className={styles.prose}>
          <p>
            The space where athletes and watches meet is not empty. It is full of
            shallow content, none of it from athletes. Strap retailers and dealers
            publish celebrity-watch listicles as a side activity, recycling the same
            fifteen names. They review the watch as an object. They have never buried
            themselves in the last five kilometres of a race, and it shows.
          </p>
          <p>
            Escapement takes the inside position. It is written by someone who came to
            watches the way most serious athletes do — sideways, through an obsession
            with time, with the measured release of a finite reserve, with the machine
            that meters effort against the clock. The same wiring that optimises a
            training block falls hard for a movement&rsquo;s beat rate.
          </p>

          <h2>What we promise</h2>
          <p>
            No dealer spin. No fake expertise. The truth about what is on the wrist —
            and why it is there. Every claim is sourced, the relationship logged as it
            actually is, and our confidence stated plainly. The accuracy is the whole
            point; it is the only thing the rest of the field does not have.
          </p>

          <h2>Why the name</h2>
          <p>
            An escapement is the mechanism at the heart of every mechanical watch — the
            part that releases the mainspring&rsquo;s stored energy in tiny, controlled
            beats. Without it, the spring would unwind in a single instant and time
            would mean nothing. It is also the breakaway, the solo effort off the
            front, the escape from the desk and the clock running on a career.
          </p>
          <p>
            We never explain it past that. The restraint is the brand.
          </p>

          <div className={styles.cta}>
            <Link href="/who-wears-what">See the reference →</Link>
            <Link href="/essays">Read the essays →</Link>
          </div>
        </div>
      </div>
    </>
  );
}
