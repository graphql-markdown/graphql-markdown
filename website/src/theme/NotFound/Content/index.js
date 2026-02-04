import React from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export default function NotFoundContent({ className }) {
  return (
    <main
      className={clsx("container margin-vert--xl", className)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        textAlign: "center",
      }}
    >
      <Heading as="h1" style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>
        <Translate
          id="theme.NotFound.title"
          description="The title of the 404 page"
        >
          404
        </Translate>
      </Heading>
      <Heading
        as="h2"
        style={{ marginBottom: "1.5rem", fontWeight: "normal" }}
      >
        <Translate
          id="theme.NotFound.p1"
          description="The first paragraph of the 404 page"
        >
          Page Not Found
        </Translate>
      </Heading>
      <p style={{ marginBottom: "2rem", maxWidth: "500px" }}>
        <Translate
          id="theme.NotFound.p2"
          description="The 2nd paragraph of the 404 page"
        >
          The page you are looking for does not exist or has been moved.
        </Translate>
      </p>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link
          className={clsx(
            "button button--primary button--lg margin-horiz--lg",
            styles.heroButton,
          )}
          to="/"
        >
          Go to Homepage
        </Link>
        <Link
          className={clsx(
            "button button--outline button--lg margin-horiz--lg",
            styles.heroButton,
            styles.heroButtonSecondary,
          )}
          to="/docs/intro"
        >
          Read the Docs
        </Link>
      </div>
      <div style={{ marginTop: "3rem" }}>
        <p style={{ fontSize: "0.9rem" }}>Looking for something specific?</p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <li>
            <Link to="/docs/get-started">Getting Started</Link>
          </li>
          <li>
            <Link to="/docs/configuration">Configuration</Link>
          </li>
          <li>
            <Link to="/api/">API Reference</Link>
          </li>
          <li>
            <Link to="/showcase">Showcase</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
