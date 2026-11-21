# version

Helpers for gating formatter output on the target framework version.

## Interfaces

### FrameworkVersion

Defined in: [version.ts:10](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/version.ts#L10)

A framework version, narrowed down to the parts used for comparison.

#### Properties

##### major

```ts
major: number;
```

Defined in: [version.ts:11](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/version.ts#L11)

##### minor?

```ts
minor?: number;
```

Defined in: [version.ts:12](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/version.ts#L12)

## Functions

### isFrameworkVersion()

```ts
function isFrameworkVersion(meta, framework, version): boolean;
```

Defined in: [version.ts:109](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/version.ts#L109)

Checks that the generator framework declared in `meta` is `framework`, and
that its version matches `version`.

Only the parts carried by `version` are compared, so `{ major: 2 }` matches
any `2.x` release. An unknown, unparsable or mismatched framework version
returns `false`.

#### Parameters

##### meta

`Maybe`&lt;`MetaInfo`&gt;

Optional metadata carrying the framework name and version

##### framework

`string`

The expected framework name, eg `"docusaurus"`

##### version

[`FrameworkVersion`](#frameworkversion)

The version to match

#### Returns

`boolean`

`true` if the framework and its version match

#### Example

```js
const meta = {
  generatorFrameworkName: "docusaurus",
  generatorFrameworkVersion: "2.4.3",
};

isFrameworkVersion(meta, "docusaurus", { major: 2 }); // true
isFrameworkVersion(meta, "docusaurus", { major: 3 }); // false
```

---

### isFrameworkVersionAtLeast()

```ts
function isFrameworkVersionAtLeast(meta, framework, minVersion): boolean;
```

Defined in: [version.ts:140](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/version.ts#L140)

Checks that the generator framework declared in `meta` is `framework`, and
that its version is `minVersion` or above.

An unknown, unparsable or mismatched framework version returns `false`, so
callers fall back to the output supported by every version.

#### Parameters

##### meta

`Maybe`&lt;`MetaInfo`&gt;

Optional metadata carrying the framework name and version

##### framework

`string`

The expected framework name, eg `"docusaurus"`

##### minVersion

[`FrameworkVersion`](#frameworkversion)

The minimum version required by the caller

#### Returns

`boolean`

`true` if the framework matches and its version is high enough

#### Example

```js
const meta = {
  generatorFrameworkName: "docusaurus",
  generatorFrameworkVersion: "3.10.2",
};

isFrameworkVersionAtLeast(meta, "docusaurus", { major: 3, minor: 10 }); // true
isFrameworkVersionAtLeast(meta, "docusaurus", { major: 4 }); // false
```
