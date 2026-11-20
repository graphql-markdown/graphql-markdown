---
sidebar_position: 20
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

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Decorators

Use decorators to add custom sections, badges, or description text to the generated pages. A decorator selects **nodes** in the schema (a type, field, or argument the printer is about to render) with a **predicate**, which defaults to every node.

Values come from a **resolve** callback (default: none) and are rendered by a **render** callback you provide. A decorator with a `title` becomes its own top-level section of the type page. One without a `title` renders bare content into a named slot instead, such as a badge next to the heading or a line appended to the description.

`decorators` replaces the deprecated [`customDirective`](/docs/reference/settings#customdirective) option. It is the recommended way to render directive-driven (and now non-directive) content (see [migrating from `customDirective`](#migrating-from-customdirective) below). A directive-driven decorator opts in explicitly with `predicate: hasDirectiveNamed("name")`, as the walkthrough below shows.

## Usage

This walkthrough shows the most common case, a decorator driven by a directive; a directive is not required — see [response type for operations](#response-type-for-operations) below for one driven entirely by the schema's own shape instead.

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

```js title=".graphqlrc.js"
const { getDirectiveFromSchema, getTypeDirectiveValuesList, hasDirectiveNamed } = require("@graphql-markdown/graphql");
const { escapeMDX } = require("@graphql-markdown/utils");

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
        ...values.map((value) => `| ${escapeMDX(`\`${value.code}\``)} | ${escapeMDX(value.description ?? "")} |`),
      ].join("\n");
    },
  },
}
```

:::tip

`resolve` here is exactly what [`directiveOccurrences`](#resolve) does — use `resolve: directiveOccurrences("httpResponse")` instead of spelling it out, unless the values need further transformation.

:::

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

| Option      | Required | Description                                                                                                                                      |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `predicate` | no       | Selects the nodes this decorator applies to (see [Predicate](#predicate)). Defaults to matching every node.                                      |
| `resolve`   | no       | Produces the values passed to `render` (see [Resolve](#resolve)). Defaults to none (an empty array).                                             |
| `render`    | yes      | Callback returning the content as Markdown (see [Render](#render)).                                                                              |
| `title`     | no       | Section heading. Omit for bare, titleless output — this is how a badge or an appended description line is expressed (see [Position](#position)). |
| `level`     | no       | Heading level, defaults to `3`. Ignored when `title` is absent.                                                                                  |
| `position`  | no       | Placement relative to another section, or into a named slot (see [Position](#position)). Defaults to last.                                       |

A decorator is skipped, and nothing is printed, when its predicate does not match, `resolve` returns nothing, or `render` returns nothing.

### Predicate

`predicate` is `(type, options) => boolean`, evaluated once per node, and defaults to matching every node (`always()`). `@graphql-markdown/graphql` exports the common building blocks:

- `hasDirectiveNamed(name)` — the node carries a directive named `name`.
- `hasAnyDirective()` — the node carries at least one directive.
- `isEntity(...kinds)` — the node's schema entity kind is one of `kinds` (`"queries"`, `"mutations"`, `"subscriptions"`, `"objects"`, `"interfaces"`, `"unions"`, `"enums"`, `"inputs"`, `"scalars"`, `"directives"`).
- `and(...predicates)`, `or(...predicates)`, `not(predicate)` — compose predicates.
- `always()` — matches every node; the default.

```js title=".graphqlrc.js"
const { hasDirectiveNamed, isEntity, and } = require("@graphql-markdown/graphql");
const { escapeMDX } = require("@graphql-markdown/utils");

decorators: {
  responses: {
    // highlight-next-line
    predicate: and(hasDirectiveNamed("httpResponse"), isEntity("queries", "mutations")),
    title: "Responses",
    resolve: /* ... */,
    render: (values) => values.map((v) => `- ${escapeMDX(`\`${v.code}\``)} ${escapeMDX(v.description)}`).join("\n"),
  },
}
```

:::info

A decorator declaring an explicit `predicate` but no `resolve` still renders once, with an empty record, whenever the predicate matches — this is a _marker_ decorator (see [the marker example](#a-badge-from-a-directive-with-no-arguments) below), useful for a directive whose mere presence is the content. If that is not the intent, supply `resolve` too.

:::

### Resolve

`resolve` is `(type, options) => values`, producing the records `render` receives; it defaults to producing none. A decorator declaring neither `predicate` nor `resolve` is a no-op by construction (`predicate` matches everything, `resolve` produces nothing to substitute) — declare at least one.

For a directive-driven decorator that needs the directive's argument values, `@graphql-markdown/graphql` provides a ready-made `resolve`:

```js
const { directiveOccurrences, directiveOccurrence } = require("@graphql-markdown/graphql");

// one record per occurrence, in schema declaration order — for a `repeatable` directive
resolve: directiveOccurrences("httpResponse"),

// a single record — for a directive that is not `repeatable`
resolve: directiveOccurrence("meta"),
```

Write `resolve` by hand instead when the values need further transformation, or do not come from a directive's arguments at all — for instance, derived from a nested field, or from a different data source entirely:

```js
resolve: (type, options) => {
  const directive = getDirectiveFromSchema("httpResponse", options);
  return directive ? getTypeDirectiveValuesList(directive, type) : [];
},
```

`directiveOccurrences`/`directiveOccurrence` are exactly this pattern, packaged up.

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

:::warning

`render` returns Markdown/MDX that is printed into the page as-is: it is not escaped. Escape any value that comes from the schema (descriptions, directive arguments) with `escapeMDX` from `@graphql-markdown/utils`, or text in the schema can inject HTML, JSX or MDX expressions into the generated page. Escape a value shown as inline code together with its backticks, ```escapeMDX(`\`${value}\``)```, so it still renders as code, and encode values used in a URL with `encodeURIComponent`.

:::

There is no `context.directive`: a decorator that only needs a directive's _definition_ (not per-occurrence argument values), such as one wrapping `directiveDescriptor`/`directiveTag`, can resolve it directly in `render` with `getDirectiveFromSchema`, skipping `resolve` entirely — or with `@graphql-markdown/helpers`'s `withDirective`, which wraps exactly that lookup (see [migrating from `customDirective`](#migrating-from-customdirective) for a full example).

Optional directive arguments that were omitted are absent from a resolved record rather than set to `undefined`, so give them a fallback.

A decorator declared without a `title` renders bare content: this is how a badge or an appended description line is expressed, using `position: { into: <slot> }` to say where.

### Position

`position` places a decorator relative to another one, or into a named slot outside the page's section order.

**Splicing into the section order** — `{ after: "<section>" }` or `{ before: "<section>" }`. The built-in sections are, in their default order:

`tags`, `description`, `code`, `metadata`, `example`, `relations`

The page header sections, always printed first, are reserved too and cannot be used as a decorator id: `header`, `metatags`, `mdxDeclaration` and `title`.

Another decorator can also be named, by its id, as long as it is declared earlier. A decorator whose `position` names an unknown section is appended last.

**Into a named slot** — `{ into: "<slot>" }` appends the decorator's bare (titleless) content into a slot that is not itself a page section:

| Slot          | Appears                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------- |
| `description` | Appended after the node's description text (the type's, or a field/argument's).           |
| `tags`        | Alongside the type-badges/deprecation tags on the heading's metadata line.                |
| `badges`      | Alongside the built-in type badges (`non-null`, `scalar`, …) on a member's metadata line. |
| `permalink`   | Next to the permalink icon on a member's metadata line.                                   |
| `metadata`    | Appended at the end of a member's metadata line, after badges/tags/permalink.             |

A decorator using `into` is excluded from the page's section order entirely — it never has a heading, regardless of `title`.

`badges`, `permalink`, and `metadata` are only reachable from a member's line (a field, argument, or enum value). They have no type-heading equivalent, so a decorator targeting one of them never renders for the type itself. Use `description` or `tags` for type-level placement instead.

Conversely, `description` and `tags` are shared between the heading and every member row. A predicate that isn't scoped tightly enough (matching, say, both a type and its own fields) renders the decorator in both places.

The `example` section is itself a specialized decorator: it is built from the [`printTypeOptions.exampleSection`](/docs/reference/settings#printtypeoptions) option and rendered as a code block. Configure it through that option, not through `decorators`.

:::tip

Use [`beforeComposePageTypeHook`](/docs/customize/hooks) when the placement has to be decided per type, rather than once in the configuration.

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
const { directiveOccurrences, hasDirectiveNamed } = require("@graphql-markdown/graphql");
const { escapeMDX } = require("@graphql-markdown/utils");

{
  httpHeader: {
    predicate: hasDirectiveNamed("httpHeader"),
    title: "Headers",
    position: { after: "metadata" },
    resolve: directiveOccurrences("httpHeader"),
    render: (values) => {
      return values
        .map((value) => `- ${escapeMDX(`\`${value.name}\``)}${value.required ? " *(required)*" : ""}`)
        .join("\n");
    },
  },
}
```

### A badge from a directive with no arguments

A decorator with an explicit `predicate` and no `resolve` still renders once when the directive is present with no arguments to carry (a _marker_ decorator) — useful for a plain presence badge.

```graphql
directive @beta on OBJECT | FIELD_DEFINITION
```

```js
const { hasDirectiveNamed } = require("@graphql-markdown/graphql");
const { Printer } = require("@graphql-markdown/printer-legacy");

{
  beta: {
    predicate: hasDirectiveNamed("beta"),
    position: { into: "tags" },
    render: (values, options) => Printer.printBadge({ text: "BETA", classname: "badge--danger" }, options),
  },
}
```

[`Printer.printBadge`](/api/printer-legacy/printer#printbadge) renders a `Badge` object the same way the printer renders its own tags. It escapes the text and falls back to the default formatter when `options.formatMDXBadge` isn't set, so prefer it to calling `options.formatMDXBadge` directly.

### Meta object

A directive naming another documented type, rendered as a link to its page. `@meta` is not `repeatable`, so `directiveOccurrence` (singular) resolves its one occurrence.

```graphql
directive @meta(type: String!) on FIELD_DEFINITION
```

```js
const { directiveOccurrence, hasDirectiveNamed } = require("@graphql-markdown/graphql");
const { escapeMDX } = require("@graphql-markdown/utils");

{
  meta: {
    predicate: hasDirectiveNamed("meta"),
    title: "Meta",
    position: { after: "code" },
    resolve: directiveOccurrence("meta"),
    render: ([value], options) => {
      const slug = encodeURIComponent(String(value.type).toLowerCase());
      return `Returned alongside the data: [${escapeMDX(`\`${value.type}\``)}](${options.basePath}/objects/${slug}).`;
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

`isOperation` only takes `type`, one argument fewer than `predicate`'s `(type, options)`. That is fine, since the extra argument is ignored. Any single-argument type guard from `@graphql-markdown/graphql` (`isObjectType`, `isEnumType`, …) can be passed directly as `predicate` the same way.

This mirrors the [`afterPrintCode` hook recipe](/docs/customize/hooks#display-response-types-for-operations), which rewrites the generated code block directly. Prefer the decorator when the content should be orderable via `position` or need not touch the code block. Prefer the hook when you need to intercept `printCode`'s raw output.

## Migrating from `customDirective`

[`customDirective`](/docs/reference/settings#customdirective) is deprecated in favor of `decorators`; both flow through the same rendering pipeline, but `decorators` selects nodes with any predicate, not only a directive's presence, and lets a decorator target any section position or slot rather than only a description line, a tag, or the built-in "Directives" section.

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
+     render: withDirective("auth", (directive, options, { type }) =>
+       escapeMDX(directiveDescriptor(directive, type, "Requires the `${requires}` role.")),
+     ),
+   },
+   authTag: {
+     predicate: hasDirectiveNamed("auth"),
+     position: { into: "tags" },
+     render: withDirective("auth", (directive, options) =>
+       Printer.printBadge(directiveTag(directive), options),
+     ),
+   },
+ },
```

What changes:

- **Escaping:** `customDirective` escaped the `descriptor` output for you. A decorator's `render` output is printed as-is, so wrap `directiveDescriptor` in `escapeMDX` (from `@graphql-markdown/utils`) as shown.
- **One decorator each:** a `customDirective` entry's `descriptor` and `tag` each become their own decorator, both gated with `predicate: hasDirectiveNamed(<same name>)`. `descriptor` targets the `description` slot, `tag` the `tags` slot.
- **No `resolve`:** `descriptor` and `tag` operate on the directive _definition_, not per-occurrence argument values, so `resolve` is not needed.

What stays the same or is new:

- `directiveDescriptor` and `directiveTag` (from `@graphql-markdown/helpers`) still work unchanged. Only the surrounding wiring changes.
- `withDirective` (also from `@graphql-markdown/helpers`) is the old implicit directive lookup, made explicit. It resolves the named directive and skips `render` when the schema does not declare it, so decorators don't repeat the `getDirectiveFromSchema` null-check by hand.
- `directiveTag` still only builds the `Badge` object (`{ text, classname }`). Turning it into Markdown is now the decorator's job, done with [`Printer.printBadge`](/api/printer-legacy/printer#printbadge) (from `@graphql-markdown/printer-legacy`). It is the badge renderer the printer uses for its own tags, so custom badges stay consistent if the configured formatter changes.

## Helpers

The packages `@graphql-markdown/helpers` and `@graphql-markdown/graphql` provide a few helper functions to quickly start.

`@graphql-markdown/helpers` is an optional peer dependency, and it needs to be installed before using it.

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm i @graphql-markdown/helpers
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm add @graphql-markdown/helpers
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @graphql-markdown/helpers
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun add @graphql-markdown/helpers
```

</TabItem>
</Tabs>

### `@graphql-markdown/helpers`

- [`directiveDescriptor`](/api/helpers/directives/descriptor)
- [`directiveTag`](/api/helpers/directives/tag)
- [`withDirective`](/api/helpers/directives/with-directive) — wraps a `render` that only needs a directive's definition (see [migrating from `customDirective`](#migrating-from-customdirective)).

### `@graphql-markdown/graphql`

Predicate helpers (see [Predicate](#predicate)):

- [`hasDirectiveNamed`](/api/graphql/predicate#hasdirectivenamed)
- [`hasAnyDirective`](/api/graphql/predicate#hasanydirective)
- [`isEntity`](/api/graphql/predicate#isentity)
- [`and`](/api/graphql/predicate#and), [`or`](/api/graphql/predicate#or), [`not`](/api/graphql/predicate#not)
- [`always`](/api/graphql/predicate#always)
- [`isOperation`](/api/graphql/guard#isoperation) and the other type guards — any single-argument one doubles as a predicate (see [response type for operations](#response-type-for-operations)).

Directive-value helpers (see [Resolve](#resolve)):

- [`directiveOccurrences`](/api/graphql/predicate#directiveoccurrences) — ready-made `resolve` for a `repeatable` directive.
- [`directiveOccurrence`](/api/graphql/predicate#directiveoccurrence) — ready-made `resolve` for a non-repeatable directive.
- [`getDirectiveFromSchema`](/api/graphql/predicate#getdirectivefromschema)
- [`getTypeDirectiveValues`](/api/graphql/introspection#gettypedirectivevalues)
- [`getTypeDirectiveValuesList`](/api/graphql/introspection#gettypedirectivevalueslist)
- [`getTypeDirectiveArgValue`](/api/graphql/introspection#gettypedirectiveargvalue)

### `@graphql-markdown/printer-legacy`

- [`Printer.printCode`](/api/printer-legacy/printer#printcode) — renders a type's SDL as a code block, reused in [response type for operations](#response-type-for-operations).
- [`Printer.printBadge`](/api/printer-legacy/printer#printbadge) — formats a `Badge` object into Markdown, reused in [migrating from `customDirective`](#migrating-from-customdirective).
