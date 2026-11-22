import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

// The README gallery screenshots (.github/assets/demos), bundled by webpack so
// there is a single copy of each image.
const screenshotUrl = (name) =>
  require(`../../../../.github/assets/demos/${name}.jpg`).default;

/**
 * One demo on the "Try it" page: the section's Markdown (heading, live demo,
 * sandbox, repository, config file) with the demo's screenshot to its right,
 * top-aligned with the heading and linked to the live demo.
 */
const DemoCard = ({ name, screenshot, live, children }) => (
  <div className={styles.demo}>
    <div className={styles.body}>{children}</div>
    <Link href={live} className={styles.shot}>
      <img
        src={screenshotUrl(screenshot)}
        alt={`${name} live demo`}
        width={1280}
        height={800}
        loading="lazy"
        decoding="async"
      />
    </Link>
  </div>
);

export default DemoCard;
