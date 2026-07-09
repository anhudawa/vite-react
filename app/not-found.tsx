import Link from "next/link";
import { Mark } from "@/components/Mark";
import { nav } from "@/lib/site";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <Mark size={64} className={styles.mark} />
        <p className={styles.code}>Error 404 · Drop</p>
        <h1 className={styles.title}>The spring ran out here.</h1>
        <p className={styles.dek}>
          This page never locked into the movement — a tooth slipped, the energy
          released into nothing. Nothing to read at this address. The mechanism is
          still beating everywhere else.
        </p>

        <nav className={styles.links} aria-label="Recover">
          <Link href="/" className={styles.home}>
            Back to the dial
          </Link>
          <ul className={styles.silos}>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
