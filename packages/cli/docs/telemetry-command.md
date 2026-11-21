# telemetry-command

`telemetry <enable|disable|status>` command.
All output goes to stderr so piped stdout stays clean.

## Functions

### getTelemetryCommand()

```ts
function getTelemetryCommand(env?): Command;
```

Defined in: [telemetry-command.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/telemetry-command.ts#L54)

Builds the `telemetry` command.

#### Parameters

##### env?

`ProcessEnv` = `process.env`

Environment, injectable for tests.

#### Returns

`Command`
