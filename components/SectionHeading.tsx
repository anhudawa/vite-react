import styles from "./SectionHeading.module.css";

export function SectionHeading({
  index,
  kicker,
  title,
  children,
}: {
  index?: string;
  kicker: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        {index && <span className={styles.index}>{index}</span>}
        <span className={styles.kicker}>{kicker}</span>
      </div>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children && <div className={styles.lede}>{children}</div>}
    </div>
  );
}
