# hooks

## Classes

### `abstract` Hookable

Defined in: [hooks.ts:6](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L6)

#### Extended by

- [`Renderer`](renderer.md#renderer)

#### Constructors

##### Constructor

```ts
new Hookable(): Hookable;
```

###### Returns

[`Hookable`](#hookable)

#### Properties

##### map

```ts
map: Map<string, Callback[]>;
```

Defined in: [hooks.ts:7](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L7)

#### Methods

##### emit()

```ts
protected emit(hookName, args): unknown[];
```

Defined in: [hooks.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L21)

###### Parameters

###### hookName

`string`

###### args

`unknown`[] = `[]`

###### Returns

`unknown`[]

##### subscribe()

```ts
subscribe(hookName, callback): Subscription;
```

Defined in: [hooks.ts:9](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L9)

###### Parameters

###### hookName

`string`

###### callback

[`Callback`](#callback)

###### Returns

[`Subscription`](#subscription)

## Interfaces

### Subscription

Defined in: [hooks.ts:2](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L2)

#### Properties

##### unsubscribe()

```ts
unsubscribe: () => void;
```

Defined in: [hooks.ts:3](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L3)

###### Returns

`void`

## Type Aliases

### Callback()

```ts
type Callback = (...args) => unknown;
```

Defined in: [hooks.ts:1](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/hooks.ts#L1)

#### Parameters

##### args

...`unknown`[]

#### Returns

`unknown`
