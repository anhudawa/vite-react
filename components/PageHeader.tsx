import styles from "./PageHeader.module.css";

export function PageHeader({
  index,
  kicker,
  title,
  intro,
}: {
  index: string;
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.meta}>
          <span className={styles.index}>{index}</span>
          <span className={styles.kicker}>{kicker}</span>
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{intro}</p>
      </div>
    </header>
  );
}
