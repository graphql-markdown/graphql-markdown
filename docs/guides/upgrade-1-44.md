---
sidebar_position: 100
pagination_prev: null
pagination_next: null
description: Upgrade GraphQL-Markdown to 1.44. Replace the removed mdxParser and customDirective settings, and fix settings that are now rejected.
keywords:
  - upgrade GraphQL-Markdown
  - migration guide
  - mdxParser
  - customDirective
  - unsupported setting
---

# Upgrade to 1.44

GraphQL-Markdown 1.44 removes two settings that were deprecated in earlier releases, `mdxParser` and `customDirective`, and stops ignoring settings it does not support. A configuration that ran on 1.43 can fail on 1.44, so check it before you upgrade.

## Check your configuration

Generation now stops with an error when your configuration contains a setting that GraphQL-Markdown does not support. The error names every unsupported setting at once and suggests the closest supported setting for a likely typo:

```text
Error: Unsupported settings "mdxParser", "fromatter" (did you mean "formatter"?). See https://graphql-markdown.dev/docs/reference/settings for the list of supported settings.
```

Earlier releases silently ignored these settings, so a misspelled option had no effect. Fix or remove each setting the error lists. The [settings reference](/docs/reference/settings) lists every supported setting.

The `schema`, `documents`, `include` and `exclude` keys that `graphql-config` adds to a project are still accepted.

## Replace `mdxParser` with `formatter`

`mdxParser` was renamed to [`formatter`](/docs/reference/settings#formatter). The value is the same: a package name or a path to a formatter module.

```diff title=".graphqlrc.js"
 module.exports = {
   schema: "./schema.graphql",
   extensions: {
     "graphql-markdown": {
-      mdxParser: "@graphql-markdown/formatters/hugo",
+      formatter: "@graphql-markdown/formatters/hugo",
     },
   },
 };
```

On the command line, replace the `--mdxParser` flag with `--formatter`:

```diff
- npx docusaurus graphql-to-doc --mdxParser ./custom-formatter.js
+ npx docusaurus graphql-to-doc --formatter ./custom-formatter.js
```

## Replace `customDirective` with `decorators`

[`decorators`](/docs/customize/decorators) replace `customDirective`. Each `customDirective` entry becomes one decorator for its `descriptor` and one for its `tag`, both selected with `hasDirectiveNamed`:

```diff
- customDirective: {
-   auth: {
-     descriptor: (directive, node) =>
-       directiveDescriptor(directive, node, "Requires the `${requires}` role."),
-   },
- },
+ decorators: {
+   authDescription: {
+     predicate: hasDirectiveNamed("auth"),
+     position: { into: "description" },
+     render: withDirective("auth", (directive, options, { type }) =>
+       escapeMDX(directiveDescriptor(directive, type, "Requires the `${requires}` role.")),
+     ),
+   },
+ },
```

`hasDirectiveNamed` comes from `@graphql-markdown/graphql`, `withDirective` and `directiveDescriptor` from `@graphql-markdown/helpers`, and `escapeMDX` from `@graphql-markdown/utils`. [Migrating from `customDirective`](/docs/customize/decorators#migrating-from-customdirective) has the complete example, including tags, and explains what changes.

## Removed TypeScript exports

If you import the `customDirective` API in your own code, such as a custom formatter or a script, these exports were removed:

| Package                            | Removed exports                                                                                                                                                                    | Use instead                                   |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `@graphql-markdown/types`          | `CustomDirective`, `CustomDirectiveMap`, `CustomDirectiveMapItem`, `CustomDirectiveOptions`, `CustomDirectiveFunction`, `CustomDirectiveResolver`, `PageSections.customDirectives` | `Decorators`, `DecoratorDefinition`           |
| `@graphql-markdown/types`          | `mdxParser` in `ConfigOptions` and `CliOptions`                                                                                                                                    | `formatter`                                   |
| `@graphql-markdown/graphql`        | `isCustomDirective`, `getCustomDirectiveOptions`, `getCustomDirectives`, `getConstDirectiveMap`, `WILDCARD_DIRECTIVE`                                                              | `hasDirectiveNamed`, `getDirectiveFromSchema` |
| `@graphql-markdown/printer-legacy` | `buildCustomDirectiveDecorators`                                                                                                                                                   | [`decorators`](/docs/customize/decorators)    |

The section names `customDirectives`, `customDirective:description` and `customDirective:tags` are no longer reserved, so a decorator can use them as its id.
