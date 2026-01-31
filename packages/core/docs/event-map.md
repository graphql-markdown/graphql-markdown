# event-map

Event callback mapping configuration.

This module defines the mappings between event names and their corresponding
callback names in MDX modules. Kept separate to avoid circular dependencies.

## Variables

### EVENT_CALLBACK_MAP

```ts
const EVENT_CALLBACK_MAP: object;
```

Defined in: [event-map.ts:20](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-map.ts#L20)

Event callback mapping configuration.
Maps event names to their corresponding callback names in mdxModule.

#### Type Declaration

##### diff:afterCheck

```ts
readonly diff:afterCheck: "afterCheckDiffHook" = "afterCheckDiffHook";
```

##### diff:beforeCheck

```ts
readonly diff:beforeCheck: "beforeCheckDiffHook" = "beforeCheckDiffHook";
```

##### render:afterGenerateIndexMetafile

```ts
readonly render:afterGenerateIndexMetafile: "afterGenerateIndexMetafileHook" = "afterGenerateIndexMetafileHook";
```

##### render:afterRenderHomepage

```ts
readonly render:afterRenderHomepage: "afterRenderHomepageHook" = "afterRenderHomepageHook";
```

##### render:afterRenderRootTypes

```ts
readonly render:afterRenderRootTypes: "afterRenderRootTypesHook" = "afterRenderRootTypesHook";
```

##### render:afterRenderTypeEntities

```ts
readonly render:afterRenderTypeEntities: "afterRenderTypeEntitiesHook" = "afterRenderTypeEntitiesHook";
```

##### render:beforeGenerateIndexMetafile

```ts
readonly render:beforeGenerateIndexMetafile: "beforeGenerateIndexMetafileHook" = "beforeGenerateIndexMetafileHook";
```

##### render:beforeRenderHomepage

```ts
readonly render:beforeRenderHomepage: "beforeRenderHomepageHook" = "beforeRenderHomepageHook";
```

##### render:beforeRenderRootTypes

```ts
readonly render:beforeRenderRootTypes: "beforeRenderRootTypesHook" = "beforeRenderRootTypesHook";
```

##### render:beforeRenderTypeEntities

```ts
readonly render:beforeRenderTypeEntities: "beforeRenderTypeEntitiesHook" = "beforeRenderTypeEntitiesHook";
```

##### schema:afterLoad

```ts
readonly schema:afterLoad: "afterLoadSchemaHook" = "afterLoadSchemaHook";
```

##### schema:beforeLoad

```ts
readonly schema:beforeLoad: "beforeLoadSchemaHook" = "beforeLoadSchemaHook";
```
