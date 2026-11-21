# module

Runtime module specifier helpers.

## Functions

### runtimeModuleSpecifier()

```ts
function runtimeModuleSpecifier(name, range?): string;
```

Defined in: [module.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/module.ts#L26)

Resolves a module specifier for dynamic `import()` at runtime.

Node.js and Bun resolve bare names from `node_modules`, but Deno does not resolve them from
inside a JSR package. On Deno, `@graphql-markdown/*` names are prefixed with `jsr:` and other
bare names with `npm:`. Relative, absolute, URL and already prefixed specifiers are untouched.

#### Parameters

##### name

`string`

the module specifier.

##### range?

`string`

optional version range inserted after the package name (e.g. `^3.8.3`).

#### Returns

`string`

the specifier to pass to `import()`.

#### Example

```ts
runtimeModuleSpecifier("prettier", "^3.8.3"); // Deno: "npm:prettier@^3.8.3", else "prettier"
```
