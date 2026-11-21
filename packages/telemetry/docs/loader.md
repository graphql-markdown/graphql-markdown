# loader

## Type Aliases

### LoaderKind

```ts
type LoaderKind =
  | "code-file"
  | "file-json"
  | "file-sdl"
  | "git"
  | "github"
  | "glob"
  | "inline-sdl"
  | "unknown"
  | "url";
```

Defined in: [loader.ts:1](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/loader.ts#L1)

## Functions

### classifyPointer()

```ts
function classifyPointer(pointer): LoaderKind | LoaderKind[];
```

Defined in: [loader.ts:74](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/loader.ts#L74)

Classifies a schema pointer; the pointer itself is never returned. Kinds are
distinct, and a single kind is not wrapped in a list: the number of pointers
could single out a user.

#### Parameters

##### pointer

`unknown`

#### Returns

[`LoaderKind`](#loaderkind) \| [`LoaderKind`](#loaderkind)[]

---

### maskPointer()

```ts
function maskPointer(pointer): string | string[];
```

Defined in: [loader.ts:98](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/loader.ts#L98)

Classifies a schema pointer into mask token(s) for the config slot.

#### Parameters

##### pointer

`unknown`

#### Returns

`string` \| `string`[]
