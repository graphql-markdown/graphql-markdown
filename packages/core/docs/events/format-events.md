# events/format-events

MDX formatting event constants.

## Variables

### FormatEvents

```ts
const FormatEvents: object;
```

Defined in: [events/format-events.ts:10](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/format-events.ts#L10)

Event names for MDX formatting lifecycle.

#### Type Declaration

##### FORMAT_ADMONITION

```ts
readonly FORMAT_ADMONITION: "format:admonition" = "format:admonition";
```

Emitted when formatting an admonition

##### FORMAT_BADGE

```ts
readonly FORMAT_BADGE: "format:badge" = "format:badge";
```

Emitted when formatting a badge

##### FORMAT_BULLET

```ts
readonly FORMAT_BULLET: "format:bullet" = "format:bullet";
```

Emitted when formatting a bullet point

##### FORMAT_DETAILS

```ts
readonly FORMAT_DETAILS: "format:details" = "format:details";
```

Emitted when formatting a collapsible details section

##### FORMAT_FRONTMATTER

```ts
readonly FORMAT_FRONTMATTER: "format:frontmatter" = "format:frontmatter";
```

Emitted when formatting front matter

##### FORMAT_LINK

```ts
readonly FORMAT_LINK: "format:link" = "format:link";
```

Emitted when formatting a link

##### FORMAT_NAME_ENTITY

```ts
readonly FORMAT_NAME_ENTITY: "format:nameEntity" = "format:nameEntity";
```

Emitted when formatting a named entity

##### FORMAT_SPECIFIED_BY_LINK

```ts
readonly FORMAT_SPECIFIED_BY_LINK: "format:specifiedByLink" = "format:specifiedByLink";
```

Emitted when formatting a specified-by link
