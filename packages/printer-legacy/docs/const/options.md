# const/options

## Enumerations

### SectionLevels

Defined in: [printer-legacy/src/const/options.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L31)

#### Enumeration Members

##### LEVEL

```ts
LEVEL: "#";
```

Defined in: [printer-legacy/src/const/options.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L37)

##### ~~NONE~~

```ts
NONE: "";
```

Defined in: [printer-legacy/src/const/options.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L36)

###### Deprecated

Use `SectionLevels.LEVEL` instead.

---

### TypeHierarchy

Defined in: [printer-legacy/src/const/options.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L24)

#### Enumeration Members

##### API

```ts
API: "api";
```

Defined in: [printer-legacy/src/const/options.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L25)

##### ENTITY

```ts
ENTITY: "entity";
```

Defined in: [printer-legacy/src/const/options.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L27)

##### FLAT

```ts
FLAT: "flat";
```

Defined in: [printer-legacy/src/const/options.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L28)

## Variables

### DEFAULT\_OPTIONS

```ts
const DEFAULT_OPTIONS: Required<
  Omit<
    PrintTypeOptions,
    | "collapsible"
    | "decorators"
    | "entity"
    | "exampleSection"
    | "formatCategoryFolderName"
    | "formatMDXTitle"
    | "groups"
    | "level"
    | "meta"
    | "onlyDocDirectives"
    | "parentType"
    | "schema"
    | "skipDocDirectives"
  >
> &
  object;
```

Defined in: [printer-legacy/src/const/options.ts:56](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L56)

Clean runtime options passed through the printer.

#### Type Declaration

##### collapsible

```ts
collapsible: Maybe<CollapsibleOption>;
```

##### decorators

```ts
decorators: PrintTypeOptions["decorators"];
```

##### entity

```ts
entity: PrintTypeOptions["entity"];
```

##### exampleSection

```ts
exampleSection: PrintTypeOptions["exampleSection"];
```

##### formatMDXTitle

```ts
formatMDXTitle: PrintTypeOptions["formatMDXTitle"];
```

##### groups

```ts
groups: Maybe<SchemaEntitiesGroupMap>;
```

##### level

```ts
level: Maybe<SectionLevelValue>;
```

##### onlyDocDirectives

```ts
onlyDocDirectives: GraphQLDirective[];
```

##### parentType

```ts
parentType: Maybe<string>;
```

##### schema

```ts
schema: Maybe<GraphQLSchema>;
```

##### skipDocDirectives

```ts
skipDocDirectives: GraphQLDirective[];
```

---

### PRINT\_TYPE\_DEFAULT\_OPTIONS

```ts
const PRINT_TYPE_DEFAULT_OPTIONS: Required<
  Omit<PrinterConfigPrintTypeOptions, "exampleSection">
> &
  object;
```

Defined in: [printer-legacy/src/const/options.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L40)

#### Type Declaration

##### exampleSection

```ts
exampleSection: PrintTypeOptions["exampleSection"];
```
