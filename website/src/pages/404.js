import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function NotFound() {
  return (
    <Layout
      title="Page Not Found"
      description="The page you're looking for doesn't exist."
    >
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>404</h1>
        <h2 style={{ marginBottom: "1.5rem", fontWeight: "normal" }}>
          Page Not Found
        </h2>
        <p style={{ marginBottom: "2rem", maxWidth: "500px", color: "#666" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link className="button button--primary button--lg" to="/">
            Go to Homepage
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Read the Docs
          </Link>
        </div>
        <div style={{ marginTop: "3rem" }}>
          <p style={{ color: "#999", fontSize: "0.9rem" }}>
            Looking for something specific? Try these:
          </p>
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
    </Layout>
  );
}
