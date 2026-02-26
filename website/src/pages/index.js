import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--secondary", styles.heroBanner)}>
      <div className="container">
        <img
          className={clsx("hero", styles.heroImage)}
          src="/img/preview.svg"
          alt="GraphQL-Markdown documentation generator"
        />

        <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
          Customizable{" "}
          <span style={{ color: "#36c46f", whiteSpace: "nowrap" }}>
            Markdown + MDX
          </span>{" "}
          documentation for{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://graphql.org/"
          >
            <span style={{ color: "#e535ab" }}>GraphQL</span>
          </a>{" "}
          schemas.
        </p>

        <p className={clsx("hero__subtitle", styles.heroSubtitleSecondary)}>
          One{" "}
          <Link to="/docs/get-started" style={{ color: "#e535ab" }}>
            CLI
          </Link>{" "}
          to generate docs for{" "}
          <a href="/docs/advanced/integration-with-frameworks">
            <span style={{ color: "#36c46f" }}>any MDX framework</span>
          </a>
          .
        </p>

        <div className={clsx("margin-vert--lg", styles.buttons)}>
          <Link
            className={clsx(
              "button button--primary button--lg margin-horiz--lg",
              styles.heroButton,
            )}
            to="/docs/get-started"
          >
            Get started
          </Link>
          <Link
            className={clsx(
              "button button--outline button--lg margin-horiz--lg",
              styles.heroButton,
              styles.heroButtonSecondary,
            )}
            to="/docs/try-it"
          >
            Try it
          </Link>
        </div>
      </div>
    </header>
  );
}

function Thanks() {
  return (
    <div className="col col--6 col--offset-3 padding-bottom--xl">
      <div className="text--center">
        <h3 className="padding-bottom--md">Thanks to our contributors</h3>
        <a href="https://github.com/graphql-markdown/graphql-markdown/graphs/contributors">
          <img
            src="https://contrib.rocks/image?repo=graphql-markdown/graphql-markdown&columns=8"
            alt="contributors"
            width={540}
            height={200}
            loading="lazy"
          />
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  useDocusaurusContext(); // keep hook in case you rely on it later

  return (
    <Layout
      title="GraphQL-Markdown — GraphQL schema documentation generator"
      description="Generate human-friendly Markdown/MDX documentation from GraphQL schemas. Use the CLI to produce docs that integrate with any MDX framework."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <Thanks />
    </Layout>
  );
}
