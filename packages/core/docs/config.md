# config

## Enumerations

### DeprecatedOption

#### Enumeration Members

##### DEFAULT

```ts
DEFAULT: "default";
```

###### Defined in

[config.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L33)

##### GROUP

```ts
GROUP: "group";
```

###### Defined in

[config.ts:34](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L34)

##### SKIP

```ts
SKIP: "skip";
```

###### Defined in

[config.ts:35](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L35)

***

### DiffMethod

#### Enumeration Members

##### FORCE

```ts
FORCE: "FORCE";
```

###### Defined in

[config.ts:29](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L29)

##### NONE

```ts
NONE: "NONE";
```

###### Defined in

[config.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L28)

## Variables

### ASSET\_HOMEPAGE\_LOCATION

```ts
const ASSET_HOMEPAGE_LOCATION: string;
```

#### Defined in

[config.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L40)

***

### DEFAULT\_OPTIONS

```ts
const DEFAULT_OPTIONS: Readonly<Pick<ConfigOptions, "customDirective" | "groupByDirective" | "loaders"> & Required<Omit<ConfigOptions, "customDirective" | "groupByDirective" | "loaders">>>;
```

#### Defined in

[config.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L47)

***

### DOCS\_URL

```ts
const DOCS_URL: "https://graphql-markdown.dev/docs";
```

#### Defined in

[config.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L38)

***

### PACKAGE\_NAME

```ts
const PACKAGE_NAME: "@graphql-markdown/docusaurus";
```

#### Defined in

[config.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L39)

## Functions

### buildConfig()

```ts
function buildConfig(
   configFileOpts, 
   cliOpts, 
id): Promise<Options>
```

#### Parameters

• **configFileOpts**: `Maybe`\<`ConfigOptions`\>

• **cliOpts**: `Maybe`\<`CliOptions`\>

• **id**: `Maybe`\<`string`\> = `"default"`

#### Returns

`Promise`\<`Options`\>

#### Defined in

[config.ts:330](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L330)

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

[config.ts:170](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L170)

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

[config.ts:203](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L203)

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

[config.ts:86](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L86)

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

[config.ts:253](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L253)

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

[config.ts:102](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L102)

***

### getPrintTypeOptions()

```ts
function getPrintTypeOptions(cliOpts, configOptions): Required<ConfigPrintTypeOptions>
```

#### Parameters

• **cliOpts**: `Maybe`\<`CliOptions`\>

• **configOptions**: `Maybe`\<`ConfigPrintTypeOptions`\>

#### Returns

`Required`\<`ConfigPrintTypeOptions`\>

#### Defined in

[config.ts:270](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L270)

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

[config.ts:118](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L118)

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

[config.ts:145](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L145)

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

[config.ts:212](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L212)

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

[config.ts:301](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/config.ts#L301)
