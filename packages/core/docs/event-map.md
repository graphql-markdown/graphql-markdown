# event-map

Event callback mapping configuration.

This module defines the mappings between event names and their corresponding
callback names in MDX modules. Kept separate to avoid circular dependencies.

## Variables

### EVENT_CALLBACK_MAP

```ts
const EVENT_CALLBACK_MAP: object;
```

Defined in: [core/src/event-map.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-map.ts#L25)

Event callback mapping configuration.
Maps event names to their corresponding callback names in mdxModule.

Note: Format functions (formatMDXBadge, formatMDXAdmonition, etc.) are NOT included here.
They are pure transformations handled via the Formatter interface, not events.

#### Type Declaration

##### diff:afterCheck

```ts
readonly diff:afterCheck: "afterCheckDiffHook" = "afterCheckDiffHook";
```

##### diff:beforeCheck

```ts
readonly diff:beforeCheck: "beforeCheckDiffHook" = "beforeCheckDiffHook";
```

##### print:afterPrintCode

```ts
readonly print:afterPrintCode: "afterPrintCodeHook" = "afterPrintCodeHook";
```

##### print:afterPrintType

```ts
readonly print:afterPrintType: "afterPrintTypeHook" = "afterPrintTypeHook";
```

##### print:beforeComposePageType

```ts
readonly print:beforeComposePageType: "beforeComposePageTypeHook" = "beforeComposePageTypeHook";
```

##### print:beforePrintCode

```ts
readonly print:beforePrintCode: "beforePrintCodeHook" = "beforePrintCodeHook";
```

##### print:beforePrintType

```ts
readonly print:beforePrintType: "beforePrintTypeHook" = "beforePrintTypeHook";
```

##### render:afterGenerateIndexMetafile

```ts
readonly render:afterGenerateIndexMetafile: "afterGenerateIndexMetafileHook" = "afterGenerateIndexMetafileHook";
```

##### render:afterRenderFiles

```ts
readonly render:afterRenderFiles: "afterRenderFilesHook" = "afterRenderFilesHook";
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
