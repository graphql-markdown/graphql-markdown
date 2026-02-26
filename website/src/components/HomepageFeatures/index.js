import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Generate docs from your GraphQL schema",
    Svg: require("@site/static/img/website.svg").default,
    description: (
      <>
        GraphQL-Markdown is a command-line tool and JS/TS library that turns
        your GraphQL schema into readable documentation pages in seconds.{" "}
        <Link to="/docs/get-started" className={styles.inlineCta}>
          Get started →
        </Link>
      </>
    ),
  },
  {
    title: "MDX output, framework-agnostic",
    Svg: require("@site/static/img/mdx.svg").default,
    description: (
      <>
        Output in MDX so you can use your existing components, styling, and
        theme—compatible with any MDX framework.{" "}
        <Link
          to="/docs/advanced/integration-with-frameworks"
          className={styles.inlineCta}
        >
          Learn more →
        </Link>
      </>
    ),
  },
  {
    title: "Open-source, MIT-licensed",
    Svg: require("@site/static/img/tree.svg").default,
    description: (
      <>
        GraphQL-Markdown is free and open-source under the MIT license.
        <br />
        If you use it in production, consider{" "}
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

function Feature({ Svg, title, description }) {
  return (
    <article className={clsx("row", styles.featureRow)}>
      <div className={clsx("col col--3", styles.iconCol)}>
        <Svg className={styles.featureSvg} role="img" aria-label={title} />
      </div>

      <div className="col col--9">
        <div className="text--left">
          <h3 className={styles.featureTitle}>{title}</h3>
          <p className={styles.featureText}>{description}</p>
        </div>
      </div>
    </article>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
