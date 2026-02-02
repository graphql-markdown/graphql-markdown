# event-handlers

MDX event handler registration functionality.

This module provides utilities for registering MDX module event handlers
with the event emitter system. It maps event names to callback names and
automatically detects and registers matching callbacks from MDX modules.

## Functions

### registerMDXEventHandlers()

```ts
function registerMDXEventHandlers(mdxModule): void;
```

Defined in: [event-handlers.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/event-handlers.ts#L32)

Registers MDX module event handlers with the event emitter.

Automatically detects and registers any event callback functions defined in the mdxModule
that match the event callback naming convention. Logs registered handlers at debug level.

#### Parameters

##### mdxModule

`unknown`

The MDX module that may contain event callback functions

#### Returns

`void`

#### Example

```typescript
const mdxModule = {
  beforeLoadSchemaHook: async (event) => {
    console.log("Loading schema...");
  },
  afterRenderTypeEntitiesHook: async (event) => {
    console.log("Rendered:", event.data.name);
  },
};
registerMDXEventHandlers(mdxModule);
```
