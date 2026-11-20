import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const HowItWorksSteps = [
  {
    step: "1",
    title: "Set up",
    description: (
      <>
        Scaffold a new Nuxt or Docusaurus site, or add the Docusaurus plugin or
        a formatter preset to your existing docs.
      </>
    ),
  },
  {
    step: "2",
    title: "Configure",
    description: (
      <>
        Point it at your schema: SDL files, an introspection endpoint, GraphQL
        Config, or a code-first TS/JS schema.
      </>
    ),
  },
  {
    step: "3",
    title: "Generate",
    description: (
      <>
        Run the CLI to get Markdown or MDX pages, ready for your docs site.{" "}
        <Link to="/docs/guides/other-frameworks">Choose a path →</Link>
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
        Point it at SDL files, an introspection endpoint, GraphQL Config, or a
        code-first schema, and get a page for every type and operation.
      </>
    ),
    checklist: [
      "Cross-linked types",
      "Deprecation notices",
      "Custom directive badges",
    ],
    cta: { label: "Get started →", to: "/docs/get-started" },
  },
  {
    title: "Output adapted for your docs ecosystem",
    Svg: require("@site/static/img/mdx.svg").default,
    description: (
      <>
        Generate Markdown or MDX. Formatter presets follow the conventions of
        Docusaurus, Nuxt, Hugo, MkDocs, and other targets.
      </>
    ),
    cta: {
      label: "Explore formatter presets →",
      to: "/docs/guides/other-frameworks",
    },
  },
  {
    title: "Free and open-source",
    Svg: require("@site/static/img/tree.svg").default,
    description: (
      <>
        MIT licensed and actively maintained. If it saves you time, consider{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://plant.treeware.earth/graphql-markdown/graphql-markdown"
        >
          planting a tree
        </a>
        .
      </>
    ),
    cta: {
      label: "View on GitHub →",
      href: "https://github.com/graphql-markdown/graphql-markdown",
    },
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

function Feature({ Svg, title, description, checklist, cta }) {
  return (
    <div className={clsx("col col--4", styles.featureCol)}>
      <div className={styles.featureCard}>
        <div className={styles.iconWrap}>
          <Svg className={styles.featureSvg} aria-hidden="true" />
        </div>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureText}>{description}</p>
        {checklist && (
          <ul className={styles.featureList}>
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {cta.to ? (
          <Link to={cta.to} className={styles.featureCta}>
            {cta.label}
          </Link>
        ) : (
          <a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.featureCta}
          >
            {cta.label}
          </a>
        )}
      </div>
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
