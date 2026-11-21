# ci

## Interfaces

### CiInfo

Defined in: [ci.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/ci.ts#L25)

#### Properties

##### ci

```ts
ci: boolean;
```

Defined in: [ci.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/ci.ts#L26)

##### ciProvider?

```ts
ciProvider?: CiProvider;
```

Defined in: [ci.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/ci.ts#L27)

## Functions

### detectCi()

```ts
function detectCi(env?): CiInfo;
```

Defined in: [ci.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/ci.ts#L30)

#### Parameters

##### env?

`ProcessEnv` = `process.env`

#### Returns

[`CiInfo`](#ciinfo)
