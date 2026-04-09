# const/options

## Enumerations

### SectionLevels

Defined in: [printer-legacy/src/const/options.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L22)

#### Enumeration Members

##### LEVEL

```ts
LEVEL: "#";
```

Defined in: [printer-legacy/src/const/options.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L24)

##### NONE

```ts
NONE: "";
```

Defined in: [printer-legacy/src/const/options.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L23)

---

### TypeHierarchy

Defined in: [printer-legacy/src/const/options.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L16)

#### Enumeration Members

##### API

```ts
API: "api";
```

Defined in: [printer-legacy/src/const/options.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L17)

##### ENTITY

```ts
ENTITY: "entity";
```

Defined in: [printer-legacy/src/const/options.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L18)

##### FLAT

```ts
FLAT: "flat";
```

Defined in: [printer-legacy/src/const/options.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L19)

## Variables

### DEFAULT_OPTIONS

```ts
const DEFAULT_OPTIONS: Required<
  Omit<
    PrintTypeOptions,
    | "afterDiffCheckHook"
    | "afterGenerateIndexMetafileHook"
    | "afterRenderHomepageHook"
    | "afterRenderRootTypesHook"
    | "afterRenderTypeEntitiesHook"
    | "afterSchemaLoadHook"
    | "beforeDiffCheckHook"
    | "beforeGenerateIndexMetafileHook"
    | "beforeRenderHomepageHook"
    | "beforeRenderRootTypesHook"
    | "beforeRenderTypeEntitiesHook"
    | "beforeSchemaLoadHook"
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

Defined in: [printer-legacy/src/const/options.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L54)

Clean runtime options passed through the printer.

Deprecated section toggles are excluded and handled via backward-compat paths.

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

### PRINT_TYPE_DEFAULT_DEPRECATED_OPTIONS

```ts
const PRINT_TYPE_DEFAULT_DEPRECATED_OPTIONS: object;
```

Defined in: [printer-legacy/src/const/options.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L27)

#### Type Declaration

##### codeSection

```ts
codeSection: true;
```

##### exampleSection

```ts
exampleSection: false;
```

##### relatedTypeSection

```ts
relatedTypeSection: true;
```

---

### PRINT_TYPE_DEFAULT_OPTIONS

```ts
const PRINT_TYPE_DEFAULT_OPTIONS: Required<
  Omit<PrinterConfigPrintTypeOptions, "exampleSection">
> &
  object;
```

Defined in: [printer-legacy/src/const/options.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L36)

#### Type Declaration

##### exampleSection

```ts
exampleSection: PrintTypeOptions["exampleSection"];
```
