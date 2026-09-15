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

A decorator selects nodes in the schema with a **predicate** — by default, "the node carries this directive" — and renders their resolved values with a callback you provide. A decorator with a `title` becomes its own top-level section of the type page; one without renders bare content into a named slot instead, such as a badge next to the heading or a line appended to the description.

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
decorators: {
  responses: {
    title: "Responses",
    position: { after: "metadata" },
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
| `directive` | no       | Directive driving the default `resolve` and `context.directive` (see [Predicate](#predicate) for how this differs from gating). Defaults to the decorator's id. |
| `resolve`   | no       | Produces the values passed to `render` (see [Resolve](#resolve)). Defaults to reading `directive`'s occurrences off the node. |
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

:::info

A decorator ends up gated on its own directive through `resolve`, not `predicate`: without a custom `resolve`, the values come from `directive`'s occurrences on the node, which is empty — and so skipped — for a node that lacks it. `predicate` and `directive` are independent: an explicit `predicate` alone decides whether the decorator runs, it is never AND-ed with directive presence. A decorator combining an explicit `predicate` with the default `resolve` still renders once, with an empty record, for a matching node that lacks `directive` — useful for a presence-only badge (see [the marker example](#a-badge-from-a-directive-with-no-arguments) below), surprising otherwise. Supply `resolve` too if that is not the intent.

:::

```js title="docusaurus.config.js"
const { hasDirectiveNamed, isEntity, and } = require("@graphql-markdown/graphql");

decorators: {
  responses: {
    // highlight-next-line
    predicate: and(hasDirectiveNamed("httpResponse"), isEntity("queries", "mutations")),
    title: "Responses",
    render: (values) => values.map((v) => `- \`${v.code}\` ${v.description}`).join("\n"),
  },
}
```

### Resolve

`resolve` is `(type, options) => values`, producing the records `render` receives. Without a custom `resolve`, every occurrence of `directive` on the node is read, one record per occurrence, in schema declaration order — required for repeatable directives.

Provide a custom `resolve` when the rendered values do not come from the decorator's own directive at all — for instance, derived from a nested field, or from a different data source entirely.

### Render

`render` receives the resolved values, the print options in effect, and a context:

```js
render: (values, options, context) => {
  // values: [ { code: 200, description: "OK" }, { code: 404, description: "User not found" } ]
  // options: the print options in effect for the node being rendered
  // context: { id, type, directive, entity }
};
```

- `context.id` — the decorator's id.
- `context.type` — the GraphQL node being printed.
- `context.directive` — the matched directive definition, when the decorator is directive-driven.
- `context.entity` — the node's schema entity kind, when resolvable.

Optional directive arguments that were omitted are absent from the record rather than set to `undefined`, so give them a fallback.

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
{
  httpHeader: {
    title: "Headers",
    position: { after: "metadata" },
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

A directive naming another documented type, rendered as a link to its page.

```graphql
directive @meta(type: String!) on FIELD_DEFINITION
```

```js
{
  meta: {
    title: "Meta",
    position: { after: "code" },
    render: ([value], options) => {
      const slug = String(value.type).toLowerCase();
      return `Returned alongside the data: [\`${value.type}\`](${options.basePath}/objects/${slug}).`;
    },
  },
}
```

Only the first occurrence is used here, as `@meta` is not repeatable.

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
+     directive: "auth",
+     position: { into: "description" },
+     render: (values, options, { directive, type }) =>
+       directiveDescriptor(directive, type, "Requires the `${requires}` role."),
+   },
+   authTag: {
+     directive: "auth",
+     position: { into: "tags" },
+     render: (values, options, { directive }) =>
+       options.formatMDXBadge({ text: `@${directive.name}` }),
+   },
+ },
```

A `customDirective` entry's `descriptor`/`tag` each become their own decorator, sharing the `directive` field so both read the same schema directive; `descriptor` targets the `description` slot, `tag` the `tags` slot. `directiveDescriptor`/`directiveTag` (from `@graphql-markdown/helpers`) still work unchanged — only the surrounding wiring changes. A badge decorator formats its own Markdown via `options.formatMDXBadge`, the same formatter the printer uses for its own badges.

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
- [`getTypeDirectiveValues`](/api/graphql/introspection#gettypedirectivevalues)
- [`getTypeDirectiveArgValue`](/api/graphql/introspection#gettypedirectiveargvalue)
