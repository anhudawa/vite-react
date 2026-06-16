import Image from "next/image";
import styles from "./Figure.module.css";

/**
 * Art-directed image. Photography is brought into the brand's monochrome world —
 * a warm desaturation, fine grain, a sapphire edge of light — with a Fact-Block
 * register caption (subject + the watch, in mono). "natural" leaves the colour.
 */
export function Figure({
  src,
  alt,
  subject,
  watch,
  ratio = "5 / 6",
  treatment = "mono",
  priority = false,
  objectPosition,
  sizes = "(max-width: 900px) 100vw, 40vw",
  className = "",
}: {
  src: string;
  alt: string;
  subject?: string;
  watch?: string;
  ratio?: string;
  treatment?: "mono" | "natural";
  priority?: boolean;
  objectPosition?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={`${styles.figure} ${className}`}>
      <div
        className={`${styles.frame} grain-fine`}
        data-treatment={treatment}
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.img}
          style={objectPosition ? { objectPosition } : undefined}
        />
        <span className={styles.sheen} aria-hidden="true" />
      </div>
      {(subject || watch) && (
        <figcaption className={styles.cap}>
          {subject && (
            <span className={styles.subject}>
              <span className={styles.tick} aria-hidden="true" />
              {subject}
            </span>
          )}
          {watch && <span className={styles.watch}>{watch}</span>}
        </figcaption>
      )}
    </figure>
  );
}
