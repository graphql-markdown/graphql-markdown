# events/diff-events

Diff checking event constants.

## Variables

### DiffEvents

```ts
const DiffEvents: object;
```

Defined in: [packages/core/src/events/diff-events.ts:10](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/diff-events.ts#L10)

Event names for diff checking lifecycle.

#### Type Declaration

##### AFTER\_CHECK

```ts
readonly AFTER_CHECK: "diff:afterCheck" = "diff:afterCheck";
```

Emitted after checking schema differences

##### BEFORE\_CHECK

```ts
readonly BEFORE_CHECK: "diff:beforeCheck" = "diff:beforeCheck";
```

Emitted before checking schema differences
