import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--secondary', styles.heroBanner)}>
      <div className="container">
        <img src='/img/preview.svg' style={{height: "200px", width: "800px", objectFit: "cover"}} className="margin-bottom--lg" />
        <p className="hero__subtitle">
           <span style={{color: '#36c46f'}}>Human-friendly</span> documentation for <a target="_blank" rel="noopener noreferrer" href="https://graphql.org/"><span style={{color: "#e535ab"}}>GraphQL</span></a> schemas.
        </p>
        <p className="hero__subtitle">
            Powered by <a target="_blank" rel="noopener noreferrer" href="https://docusaurus.io"><span style={{color: "#36c46f"}}>Docusaurus</span></a>.
        </p>
        <div className={clsx('margin-vert--lg', styles.buttons)}>
          <Link
            className={clsx('button button--primary button--lg margin-horiz--lg', styles.heroButton)}
            to="/docs/get-started">
            Get started
          </Link>
          <Link
            className={clsx('button button--outline button--lg margin-horiz--lg', styles.heroButton, styles.heroButtonSecondary)}
            to="/docs/try-it">
            Try it
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
