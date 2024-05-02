# const/options

## Enumerations

### SectionLevels

#### Enumeration Members

##### LEVEL\_3

```ts
LEVEL_3: "###";
```

###### Source

[const/options.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L15)

##### LEVEL\_4

```ts
LEVEL_4: "####";
```

###### Source

[const/options.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L16)

##### LEVEL\_5

```ts
LEVEL_5: "#####";
```

###### Source

[const/options.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L17)

##### NONE

```ts
NONE: "";
```

###### Source

[const/options.ts:14](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L14)

## Variables

### DEFAULT\_OPTIONS

```ts
const DEFAULT_OPTIONS: Required<Omit<PrintTypeOptions, 
  | "collapsible"
  | "groups"
  | "level"
  | "onlyDocDirectives"
  | "parentType"
  | "schema"
  | "skipDocDirectives">> & object;
```

#### Type declaration

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

#### Source

[const/options.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L32)

***

### PRINT\_TYPE\_DEFAULT\_OPTIONS

```ts
const PRINT_TYPE_DEFAULT_OPTIONS: Required<PrinterConfigPrintTypeOptions>;
```

#### Source

[const/options.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/const/options.ts#L20)
