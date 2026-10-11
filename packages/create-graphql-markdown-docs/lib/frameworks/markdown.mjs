import fs from "node:fs";
import path from "node:path";

import { writeGraphqlrc } from "../rewrites/graphqlrc.mjs";
import { findIndentedLine } from "../rewrites/lines.mjs";

const MDX_FORMATTER = "@graphql-markdown/formatters/mdx";
// Must match the @graphql-markdown/formatters release that ships `./mdx`.
const FORMATTERS_RANGE = "^1.2.0";

/** Adds the mdx formatter to .graphqlrc, right before the `loaders:` line. */
export function writeMdxFormatter(tempDir) {
  const graphqlrcPath = path.join(tempDir, ".graphqlrc");
  const content = fs.readFileSync(graphqlrcPath, "utf-8");
  const found = findIndentedLine(content, "loaders:");
  if (!found) {
    throw new Error(
      `Expected to find "loaders:" in ${graphqlrcPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }
  const { line, indent } = found;
  fs.writeFileSync(
    graphqlrcPath,
    content.replace(
      line,
      () => `${indent}formatter: '${MDX_FORMATTER}'\n${line}`,
    ),
  );

  const pkgPath = path.join(tempDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.dependencies["@graphql-markdown/formatters"] = FORMATTERS_RANGE;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

const nextSteps = ({ outputDir }) =>
  `Point your site navigation at \`${outputDir}\`. Manual wiring guide: https://graphql-markdown.dev`;

/** Plain Markdown scaffold descriptor (templates/markdown). */
export const markdown = {
  id: "markdown",
  name: "Markdown",
  label: "Markdown (plain .md files)",
  hint: "No site — just Markdown files in docs/",
  links: "relative",
  contentRoot: "docs",
  nextSteps,
  scaffold: {
    template: "markdown",
    runScripts: ["doc"],
    copyExcludes: [],
    supportsColor: false,
    supportsTitle: false,
    apply(tempDir, { schemaRef, loader }) {
      writeGraphqlrc(tempDir, schemaRef, loader);
    },
  },
};

/** Plain MDX scaffold and wire descriptor (templates/markdown + mdx formatter). */
export const mdx = {
  ...markdown,
  id: "mdx",
  name: "MDX",
  label: "MDX (plain .mdx files)",
  hint: "Framework-neutral .mdx pages (plain HTML, no components)",
  formatter: MDX_FORMATTER,
  scaffold: {
    ...markdown.scaffold,
    apply(tempDir, { schemaRef, loader }) {
      writeGraphqlrc(tempDir, schemaRef, loader);
      writeMdxFormatter(tempDir);
    },
  },
};
