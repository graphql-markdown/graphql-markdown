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
          alt=""
        />
        <p className="hero__subtitle">
          <span style={{ color: "#36c46f" }}>Flexible</span> documentation for{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://graphql.org/"
          >
            <span style={{ color: "#e535ab" }}>GraphQL</span>
          </a>{" "}
          schemas.
        </p>
        <div className="hero__subtitle">
          Supporting multiple frameworks:
          <div className={styles.frameworkLinks}>
            <a
              href="/docs/docusaurus"
              className={styles.frameworkLink}
            >
              <img src="/img/docusaurus.svg" alt="Docusaurus" height="30" />
              <span>Docusaurus</span>
            </a>
            <a
              href="/docs/mkdocs"
              className={styles.frameworkLink}
            >
              <img src="/img/mkdocs.svg" alt="MkDocs" height="30" />
              <span>MkDocs</span>
            </a>
          </div>
        </div>
        <p className="hero__subtitle">
          Powered by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docusaurus.io"
          >
            <span style={{ color: "#36c46f" }}>Docusaurus</span>
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
          />
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <Thanks />
    </Layout>
  );
}
