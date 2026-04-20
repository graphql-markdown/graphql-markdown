import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const HowItWorksSteps = [
  {
    step: "1",
    title: "Install",
    description: (
      <>
        Add GraphQL-Markdown to your project with a single npm command.
      </>
    ),
  },
  {
    step: "2",
    title: "Configure",
    description: (
      <>
        Point it at your schema — SDL file, introspection endpoint, or GraphQL config.
      </>
    ),
  },
  {
    step: "3",
    title: "Generate",
    description: (
      <>
        Run the CLI and get human-readable MDX docs, ready to publish.{" "}
        <Link to="/docs/get-started">See the guide →</Link>
      </>
    ),
  },
];

const FeatureList = [
  {
    title: "Schema-to-docs in seconds",
    Svg: require("@site/static/img/website.svg").default,
    description: (
      <>
        Supports SDL files, introspection endpoints, and GraphQL config. Type
        cross-linking, deprecation notices, and custom directive badges —
        included out of the box.{" "}
        <Link to="/docs/get-started" className={styles.inlineCta}>
          Get started →
        </Link>
      </>
    ),
  },
  {
    title: "MDX output, any framework",
    Svg: require("@site/static/img/mdx.svg").default,
    description: (
      <>
        Output is plain MDX — keep your existing theme, navigation, and search.
        Works with Docusaurus, Astro, Next.js, and{" "}
        <Link to="/docs/advanced/integration-with-frameworks">
          any MDX framework
        </Link>
        . Zero framework lock-in.
      </>
    ),
  },
  {
    title: "Free and open-source",
    Svg: require("@site/static/img/tree.svg").default,
    description: (
      <>
        MIT licensed and actively maintained. Used in production by teams
        worldwide. If it saves you time, consider{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://plant.treeware.earth/graphql-markdown/graphql-markdown"
        >
          planting a tree
        </a>{" "}
        to support the project.
      </>
    ),
  },
];

function Step({ step, title, description }) {
  return (
    <div className={clsx("col col--4", styles.stepCard)}>
      <div className={styles.stepNumber}>{step}</div>
      <h3 className={styles.stepTitle}>{title}</h3>
      <p className={styles.stepDescription}>{description}</p>
    </div>
  );
}

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4", styles.featureCard)}>
      <div className={styles.iconWrap}>
        <Svg className={styles.featureSvg} role="img" aria-label={title} />
      </div>
      <h2 className={styles.featureTitle}>{title}</h2>
      <p className={styles.featureText}>{description}</p>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      <section className={styles.howItWorks}>
        <div className="container">
          <h2 className={styles.sectionHeading}>How it works</h2>
          <div className="row">
            {HowItWorksSteps.map((props, idx) => (
              <Step key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionHeading}>Why GraphQL-Markdown?</h2>
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
