import { Figure } from "./Figure";
import styles from "./PageHeader.module.css";

export function PageHeader({
  index,
  kicker,
  title,
  intro,
  image,
}: {
  index: string;
  kicker: string;
  title: string;
  intro: string;
  image?: {
    src: string;
    alt: string;
    subject?: string;
    watch?: string;
    ratio?: string;
    position?: string;
  };
}) {
  return (
    <header className={styles.header}>
      <div className={`container ${image ? styles.split : ""}`}>
        <div className={styles.text}>
          <div className={styles.meta}>
            <span className={styles.index}>{index}</span>
            <span className={styles.kicker}>{kicker}</span>
          </div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.intro}>{intro}</p>
        </div>
        {image && (
          <Figure
            src={image.src}
            alt={image.alt}
            subject={image.subject}
            watch={image.watch}
            ratio={image.ratio ?? "4 / 5"}
            objectPosition={image.position}
            sizes="(max-width: 900px) 100vw, 36vw"
            className={styles.image}
          />
        )}
      </div>
    </header>
  );
}
