import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Turn your schema into documentation",
    Svg: require("@site/static/img/website.svg").default,
    description: (
      <>
        GraphQL-Markdown is a Docusaurus plugin that transforms your GraphQL
        schemas into beautiful documentation without effort.
      </>
    ),
  },
  {
    title: "Powered by MDX",
    Svg: require("@site/static/img/mdx.svg").default,
    description: (
      <>
        Compatible with MDX, GraphQL-Markdown allows you to customize the look
        and feel of your documentation.
      </>
    ),
  },
  {
    title: "Treeware ♥ Open-source",
    Svg: require("@site/static/img/tree.svg").default,
    description: (
      <>
        GraphQL-Markdown packages are 100% free and open-source, under the MIT
        license.
        <br />
        If you use it in production, then we ask that you{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://plant.treeware.earth/graphql-markdown/graphql-markdown"
        >
          buy the world a tree
        </a>{" "}
        to thank us for our work.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <>
      <div
        className={clsx(
          "row margin-vert--lg padding-vert--lg",
          styles.heroButton,
          styles.feature,
        )}
      >
        <div className="col col--2 col--offset-2">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="col col--6 col--offset-1">
          <div className="text--left">
            <h3 className="padding-vert--md">{title}</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="column">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
