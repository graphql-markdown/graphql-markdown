# sanitize

## Interfaces

### SanitizeResult

Defined in: [sanitize.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/sanitize.ts#L26)

#### Properties

##### unknownKeys

```ts
unknownKeys: number;
```

Defined in: [sanitize.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/sanitize.ts#L28)

##### value

```ts
value: Record<string, unknown>;
```

Defined in: [sanitize.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/sanitize.ts#L27)

## Type Aliases

### Rule

```ts
type Rule =
  | {
      kind: "any";
    }
  | {
      kind: "enum";
      values: readonly string[];
    }
  | {
      kind: "formatter";
    }
  | {
      kind: "loaders";
    }
  | {
      kind: "map";
      value: Rule;
    }
  | {
      fields: Record<string, Rule>;
      kind: "object";
    }
  | {
      kind: "opaque";
    }
  | {
      kind: "path";
    }
  | {
      kind: "pointer";
    }
  | {
      kind: "scalar";
    }
  | {
      kind: "string";
    }
  | {
      kind: "url";
    };
```

Defined in: [sanitize.ts:12](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/sanitize.ts#L12)

## Variables

### CLI\_RULES

```ts
const CLI_RULES: Readonly<Record<keyof CliOptions, Rule>>;
```

Defined in: [sanitize.ts:105](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/sanitize.ts#L105)

---

### CONFIG\_RULES

```ts
const CONFIG_RULES: Readonly<Record<keyof ConfigOptions, Rule>>;
```

Defined in: [sanitize.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/sanitize.ts#L59)

## Functions

### sanitizeConfig()

```ts
function sanitizeConfig(value, rules): SanitizeResult;
```

Defined in: [sanitize.ts:311](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/sanitize.ts#L311)

Sanitizes a config source. Top-level keys without a rule are dropped and
counted in `unknownKeys`.

#### Parameters

##### value

`unknown`

##### rules

`Record`&lt;`string`, [`Rule`](#rule)&gt;

#### Returns

[`SanitizeResult`](#sanitizeresult)
