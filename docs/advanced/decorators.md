---
id: decorators
pagination_prev: null
pagination_next: null
description: Select any node in your schema with a predicate and render a custom section, badge, or description text for it — the successor to customDirective.
keywords:
  - GraphQL decorators
  - custom directive
  - predicate
  - badges
  - documentation sections
---

# Decorators

A decorator selects nodes in the schema with a **predicate** — by default, every node — and renders values produced by a **resolve** callback (by default, none) with a **render** callback you provide. A decorator with a `title` becomes its own top-level section of the type page; one without renders bare content into a named slot instead, such as a badge next to the heading or a line appended to the description.

There is no built-in "this decorator's own directive" option: a directive-driven decorator selects its nodes with `predicate: hasDirectiveNamed("name")` and, if it needs that directive's argument values, reads them in `resolve` (or directly in `render`) using `@graphql-markdown/graphql`'s `getDirectiveFromSchema` combined with `getTypeDirectiveValues`/`getTypeDirectiveValuesList` — the same public helpers the printer uses internally, so nothing is hidden.

`decorators` supersedes [`customDirective`](/docs/settings#customdirective) (see [migrating from `customDirective`](#migrating-from-customdirective) below): a single option, keyed by a free-form id rather than a directive name, selecting nodes by any predicate rather than directive presence alone.

## Usage

**1. Declare a directive in the schema**

Mark it `repeatable` when a type can carry more than one occurrence.

```graphql
directive @httpResponse(
  code: Int!
  description: String
) repeatable on FIELD_DEFINITION

type Query {
  user(id: ID!): User
    @httpResponse(code: 200, description: "OK")
    @httpResponse(code: 404, description: "User not found")
}
```

**2. Declare the decorator in the configuration**

```js title="docusaurus.config.js"
const { getDirectiveFromSchema, getTypeDirectiveValuesList, hasDirectiveNamed } = require("@graphql-markdown/graphql");

decorators: {
  responses: {
    predicate: hasDirectiveNamed("httpResponse"),
    title: "Responses",
    position: { after: "metadata" },
    resolve: (type, options) => {
      const directive = getDirectiveFromSchema("httpResponse", options);
      return directive ? getTypeDirectiveValuesList(directive, type) : [];
    },
    render: (values) => {
      return [
        "| Code | Description |",
        "| ---- | ----------- |",
        ...values.map((value) => `| \`${value.code}\` | ${value.description ?? ""} |`),
      ].join("\n");
    },
  },
}
```

**3. The section is rendered on the page**

```md
### Responses

| Code  | Description    |
| ----- | -------------- |
| `200` | OK             |
| `404` | User not found |
```

## Options

The key is a free-form, unique id — it does not need to name a schema directive, and does not become the section heading (set `title` for that). It must not be one of the built-in section names (see [Position](#position)).

| Option      | Required | Description                                                                                     |
| ----------- | -------- | ------------------------------------------------------------------------------------------------- |
| `predicate` | no       | Selects the nodes this decorator applies to (see [Predicate](#predicate)). Defaults to matching every node. |
| `resolve`   | no       | Produces the values passed to `render` (see [Resolve](#resolve)). Defaults to none (an empty array). |
| `render`    | yes      | Callback returning the content as Markdown (see [Render](#render)).                             |
| `title`     | no       | Section heading. Omit for bare, titleless output — this is how a badge or an appended description line is expressed (see [Position](#position)). |
| `level`     | no       | Heading level, defaults to `3`. Ignored when `title` is absent.                                 |
| `position`  | no       | Placement relative to another section, or into a named slot (see [Position](#position)). Defaults to last. |

A decorator is skipped, and nothing is printed, when its predicate does not match, `resolve` returns nothing, or `render` returns nothing.

### Predicate

`predicate` is `(type, options) => boolean`, evaluated once per node, and defaults to matching every node (`always()`). `@graphql-markdown/graphql` exports the common building blocks:

- `hasDirectiveNamed(name)` — the node carries a directive named `name`.
- `hasAnyDirective()` — the node carries at least one directive.
- `isEntity(...kinds)` — the node's schema entity kind is one of `kinds` (`"queries"`, `"mutations"`, `"subscriptions"`, `"objects"`, `"interfaces"`, `"unions"`, `"enums"`, `"inputs"`, `"scalars"`, `"directives"`).
- `and(...predicates)`, `or(...predicates)`, `not(predicate)` — compose predicates.
- `always()` — matches every node; the default.

```js title="docusaurus.config.js"
const { hasDirectiveNamed, isEntity, and } = require("@graphql-markdown/graphql");

decorators: {
  responses: {
    // highlight-next-line
    predicate: and(hasDirectiveNamed("httpResponse"), isEntity("queries", "mutations")),
    title: "Responses",
    resolve: /* ... */,
    render: (values) => values.map((v) => `- \`${v.code}\` ${v.description}`).join("\n"),
  },
}
```

:::info

A decorator declaring an explicit `predicate` but no `resolve` still renders once, with an empty record, whenever the predicate matches — this is a *marker* decorator (see [the marker example](#a-badge-from-a-directive-with-no-arguments) below), useful for a directive whose mere presence is the content. If that is not the intent, supply `resolve` too.

:::

### Resolve

`resolve` is `(type, options) => values`, producing the records `render` receives; it defaults to producing none. A decorator declaring neither `predicate` nor `resolve` is a no-op by construction (`predicate` matches everything, `resolve` produces nothing to substitute) — declare at least one.

For a directive-driven decorator that needs the directive's argument values, read every occurrence with `getDirectiveFromSchema` + `getTypeDirectiveValuesList` (one record per occurrence, in schema declaration order — required for repeatable directives):

```js
resolve: (type, options) => {
  const directive = getDirectiveFromSchema("httpResponse", options);
  return directive ? getTypeDirectiveValuesList(directive, type) : [];
},
```

Provide a custom `resolve` whenever the rendered values do not come from a directive's arguments at all — for instance, derived from a nested field, or from a different data source entirely.

### Render

`render` receives the resolved values, the print options in effect, and a context:

```js
render: (values, options, context) => {
  // values: [ { code: 200, description: "OK" }, { code: 404, description: "User not found" } ]
  // options: the print options in effect for the node being rendered
  // context: { id, type, entity }
};
```

- `context.id` — the decorator's id.
- `context.type` — the GraphQL node being printed.
- `context.entity` — the node's schema entity kind, when resolvable.

There is no `context.directive`: a decorator that only needs a directive's *definition* (not per-occurrence argument values), such as one wrapping `directiveDescriptor`/`directiveTag`, can resolve it directly in `render` with `getDirectiveFromSchema`, skipping `resolve` entirely (see [migrating from `customDirective`](#migrating-from-customdirective) for a full example).

Optional directive arguments that were omitted are absent from a resolved record rather than set to `undefined`, so give them a fallback.

A decorator declared without a `title` renders bare content: this is how a badge or an appended description line is expressed, using `position: { into: <slot> }` to say where.

### Position

`position` places a decorator relative to another one, or into a named slot outside the page's section order.

**Splicing into the section order** — `{ after: "<section>" }` or `{ before: "<section>" }`. The built-in sections are, in their default order:

`tags`, `description`, `code`, `metadata`, `example`, `relations`

Another decorator can also be named, by its id, as long as it is declared earlier. A decorator whose `position` names an unknown section is appended last.

**Into a named slot** — `{ into: "<slot>" }` appends the decorator's bare (titleless) content into a slot that is not itself a page section:

| Slot         | Appears                                                                 |
| ------------ | ------------------------------------------------------------------------ |
| `description`| Appended after the node's description text (the type's, or a field/argument's). |
| `tags`       | Alongside the type-badges/deprecation tags on the heading's metadata line. |
| `badges`     | Alongside the built-in type badges (`non-null`, `scalar`, …) on a member's metadata line. |
| `permalink`  | Next to the permalink icon on a member's metadata line.                |
| `metadata`   | Appended at the end of a member's metadata line, after badges/tags/permalink. |

A decorator using `into` is excluded from the page's section order entirely — it never has a heading, regardless of `title`.

:::note

`example` is itself a decorator, specialized: it is built from the [`printTypeOptions.exampleSection`](/docs/settings#printtypeoptions) option and rendered as a code block. It is configured through that option, not through `decorators`.

:::

:::tip

Use [`beforeComposePageTypeHook`](/docs/advanced/hook-recipes) when the placement has to be decided per type, rather than once in the configuration.

:::

## Examples

### Response headers

```graphql
directive @httpHeader(
  name: String!
  required: Boolean = false
) repeatable on FIELD_DEFINITION
```

```js
const { getDirectiveFromSchema, getTypeDirectiveValuesList, hasDirectiveNamed } = require("@graphql-markdown/graphql");

{
  httpHeader: {
    predicate: hasDirectiveNamed("httpHeader"),
    title: "Headers",
    position: { after: "metadata" },
    resolve: (type, options) => {
      const directive = getDirectiveFromSchema("httpHeader", options);
      return directive ? getTypeDirectiveValuesList(directive, type) : [];
    },
    render: (values) => {
      return values
        .map((value) => `- \`${value.name}\`${value.required ? " *(required)*" : ""}`)
        .join("\n");
    },
  },
}
```

### A badge from a directive with no arguments

A decorator with an explicit `predicate` and no `resolve` still renders once when the directive is present with no arguments to carry (a *marker* decorator) — useful for a plain presence badge.

```graphql
directive @beta on OBJECT | FIELD_DEFINITION
```

```js
const { hasDirectiveNamed } = require("@graphql-markdown/graphql");

{
  beta: {
    predicate: hasDirectiveNamed("beta"),
    position: { into: "tags" },
    render: (values, options) => options.formatMDXBadge({ text: "BETA", classname: "badge--danger" }),
  },
}
```

### Meta object

A directive naming another documented type, rendered as a link to its page. Only the first occurrence is read, with `getTypeDirectiveValues` (singular), as `@meta` is not repeatable.

```graphql
directive @meta(type: String!) on FIELD_DEFINITION
```

```js
const { getDirectiveFromSchema, getTypeDirectiveValues, hasDirectiveNamed } = require("@graphql-markdown/graphql");

{
  meta: {
    predicate: hasDirectiveNamed("meta"),
    title: "Meta",
    position: { after: "code" },
    resolve: (type, options) => {
      const directive = getDirectiveFromSchema("meta", options);
      const value = directive && getTypeDirectiveValues(directive, type);
      return value ? [value] : [];
    },
    render: ([value], options) => {
      const slug = String(value.type).toLowerCase();
      return `Returned alongside the data: [\`${value.type}\`](${options.basePath}/objects/${slug}).`;
    },
  },
}
```

### Response type for operations

Not every decorator needs a directive at all: `predicate` and `resolve` can just as well select and derive content from the schema's own shape. This appends each query/mutation's return type as its own SDL code block, reusing `Printer.printCode`:

```js
const { getNamedType, isOperation, isScalarType } = require("@graphql-markdown/graphql");
const { Printer } = require("@graphql-markdown/printer-legacy");

{
  responseType: {
    predicate: isOperation,
    title: "Response Type",
    position: { after: "code" },
    resolve: (type, options) => {
      const returnType = getNamedType(type.type);
      if (isScalarType(returnType)) {
        return [];
      }
      return [{ code: Printer.printCode(returnType, options) }];
    },
    render: ([value]) => value.code,
  },
}
```

## Migrating from `customDirective`

[`customDirective`](/docs/settings#customdirective) is deprecated in favor of `decorators`; both flow through the same rendering pipeline, but `decorators` selects nodes with any predicate, not only a directive's presence, and lets a decorator target any section position or slot rather than only a description line, a tag, or the built-in "Directives" section.

```diff
- customDirective: {
-   auth: {
-     descriptor: (directive, node) =>
-       directiveDescriptor(directive, node, "Requires the `${requires}` role."),
-     tag: (directive) => ({ text: `@${directive.name}` }),
-   },
- },
+ decorators: {
+   authDescription: {
+     predicate: hasDirectiveNamed("auth"),
+     position: { into: "description" },
+     render: (values, options, { type }) => {
+       const directive = getDirectiveFromSchema("auth", options);
+       return directive
+         ? directiveDescriptor(directive, type, "Requires the `${requires}` role.")
+         : undefined;
+     },
+   },
+   authTag: {
+     predicate: hasDirectiveNamed("auth"),
+     position: { into: "tags" },
+     render: (values, options) => {
+       const directive = getDirectiveFromSchema("auth", options);
+       return directive ? options.formatMDXBadge({ text: `@${directive.name}` }) : undefined;
+     },
+   },
+ },
```

A `customDirective` entry's `descriptor`/`tag` each become their own decorator, both gated with `predicate: hasDirectiveNamed(<same name>)`; `descriptor` targets the `description` slot, `tag` the `tags` slot. `directiveDescriptor`/`directiveTag` (from `@graphql-markdown/helpers`) still work unchanged — only the surrounding wiring changes: `resolve` is not needed here, since `descriptor`/`tag` operate on the directive *definition*, not per-occurrence argument values, so `render` looks it up itself with `getDirectiveFromSchema`. A badge decorator formats its own Markdown via `options.formatMDXBadge`, the same formatter the printer uses for its own badges.

## Helpers

The packages `@graphql-markdown/helpers` and `@graphql-markdown/graphql` provide a few helper functions to quickly start.

:::info

`@graphql-markdown/helpers` is an optional peer dependency, and it needs to be installed before using it.

```shell title="shell"
npm i @graphql-markdown/helpers
```

:::

### `@graphql-markdown/helpers`

- [`directiveDescriptor`](/api/helpers/directives/descriptor)
- [`directiveTag`](/api/helpers/directives/tag)

### `@graphql-markdown/graphql`

- `hasDirectiveNamed`, `hasAnyDirective`, `isEntity`, `and`, `or`, `not`, `always` — predicate helpers (see [Predicate](#predicate)).
- `getDirectiveFromSchema` — resolves a directive's schema definition by name (see [Resolve](#resolve)).
- [`getTypeDirectiveValues`](/api/graphql/introspection#gettypedirectivevalues)
- [`getTypeDirectiveValuesList`](/api/graphql/introspection#gettypedirectivevalueslist)
- [`getTypeDirectiveArgValue`](/api/graphql/introspection#gettypedirectiveargvalue)
