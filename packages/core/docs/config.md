# config

## Enumerations

### DeprecatedOption

#### Enumeration Members

##### DEFAULT

```ts
DEFAULT: "default";
```

###### Defined in

[config.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L43)

##### GROUP

```ts
GROUP: "group";
```

###### Defined in

[config.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L44)

##### SKIP

```ts
SKIP: "skip";
```

###### Defined in

[config.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L45)

***

### DiffMethod

#### Enumeration Members

##### FORCE

```ts
FORCE: "FORCE";
```

###### Defined in

[config.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L39)

##### NONE

```ts
NONE: "NONE";
```

###### Defined in

[config.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L38)

***

### TypeHierarchy

#### Enumeration Members

##### API

```ts
API: "api";
```

###### Defined in

[config.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L32)

##### ENTITY

```ts
ENTITY: "entity";
```

###### Defined in

[config.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L33)

##### FLAT

```ts
FLAT: "flat";
```

###### Defined in

[config.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L34)

## Variables

### ASSET\_HOMEPAGE\_LOCATION

```ts
const ASSET_HOMEPAGE_LOCATION: string;
```

#### Defined in

[config.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L50)

***

### DEFAULT\_OPTIONS

```ts
const DEFAULT_OPTIONS: Readonly<Pick<ConfigOptions, "customDirective" | "groupByDirective" | "loaders"> & Required<Omit<ConfigOptions, "customDirective" | "groupByDirective" | "loaders" | "printTypeOptions">>> & object;
```

#### Type declaration

##### printTypeOptions

```ts
printTypeOptions: Required<Omit<ConfigPrintTypeOptions, "hierarchy">> & object;
```

###### Type declaration

###### hierarchy

```ts
hierarchy: Required<Pick<TypeHierarchyObjectType, API>>;
```

#### Defined in

[config.ts:57](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L57)

***

### DOCS\_URL

```ts
const DOCS_URL: "https://graphql-markdown.dev/docs";
```

#### Defined in

[config.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L48)

***

### PACKAGE\_NAME

```ts
const PACKAGE_NAME: "@graphql-markdown/docusaurus";
```

#### Defined in

[config.ts:49](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L49)

## Functions

### buildConfig()

```ts
function buildConfig(
   configFileOpts, 
   cliOpts?, 
id?): Promise<Options>
```

#### Parameters

• **configFileOpts**: `Maybe`\<`ConfigOptions`\>

• **cliOpts?**: `Maybe`\<`CliOptions`\>

• **id?**: `Maybe`\<`string`\> = `"default"`

#### Returns

`Promise`\<`Options`\>

#### Defined in

[config.ts:437](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L437)

***

### getCustomDirectives()

```ts
function getCustomDirectives(customDirectiveOptions, skipDocDirective?): Maybe<CustomDirective>
```

#### Parameters

• **customDirectiveOptions**: `Maybe`\<`CustomDirective`\>

• **skipDocDirective?**: `Maybe`\<`DirectiveName`[]\>

#### Returns

`Maybe`\<`CustomDirective`\>

#### Defined in

[config.ts:192](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L192)

***

### getDiffMethod()

```ts
function getDiffMethod(diff, force): TypeDiffMethod
```

#### Parameters

• **diff**: `TypeDiffMethod`

• **force**: `boolean` = `false`

#### Returns

`TypeDiffMethod`

#### Defined in

[config.ts:225](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L225)

***

### getDocDirective()

```ts
function getDocDirective(name): DirectiveName
```

#### Parameters

• **name**: `Maybe`\<`DirectiveName`\>

#### Returns

`DirectiveName`

#### Defined in

[config.ts:108](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L108)

***

### getDocOptions()

```ts
function getDocOptions(cliOpts?, configOptions?): Required<ConfigDocOptions>
```

#### Parameters

• **cliOpts?**: `Maybe`\<`CliOptions` & `DeprecatedCliOptions`\>

• **configOptions?**: `Maybe`\<`ConfigDocOptions` & `DeprecatedConfigDocOptions`\>

#### Returns

`Required`\<`ConfigDocOptions`\>

#### Defined in

[config.ts:275](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L275)

***

### getOnlyDocDirectives()

```ts
function getOnlyDocDirectives(cliOpts, configFileOpts): DirectiveName[]
```

#### Parameters

• **cliOpts**: `Maybe`\<`CliOptions`\>

• **configFileOpts**: `Maybe`\<`Pick`\<`ConfigOptions`, `"onlyDocDirective"`\>\>

#### Returns

`DirectiveName`[]

#### Defined in

[config.ts:124](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L124)

***

### getPrintTypeOptions()

```ts
function getPrintTypeOptions(cliOpts, configOptions): Required<ConfigPrintTypeOptions>
```

#### Parameters

• **cliOpts**: `Maybe`\<`CliOptions` & `DeprecatedCliOptions`\>

• **configOptions**: `Maybe`\<`ConfigPrintTypeOptions` & `DeprecatedConfigPrintTypeOptions`\>

#### Returns

`Required`\<`ConfigPrintTypeOptions`\>

#### Defined in

[config.ts:372](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L372)

***

### getSkipDocDirectives()

```ts
function getSkipDocDirectives(cliOpts, configFileOpts): DirectiveName[]
```

#### Parameters

• **cliOpts**: `Maybe`\<`CliOptions`\>

• **configFileOpts**: `Maybe`\<`Pick`\<`ConfigOptions`, `"printTypeOptions"` \| `"skipDocDirective"`\>\>

#### Returns

`DirectiveName`[]

#### Defined in

[config.ts:140](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L140)

***

### getTypeHierarchyOption()

```ts
function getTypeHierarchyOption(cliOption?, configOption?): Maybe<Partial<Record<TypeHierarchyValueType, TypeHierarchyTypeOptions>>>
```

#### Parameters

• **cliOption?**: `Maybe`\<`TypeHierarchyValueType`\>

• **configOption?**: `Maybe`\<`TypeHierarchyType`\>

#### Returns

`Maybe`\<`Partial`\<`Record`\<`TypeHierarchyValueType`, `TypeHierarchyTypeOptions`\>\>\>

#### Defined in

[config.ts:292](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L292)

***

### getVisibilityDirectives()

```ts
function getVisibilityDirectives(cliOpts, configFileOpts): object
```

#### Parameters

• **cliOpts**: `Maybe`\<`CliOptions`\>

• **configFileOpts**: `Maybe`\<`Pick`\<`ConfigOptions`, `"printTypeOptions"` \| `"skipDocDirective"` \| `"onlyDocDirective"`\>\>

#### Returns

`object`

##### onlyDocDirective

```ts
onlyDocDirective: DirectiveName[];
```

##### skipDocDirective

```ts
skipDocDirective: DirectiveName[];
```

#### Defined in

[config.ts:167](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L167)

***

### parseDeprecatedDocOptions()

```ts
function parseDeprecatedDocOptions(cliOpts, configOptions): Partial<object>
```

#### Parameters

• **cliOpts**: `Maybe`\<`DeprecatedCliOptions`\>

• **configOptions**: `Maybe`\<`DeprecatedConfigDocOptions`\>

#### Returns

`Partial`\<`object`\>

##### hide\_table\_of\_contents

```ts
hide_table_of_contents: boolean;
```

##### pagination\_next

```ts
pagination_next: null;
```

##### pagination\_prev

```ts
pagination_prev: null;
```

#### Defined in

[config.ts:234](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L234)

***

### parseDeprecatedPrintTypeOptions()

```ts
function parseDeprecatedPrintTypeOptions(cliOpts, configOptions): Partial<object>
```

#### Parameters

• **cliOpts**: `Maybe`\<`DeprecatedCliOptions`\>

• **configOptions**: `Maybe`\<`DeprecatedConfigPrintTypeOptions`\>

#### Returns

`Partial`\<`object`\>

##### hierarchy

```ts
hierarchy: TypeHierarchyType;
```

#### Defined in

[config.ts:340](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L340)

***

### parseGroupByOption()

```ts
function parseGroupByOption(groupOptions): Maybe<GroupByDirectiveOptions>
```

#### Parameters

• **groupOptions**: `unknown`

#### Returns

`Maybe`\<`GroupByDirectiveOptions`\>

#### Defined in

[config.ts:408](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L408)
