# events/render-files-events

Render files event constants.

## Variables

### RenderFilesEvents

```ts
const RenderFilesEvents: object;
```

Defined in: [core/src/events/render-files-events.ts:10](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/render-files-events.ts#L10)

Event names fired once after all output files (entities + homepage) are written.

#### Type Declaration

##### AFTER_RENDER

```ts
readonly AFTER_RENDER: "render:afterRenderFiles" = "render:afterRenderFiles";
```

Emitted after all files have been written
