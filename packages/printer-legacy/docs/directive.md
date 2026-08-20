# directive

Provides utilities for handling and printing GraphQL directives in Markdown format

## Functions

### getCustomDirectiveResolver()

```ts
function getCustomDirectiveResolver(
  resolver,
  type,
  constDirectiveOption,
  fallback?,
): Maybe<string>;
```

Defined in: [printer-legacy/src/directive.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L31)

Resolves a custom directive using the provided resolver function

#### Parameters

##### resolver

`CustomDirectiveResolver`

The resolver function name to execute

##### type

`unknown`

The GraphQL type to resolve the directive for

##### constDirectiveOption

`CustomDirectiveMapItem`

The directive configuration options

##### fallback?

`Maybe`&lt;`string`&gt;

Optional fallback value if resolution fails

#### Returns

`Maybe`&lt;`string`&gt;

The resolved directive value or `fallback`/`undefined`

---

### getCustomTags()

```ts
function getCustomTags(type, options): Badge[];
```

Defined in: [printer-legacy/src/directive.ts:129](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L129)

Extracts custom tags from directives for a given type

#### Parameters

##### type

`unknown`

The GraphQL type to get tags for

##### options

`PrintTypeOptions`

General printing options

#### Returns

`Badge`[]

Array of badge configurations from directive tags

---

### printCustomDirective()

```ts
function printCustomDirective(
  type,
  constDirectiveOption,
  options,
): Maybe<string>;
```

Defined in: [printer-legacy/src/directive.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L59)

Prints a custom directive as a Markdown string

#### Parameters

##### type

`unknown`

The GraphQL type to print the directive for

##### constDirectiveOption

`CustomDirectiveMapItem`

The directive configuration options

##### options

`PrintTypeOptions`

General printing options

#### Returns

`Maybe`&lt;`string`&gt;

Formatted Markdown string for the directive or `undefined`

---

### printCustomDirectives()

```ts
function printCustomDirectives(type, options): Maybe<PageSection>;
```

Defined in: [printer-legacy/src/directive.ts:87](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L87)

Prints all custom directives for a type as a Markdown section

#### Parameters

##### type

`unknown`

The GraphQL type to print directives for

##### options

`PrintTypeOptions`

General printing options

#### Returns

`Maybe`&lt;[`PageSection`](events.md#pagesection)&gt;

A "Directives" PageSection, or undefined when no directives are printable

---

### printCustomTags()

```ts
function printCustomTags(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/directive.ts:161](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/directive.ts#L161)

Prints custom directive tags as Markdown badges

#### Parameters

##### type

`unknown`

The GraphQL type to print tags for

##### options

`PrintTypeOptions`

General printing options

#### Returns

`string` \| `MDXString`

Formatted Markdown string of badges or empty string
