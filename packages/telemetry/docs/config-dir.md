# config-dir

## Functions

### resolveConfigDir()

```ts
function resolveConfigDir(platform?, env?, home?): string;
```

Defined in: [config-dir.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/config-dir.ts#L15)

Resolves the OS config directory, like `env-paths` without the dependency.

#### Parameters

##### platform?

`Platform` = `process.platform`

Node platform, defaults to `process.platform`.

##### env?

`ProcessEnv` = `process.env`

Environment variables, defaults to `process.env`.

##### home?

`string` = `...`

Home directory, defaults to `os.homedir()`.

#### Returns

`string`
