# const/options

## Enumerations

### SectionLevels

Defined in: [printer-legacy/src/const/options.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L31)

#### Enumeration Members

##### LEVEL

```ts
LEVEL: "#";
```

Defined in: [printer-legacy/src/const/options.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L38)

##### ~~NONE~~

```ts
NONE: "";
```

Defined in: [printer-legacy/src/const/options.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L37)

###### Deprecated

Use `SectionLevels.LEVEL` instead.

---

### TypeHierarchy

Defined in: [printer-legacy/src/const/options.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L23)

#### Enumeration Members

##### API

```ts
API: "api";
```

Defined in: [printer-legacy/src/const/options.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L24)

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

### DEFAULT_OPTIONS

```ts
const DEFAULT_OPTIONS: Required<
  Omit<
    PrintTypeOptions,
    | "collapsible"
    | "exampleSection"
    | "formatCategoryFolderName"
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

Defined in: [printer-legacy/src/const/options.ts:57](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L57)

Clean runtime options passed through the printer.

#### Type Declaration

##### collapsible

```ts
collapsible: Maybe<CollapsibleOption>;
```

##### exampleSection

```ts
exampleSection: PrintTypeOptions["exampleSection"];
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

### PRINT_TYPE_DEFAULT_OPTIONS

```ts
const PRINT_TYPE_DEFAULT_OPTIONS: Required<
  Omit<PrinterConfigPrintTypeOptions, "exampleSection">
> &
  object;
```

Defined in: [printer-legacy/src/const/options.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L41)

#### Type Declaration

##### exampleSection

```ts
exampleSection: PrintTypeOptions["exampleSection"];
```
