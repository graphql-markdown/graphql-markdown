# events/config-build-events

Config build event constants.

## Variables

### ConfigBuildEvents

```ts
const ConfigBuildEvents: object;
```

Defined in: [packages/core/src/events/config-build-events.ts:10](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/config-build-events.ts#L10)

Event name fired once after the final configuration has been resolved.

#### Type Declaration

##### AFTER\_BUILD

```ts
readonly AFTER_BUILD: "config:afterBuild" = "config:afterBuild";
```

Emitted after the final Options object has been resolved, before generation starts
