# version

## Variables

### VERSION

```ts
const VERSION: string = "1.27.0";
```

Defined in: [packages/core/src/version.ts:5](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/version.ts#L5)

Package version, kept as a constant (no runtime `package.json` lookup) for ESM/JSR compatibility.
A unit test asserts it matches `package.json`.
