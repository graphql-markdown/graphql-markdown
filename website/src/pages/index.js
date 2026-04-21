import { useState } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";
import useNpmDownloads from "@site/src/hooks/useNpmDownloads";
import showcaseData from "@site/src/data/showcase.json";

const SHOWCASE_NAMES = [
  "Mozilla",
  "IOTA",
  "Bitquery",
  "Browserless.io",
  "Aragon",
  "Sablier",
  "MONEI",
  "CivicEngine",
  "epilot",
  "Coral",
];

const MORE_COUNT =
  Math.floor((showcaseData.length - SHOWCASE_NAMES.length) / 10) * 10;

function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const cmd = "npm install @graphql-markdown/cli graphql";

  function handleCopy() {
    navigator.clipboard
      .writeText(cmd)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy install command to clipboard:", error);
      });
  }

  return (
    <div className={styles.installBlock}>
      <span className={styles.installPrompt}>$</span>
      <code className={styles.installCmd}>{cmd}</code>
      <button
        className={styles.copyBtn}
        onClick={handleCopy}
        aria-label="Copy install command"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

function HomepageHeader() {
  return (
    <header className={clsx("hero hero--secondary", styles.heroBanner)}>
      <div className="container">
        <h1 className={styles.heroTitle}>
          Turn any{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://graphql.org/"
            className={styles.accentPinkLink}
          >
            GraphQL
          </a>{" "}
          schema into beautiful docs
        </h1>

        <p className={styles.heroSubtitle}>
          One CLI to generate{" "}
          <span className={styles.accentGreen}>Markdown + MDX</span>{" "}
          documentation for{" "}
          <Link to="/docs/advanced/integration-with-frameworks">
            any MDX framework
          </Link>
          . Zero boilerplate.
        </p>

        <InstallCommand />

        <div className={clsx("margin-vert--md", styles.buttons)}>
          <Link
            className={clsx(
              "button button--primary button--lg",
              styles.heroButton,
            )}
            to="/docs/get-started"
          >
            Get started →
          </Link>
          <Link
            className={clsx(
              "button button--outline button--lg",
              styles.heroButton,
              styles.heroButtonSecondary,
            )}
            to="/docs/try-it"
          >
            Try it live
          </Link>
        </div>

        <img
          className={styles.heroImage}
          src="/img/preview.svg"
          alt="GraphQL-Markdown output: Markdown documentation generated from a GraphQL schema"
          width="1280"
          height="640"
          fetchpriority="high"
          decoding="async"
        />
      </div>
    </header>
  );
}

function TrustedBy() {
  const downloads = useNpmDownloads("@graphql-markdown/core");
  return (
    <div className={styles.trustedBy}>
      <span className={styles.trustedByLabel}>Trusted by teams at</span>
      <div className={styles.trustedByNames}>
        {SHOWCASE_NAMES.map((name) => (
          <span key={name} className={styles.trustedByChip}>
            {name}
          </span>
        ))}
        <Link to="/showcase" className={styles.trustedByMore}>
          +{MORE_COUNT} more
        </Link>
        <span className={styles.trustedBySep}>·</span>
        <a
          href="https://www.npmjs.com/package/@graphql-markdown/core"
          className={styles.downloadsChip}
          target="_blank"
          rel="noopener noreferrer"
        >
          {downloads} weekly downloads
        </a>
      </div>
    </div>
  );
}

function Thanks() {
  return (
    <div className="col col--6 col--offset-3 padding-bottom--xl">
      <div className="text--center">
        <h2 className="padding-bottom--md">Thanks to our contributors</h2>
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
  return (
    <Layout
      title="GraphQL-Markdown — GraphQL schema documentation generator"
      description="Auto-generate beautiful Markdown and MDX docs from any GraphQL schema. Open-source CLI with type cross-linking, custom directives, and Docusaurus integration. MIT licensed."
    >
      <HomepageHeader />
      <TrustedBy />
      <main>
        <HomepageFeatures />
      </main>
      <Thanks />
    </Layout>
  );
}
