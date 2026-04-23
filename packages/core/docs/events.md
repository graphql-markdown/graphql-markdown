# events

Event system for GraphQL-Markdown.

## Interfaces

### ComposePageTypeEventData

Defined in: [types/src/printer.d.ts:114](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L114)

Data payload for compose page type events.

#### Properties

##### name

```ts
readonly name: Maybe<string>;
```

Defined in: [types/src/printer.d.ts:118](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L118)

The name identifier for the type

##### options

```ts
readonly options: PrintTypeOptions;
```

Defined in: [types/src/printer.d.ts:120](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L120)

The print options in effect

##### sections

```ts
readonly sections: PageSections;
```

Defined in: [types/src/printer.d.ts:122](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L122)

The map of all page sections (mutable in BEFORE event)

##### type

```ts
readonly type: unknown;
```

Defined in: [types/src/printer.d.ts:116](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L116)

The GraphQL type being composed

---

### PageSection

Defined in: [types/src/printer.d.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L24)

Represents a single section of a page with optional title and content.

#### Properties

##### content?

```ts
optional content?:
  | string
  | MDXString
  | PageSection
  | PageSection[];
```

Defined in: [types/src/printer.d.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L30)

The section content

##### level?

```ts
optional level?: number;
```

Defined in: [types/src/printer.d.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L28)

Optional section level for hierarchical structuring

##### title?

```ts
optional title?: string | MDXString;
```

Defined in: [types/src/printer.d.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L26)

Optional title/heading for the section

---

### PageSections

Defined in: [types/src/printer.d.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L36)

Map of all available sections in a type page.

#### Indexable

```ts
[key: string]: Maybe<PageSection | PageHeader>
```

Additional custom sections can be added by event handlers

#### Properties

##### code?

```ts
optional code?: PageSection;
```

Defined in: [types/src/printer.d.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L50)

GraphQL code block

##### customDirectives?

```ts
optional customDirectives?: PageSection;
```

Defined in: [types/src/printer.d.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L52)

Custom directives

##### description?

```ts
optional description?: PageSection;
```

Defined in: [types/src/printer.d.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L48)

Type description from GraphQL comments

##### example?

```ts
optional example?: PageSection;
```

Defined in: [types/src/printer.d.ts:56](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L56)

Usage examples

##### header?

```ts
optional header?: PageHeader;
```

Defined in: [types/src/printer.d.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L40)

YAML frontmatter or top-level heading

##### mdxDeclaration?

```ts
optional mdxDeclaration?: PageHeader;
```

Defined in: [types/src/printer.d.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L44)

MDX import declarations

##### metadata?

```ts
optional metadata?: PageSection;
```

Defined in: [types/src/printer.d.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L54)

Type metadata (fields, arguments, etc.)

##### metatags?

```ts
optional metatags?: PageHeader;
```

Defined in: [types/src/printer.d.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L42)

HTML meta tags

##### relations?

```ts
optional relations?: PageSection;
```

Defined in: [types/src/printer.d.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L58)

Related types

##### tags?

```ts
optional tags?: PageSection;
```

Defined in: [types/src/printer.d.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L46)

Custom tags (e.g., @deprecated)

---

### PrintCodeEventData

Defined in: [types/src/printer.d.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L64)

Data payload for print code events.

#### Properties

##### options

```ts
readonly options: PrintTypeOptions;
```

Defined in: [types/src/printer.d.ts:70](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L70)

The print options in effect

##### type

```ts
readonly type: unknown;
```

Defined in: [types/src/printer.d.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L66)

The GraphQL type being printed

##### typeName

```ts
readonly typeName: string;
```

Defined in: [types/src/printer.d.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L68)

The name of the type

---

### PrintTypeEventData

Defined in: [types/src/printer.d.ts:76](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L76)

Data payload for print type events.

#### Properties

##### name

```ts
readonly name: Maybe<string>;
```

Defined in: [types/src/printer.d.ts:80](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L80)

The name identifier for the type

##### options

```ts
readonly options: PrintTypeOptions;
```

Defined in: [types/src/printer.d.ts:82](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L82)

The print options in effect

##### type

```ts
readonly type: unknown;
```

Defined in: [types/src/printer.d.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L78)

The GraphQL type being printed
