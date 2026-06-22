import Image from "next/image";
import { site } from "@/lib/site";
import styles from "./AuthorModule.module.css";

/**
 * The author / E-E-A-T module — the recurring credibility block. Anthony as
 * athlete *and* watch obsessive, with credentials set in the technical mono to
 * echo the Fact Block. The proof behind the masthead, never louder than it.
 */
export function AuthorModule({ heading = "The byline" }: { heading?: string }) {
  const a = site.author;
  return (
    <aside className={styles.wrap} aria-label="About the author">
      <p className={styles.kicker}>{heading}</p>
      <div className={styles.inner}>
        <div className={styles.portraitFrame}>
          <Image
            src={a.portrait}
            alt={`${a.name}, founder of ${site.name}`}
            width={320}
            height={400}
            className={styles.portrait}
            sizes="(max-width: 720px) 40vw, 220px"
          />
        </div>

        <div className={styles.body}>
          <p className={styles.role}>
            {a.role} <span aria-hidden="true">·</span> Writes every word
          </p>
          <h3 className={styles.name}>{a.name}</h3>
          <p className={styles.bio}>{a.bio}</p>

          <dl className={styles.creds}>
            {a.credentials.map((c) => (
              <div key={c.label} className={styles.cred}>
                <dt>{c.label}</dt>
                <dd>{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  );
}
