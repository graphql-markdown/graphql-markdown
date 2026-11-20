---
sidebar_position: 10
description: Learn how to configure GraphQL-Markdown using GraphQL Config, Docusaurus plugin options, or CLI arguments. Supports multiple frameworks.
keywords:
  - GraphQL-Markdown configuration
  - GraphQL Config
  - Docusaurus plugin
  - MDX settings
  - schema configuration
---

# Configuration

GraphQL-Markdown reads its settings from a GraphQL Config file, from framework options such as the Docusaurus plugin, and from CLI flags. Later sources take precedence over earlier ones.

## GraphQL Config

GraphQL Config is the recommended way to configure GraphQL-Markdown across all frameworks. Use a [GraphQL Config](https://the-guild.dev/graphql/config/docs/user/usage) file (multiple formats supported) to configure GraphQL-Markdown:

```yaml title=".graphqlrc"
schema: "https://graphql.anilist.co/"
extensions:
  graphql-markdown:
    linkRoot: "/examples/default"
    baseURL: "."
    homepage: "data/anilist.md"
    formatter: "@graphql-markdown/formatters/hugo"
    loaders:
      UrlLoader:
        module: "@graphql-tools/url-loader"
        options:
          method: "POST"
    printTypeOptions:
      deprecated: "group"
```

For supported formatter presets, see [Other frameworks](/docs/guides/other-frameworks).

For Docusaurus plugin options and site settings, see the [Docusaurus guide](/docs/guides/docusaurus#configuration).

## Configuration lifecycle

GraphQL-Markdown processes configuration sources in the following priority order (later sources override earlier ones):

1. **Default configuration**: Built-in default settings
2. **GraphQL Config file** (`.graphqlrc`): Framework-agnostic project settings
3. **Framework-specific configuration**: for example, Docusaurus plugin settings
4. **CLI flags**: Command-line arguments override all other settings

CLI flags let you override settings temporarily without editing your configuration files.

**Current limitations:**

- Single schema only, no schema stitching
- `include`, `exclude`, `documents` and glob pattern are not supported
