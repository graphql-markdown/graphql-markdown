# const/options

## Enumerations

### SectionLevels

Defined in: [printer-legacy/src/const/options.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L21)

#### Enumeration Members

##### LEVEL

```ts
LEVEL: "#";
```

Defined in: [printer-legacy/src/const/options.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L23)

##### NONE

```ts
NONE: "";
```

Defined in: [printer-legacy/src/const/options.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L22)

---

### TypeHierarchy

Defined in: [printer-legacy/src/const/options.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L15)

#### Enumeration Members

##### API

```ts
API: "api";
```

Defined in: [printer-legacy/src/const/options.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L16)

##### ENTITY

```ts
ENTITY: "entity";
```

Defined in: [printer-legacy/src/const/options.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L17)

##### FLAT

```ts
FLAT: "flat";
```

Defined in: [printer-legacy/src/const/options.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L18)

## Variables

### DEFAULT_OPTIONS

```ts
const DEFAULT_OPTIONS: Required<
  Omit<
    PrintTypeOptions,
    | "collapsible"
    | "formatCategoryFolderName"
    | "groups"
    | "level"
    | "meta"
    | "onlyDocDirectives"
    | "parentType"
    | "schema"
    | "skipDocDirectives"
    | "beforeSchemaLoadHook"
    | "afterSchemaLoadHook"
    | "beforeDiffCheckHook"
    | "afterDiffCheckHook"
    | "beforeRenderRootTypesHook"
    | "afterRenderRootTypesHook"
    | "beforeRenderHomepageHook"
    | "afterRenderHomepageHook"
    | "beforeRenderTypeEntitiesHook"
    | "afterRenderTypeEntitiesHook"
    | "beforeGenerateIndexMetafileHook"
    | "afterGenerateIndexMetafileHook"
  >
> &
  object;
```

Defined in: [printer-legacy/src/const/options.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L38)

#### Type Declaration

##### collapsible

```ts
collapsible: Maybe<CollapsibleOption>;
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
const PRINT_TYPE_DEFAULT_OPTIONS: Required<PrinterConfigPrintTypeOptions>;
```

Defined in: [printer-legacy/src/const/options.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L26)
