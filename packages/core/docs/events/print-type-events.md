# events/print-type-events

Print type event constants.

Events emitted during the printing phase of type documentation generation.
These events allow interception and modification of the generated code output.

## Variables

### PrintTypeEvents

```ts
const PrintTypeEvents: object;
```

Defined in: [core/src/events/print-type-events.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/events/print-type-events.ts#L25)

Event names for printing type documentation.

#### Type Declaration

##### AFTER_PRINT_CODE

```ts
readonly AFTER_PRINT_CODE: "print:afterPrintCode" = "print:afterPrintCode";
```

Emitted after generating the code block for a type (output can be modified)

##### AFTER_PRINT_TYPE

```ts
readonly AFTER_PRINT_TYPE: "print:afterPrintType" = "print:afterPrintType";
```

Emitted after generating the full type documentation (output can be modified)

##### BEFORE_COMPOSE_PAGE_TYPE

```ts
readonly BEFORE_COMPOSE_PAGE_TYPE: "print:beforeComposePageType" = "print:beforeComposePageType";
```

Emitted before composing page sections (can modify section content)

##### BEFORE_PRINT_CODE

```ts
readonly BEFORE_PRINT_CODE: "print:beforePrintCode" = "print:beforePrintCode";
```

Emitted before generating the code block for a type

##### BEFORE_PRINT_TYPE

```ts
readonly BEFORE_PRINT_TYPE: "print:beforePrintType" = "print:beforePrintType";
```

Emitted before generating the full type documentation

#### Example

```typescript
import { getEvents, PrintTypeEvents } from "@graphql-markdown/core";
import { PrintCodeEvent } from "@graphql-markdown/printer-legacy";

const events = getEvents();
events.on(PrintTypeEvents.AFTER_PRINT_CODE, (event: PrintCodeEvent) => {
  // Modify the generated code
  event.output = event.output.toUpperCase();
});
```
