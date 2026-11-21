# rendererHelpers

## Enumerations

### CATEGORY\_STYLE\_CLASS

Defined in: [packages/core/src/rendererHelpers.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L15)

Category CSS classes

#### Enumeration Members

##### API

```ts
API: "graphql-markdown-api-section";
```

Defined in: [packages/core/src/rendererHelpers.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L16)

##### DEPRECATED

```ts
DEPRECATED: "graphql-markdown-deprecated-section";
```

Defined in: [packages/core/src/rendererHelpers.ts:17](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L17)

---

### SidebarPosition

Defined in: [packages/core/src/rendererHelpers.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L21)

Sidebar order

#### Enumeration Members

##### FIRST

```ts
FIRST: 1;
```

Defined in: [packages/core/src/rendererHelpers.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L22)

##### LAST

```ts
LAST: 999;
```

Defined in: [packages/core/src/rendererHelpers.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L23)

## Variables

### API\_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

Defined in: [packages/core/src/rendererHelpers.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L27)

Default API groups

---

### DEPRECATED

```ts
const DEPRECATED: "deprecated";
```

Defined in: [packages/core/src/rendererHelpers.ts:12](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L12)

Constant for deprecated entity grouping

## Functions

### getApiGroupFolder()

```ts
function getApiGroupFolder(type, groups?): string;
```

Defined in: [packages/core/src/rendererHelpers.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L33)

Determine folder for a type

#### Parameters

##### type

`unknown`

##### groups?

`Maybe`&lt;`boolean` \| `ApiGroupOverrideType`&gt;

#### Returns

`string`

---

### isHierarchy()

```ts
function isHierarchy(
  options,
  hierarchy,
): options is ConfigDocOptions & {
  deprecated?: Maybe<TypeDeprecatedOption>;
} & {
  force?: boolean;
  hierarchy?: Maybe<
    Partial<Record<TypeHierarchyValueType, TypeHierarchyTypeOptions>>
  >;
} & { hierarchy: TypeHierarchyObjectType };
```

Defined in: [packages/core/src/rendererHelpers.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L48)

Check hierarchy

#### Parameters

##### options

`Maybe`&lt;`RendererDocOptions`&gt;

##### hierarchy

`TypeHierarchyValueType`

#### Returns

`options is ConfigDocOptions & { deprecated?: Maybe<TypeDeprecatedOption> } & { force?: boolean; hierarchy?: Maybe<Partial<Record<TypeHierarchyValueType, TypeHierarchyTypeOptions>>> } & { hierarchy: TypeHierarchyObjectType }`

---

### stripNumericPrefix()

```ts
function stripNumericPrefix(folderName): string;
```

Defined in: [packages/core/src/rendererHelpers.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/rendererHelpers.ts#L43)

Strip numeric prefix from folder names

#### Parameters

##### folderName

`string`

#### Returns

`string`
