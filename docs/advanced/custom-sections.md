---
pagination_prev: null
pagination_next: null
description: Add your own directive-driven sections to GraphQL type pages, for HTTP status codes, response headers, or any schema metadata a custom directive carries.
keywords:
  - GraphQL custom sections
  - custom directive
  - repeatable directive
  - HTTP status codes
  - documentation sections
---

# Custom sections

Schemas often carry documentation-only metadata that has no natural home on a type page: the HTTP status codes an operation can return, the headers it expects, or a description of a `meta` object returned alongside the data.

The option [`printTypeOptions.customSections`](/docs/settings#printtypeoptions) turns such a directive into its own top-level section of the type page, rendered by a callback you provide.

:::info

A custom section is a **page-level** section. Operations are printed on their own pages, so a directive on `Query.user` produces a section on the `user` page.

:::

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

**2. Declare the section in the configuration**

```js title="docusaurus.config.js"
printTypeOptions: {
  customSections: [
    {
      name: "httpResponses",
      title: "Responses",
      directive: "httpResponse",
      position: { after: "metadata" },
      appliesTo: ["queries", "mutations"],
      render: (values) => {
        return [
          "| Code | Description |",
          "| ---- | ----------- |",
          ...values.map((value) => `| \`${value.code}\` | ${value.description ?? ""} |`),
        ].join("\n");
      },
    },
  ],
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

| Option      | Required | Description                                                                                   |
| ----------- | -------- | --------------------------------------------------------------------------------------------- |
| `name`      | yes      | Section key. Must be unique, and must not be one of the built-in keys (see [Position](#position)). |
| `directive` | yes      | Name of the schema directive carrying the section data.                                         |
| `render`    | yes      | Callback returning the section content as Markdown (see [Render](#render)).                     |
| `title`     | no       | Section heading. Omit for an untitled section.                                                  |
| `level`     | no       | Heading level, defaults to `3`.                                                                 |
| `position`  | no       | Placement relative to another section (see [Position](#position)). Defaults to last.            |
| `appliesTo` | no       | Restricts the section to some schema entities (see [appliesTo](#appliesto)). Defaults to all.   |

A section is skipped, and no heading is printed, when the directive is absent from the schema or from the type, or when `render` returns nothing.

### Render

`render` receives one record of directive arguments **per occurrence**, in schema declaration order, and the print options in effect. It returns the section content as Markdown, or a nullish value to skip the section.

```js
render: (values, options) => {
  // values: [ { code: 200, description: "OK" }, { code: 404, description: "User not found" } ]
  // options: the print options in effect for the type being rendered
};
```

Optional directive arguments that were omitted are absent from the record rather than set to `undefined`, so give them a fallback.

### Position

`position` places the section relative to another one, using either `{ after: "<section>" }` or `{ before: "<section>" }`. The built-in sections are, in their default order:

`tags`, `description`, `code`, `customDirectives`, `metadata`, `example`, `relations`

Another custom section can also be named, as long as it is declared earlier. A section whose `position` names an unknown section is appended last.

:::note

`example` is itself a custom section, specialized: it is built from the [`printTypeOptions.exampleSection`](/docs/settings#printtypeoptions) option and rendered as a code block. It is configured through that option, not through `customSections`.

:::

:::tip

Use [`beforeComposePageTypeHook`](/docs/advanced/hook-recipes) when the placement has to be decided per type, rather than once in the configuration.

:::

### appliesTo

`appliesTo` restricts the section to some schema entities:

`queries`, `mutations`, `subscriptions`, `objects`, `interfaces`, `unions`, `enums`, `inputs`, `scalars`, `directives`

This is not the same as the directive's own GraphQL locations: `on FIELD_DEFINITION` cannot tell a query from a mutation, and a third-party schema may declare locations wider than what you want documented.

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
  name: "httpHeaders",
  title: "Headers",
  directive: "httpHeader",
  position: { after: "metadata" },
  render: (values) => {
    return values
      .map((value) => `- \`${value.name}\`${value.required ? " *(required)*" : ""}`)
      .join("\n");
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
  name: "meta",
  title: "Meta",
  directive: "meta",
  position: { after: "code" },
  render: ([value], options) => {
    const slug = String(value.type).toLowerCase();
    return `Returned alongside the data: [\`${value.type}\`](${options.basePath}/objects/${slug}).`;
  },
}
```

Only the first occurrence is used here, as `@meta` is not repeatable.
