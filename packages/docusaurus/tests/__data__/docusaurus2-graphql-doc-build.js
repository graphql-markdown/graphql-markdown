/** @type {import('@docusaurus/types').Config} */
module.exports = {
  url: "https://graphql-markdown.dev",
  baseUrl: "/",
  onBrokenLinks: "log",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  title: "GraphQL-Markdown",
  tagline: "Flexible GraphQL Documentation Generator",
  organizationName: "edno",
  projectName: "graphql-markdown",
  trailingSlash: false,
  themeConfig: {
    image: "img/preview.png",
    respectPrefersColorScheme: true,
    navbar: {
      title: "GraphQL-Markdown",
      logo: {
        alt: "GraphQL-Markdown",
        src: "img/graphql-markdown.svg",
        target: "_self",
      },
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        blog: false,
        docs: {
          path: "docs",
          routeBasePath: "/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [
    "e2e-test-webpack-plugin",
    [
      "@graphql-markdown/docusaurus",
      // override .graphqlrc
      /** @type {import('@graphql-markdown/types').ConfigOptions} */
      {
        id: "schema_tweets",
        rootPath: "./docs",
        linkRoot: "/",
        runOnBuild: true,
      },
    ],
  ],
};
