---
pagination_prev: null
pagination_next: null
description: printTypeOptions.customSections is removed, superseded by the decorators option. Migrate with these diff examples.
keywords:
  - GraphQL custom sections
  - custom directive
  - decorators
  - migration
  - documentation sections
---

# Custom sections

:::caution

`printTypeOptions.customSections` is **removed**, superseded by [`decorators`](/docs/advanced/decorators): a top-level option, keyed by a free-form id rather than a directive name, selecting nodes by any predicate rather than directive presence alone. Setting `printTypeOptions.customSections` no longer has any effect.

:::

## Migrating

Move each entry out of `printTypeOptions.customSections` to the top level, under `decorators`. Give it an id (it no longer doubles as the directive name), set `directive` to the schema directive it used to key on, and replace `appliesTo` — removed, it was sugar for `isEntity(...)` — with an equivalent `predicate`.

### Basic section

```diff
- printTypeOptions: {
-   customSections: {
-     httpResponse: {
-       title: "Responses",
-       position: { after: "metadata" },
-       appliesTo: ["queries", "mutations"],
-       render: (values) => {
-         return [
-           "| Code | Description |",
-           "| ---- | ----------- |",
-           ...values.map((value) => `| \`${value.code}\` | ${value.description ?? ""} |`),
-         ].join("\n");
-       },
-     },
-   },
- },
+ decorators: {
+   httpResponse: {
+     directive: "httpResponse",
+     title: "Responses",
+     position: { after: "metadata" },
+     predicate: isEntity("queries", "mutations"),
+     render: (values) => {
+       return [
+         "| Code | Description |",
+         "| ---- | ----------- |",
+         ...values.map((value) => `| \`${value.code}\` | ${value.description ?? ""} |`),
+       ].join("\n");
+     },
+   },
+ },
```

`isEntity` is exported by `@graphql-markdown/graphql`. `render`'s signature is unchanged (`(values, options) => content`); a third `context` argument (`{ id, type, directive, entity }`) is now also available.

### Response headers

```diff
- printTypeOptions: {
-   customSections: {
-     httpHeader: {
-       title: "Headers",
-       position: { after: "metadata" },
-       render: (values) => {
-         return values
-           .map((value) => `- \`${value.name}\`${value.required ? " *(required)*" : ""}`)
-           .join("\n");
-       },
-     },
-   },
- },
+ decorators: {
+   httpHeader: {
+     directive: "httpHeader",
+     title: "Headers",
+     position: { after: "metadata" },
+     render: (values) => {
+       return values
+         .map((value) => `- \`${value.name}\`${value.required ? " *(required)*" : ""}`)
+         .join("\n");
+     },
+   },
+ },
```

No `appliesTo` here, so nothing to replace with a `predicate` — just the id/`directive` split and the move out of `printTypeOptions`.

### Meta object

```diff
- printTypeOptions: {
-   customSections: {
-     meta: {
-       title: "Meta",
-       position: { after: "code" },
-       render: ([value], options) => {
-         const slug = String(value.type).toLowerCase();
-         return `Returned alongside the data: [\`${value.type}\`](${options.basePath}/objects/${slug}).`;
-       },
-     },
-   },
- },
+ decorators: {
+   meta: {
+     directive: "meta",
+     title: "Meta",
+     position: { after: "code" },
+     render: ([value], options) => {
+       const slug = String(value.type).toLowerCase();
+       return `Returned alongside the data: [\`${value.type}\`](${options.basePath}/objects/${slug}).`;
+     },
+   },
+ },
```

See [decorators](/docs/advanced/decorators) for the full option reference, including `predicate`, `resolve`, and the `position: { into: <slot> }` form for badges and description text that `customSections` could not express.
