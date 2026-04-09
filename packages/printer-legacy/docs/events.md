# events

Print type event classes.

Event classes for print operations that allow handlers to modify the generated output.

## Events

### BeforeComposePageTypeEvent

Defined in: [printer-legacy/src/events.ts:114](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/events.ts#L114)

Event emitted before composing page sections for a GraphQL type.

This event fires after section content is generated and before sections are joined into final output.
The `output` property contains an array of content section keys that will be included in the final page,
in addition to fixed header sections (`header`, `metatags`, `mdxDeclaration`) which are managed separately
by the printer and always prepended. Handlers can reorder, filter, or append to this array to control the
structure of the content portion of the page.

#### Example

```typescript
events.on(
  PrintTypeEvents.BEFORE_COMPOSE_PAGE_TYPE,
  (event: BeforeComposePageTypeEvent) => {
    // Move relations section before metadata
    const idx = event.output.indexOf("relations");
    if (idx > -1) {
      event.output.splice(idx, 1);
      const metaidx = event.output.indexOf("metadata");
      event.output.splice(metaidx, 0, "relations");
    }
  },
);
```

#### Extends

- `DataOutputEvent`&lt;[`ComposePageTypeEventData`](#composepagetypeeventdata), keyof [`PageSections`](#pagesections)[]&gt;

#### Constructors

##### Constructor

```ts
new BeforeComposePageTypeEvent(
   data,
   initialOutput,
   options?): BeforeComposePageTypeEvent;
```

Defined in: [printer-legacy/src/events.ts:118](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/events.ts#L118)

###### Parameters

###### data

[`ComposePageTypeEventData`](#composepagetypeeventdata)

###### initialOutput

keyof [`PageSections`](#pagesections)[]

###### options?

`CancellableEventOptions`

###### Returns

[`BeforeComposePageTypeEvent`](#beforecomposepagetypeevent)

###### Overrides

```ts
DataOutputEvent<
  ComposePageTypeEventData,
  (keyof PageSections)[]
>.constructor
```

#### Properties

##### data

```ts
readonly data: ComposePageTypeEventData;
```

Defined in: utils/dist/events.d.ts:111

Read-only event data payload.

###### Inherited from

```ts
DataOutputEvent.data;
```

##### output

```ts
output: keyof PageSections[];
```

Defined in: utils/dist/events.d.ts:127

The generated output.
Handlers can modify this property to change the final result.

###### Inherited from

```ts
DataOutputEvent.output;
```

#### Accessors

##### defaultAction

###### Get Signature

```ts
get defaultAction(): DefaultAction | undefined;
```

Defined in: utils/dist/events.d.ts:78

Gets the default action function if one was provided.

###### Returns

`DefaultAction` \| `undefined`

###### Inherited from

```ts
DataOutputEvent.defaultAction;
```

##### defaultPrevented

###### Get Signature

```ts
get defaultPrevented(): boolean;
```

Defined in: utils/dist/events.d.ts:70

Gets whether the default action has been prevented.

###### Returns

`boolean`

###### Set Signature

```ts
set defaultPrevented(value): void;
```

Defined in: utils/dist/events.d.ts:82

Allows setting defaultPrevented to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Inherited from

```ts
DataOutputEvent.defaultPrevented;
```

##### propagationStopped

###### Get Signature

```ts
get propagationStopped(): boolean;
```

Defined in: utils/dist/events.d.ts:74

Gets whether propagation has been stopped.

###### Returns

`boolean`

###### Set Signature

```ts
set propagationStopped(value): void;
```

Defined in: utils/dist/events.d.ts:86

Allows setting propagationStopped to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Inherited from

```ts
DataOutputEvent.propagationStopped;
```

#### Methods

##### preventDefault()

```ts
preventDefault(): void;
```

Defined in: utils/dist/events.d.ts:91

Prevents the default action from executing.
Only works if the event is cancellable.

###### Returns

`void`

###### Inherited from

```ts
DataOutputEvent.preventDefault;
```

##### runDefaultAction()

```ts
runDefaultAction(): Promise<void>;
```

Defined in: utils/dist/events.d.ts:100

Executes the default action for an event if it hasn't been prevented.

###### Returns

`Promise`&lt;`void`&gt;

###### Inherited from

```ts
DataOutputEvent.runDefaultAction;
```

##### stopPropagation()

```ts
stopPropagation(): void;
```

Defined in: utils/dist/events.d.ts:96

Stops propagation to remaining event handlers.
Handlers registered after the current one will not execute.

###### Returns

`void`

###### Inherited from

```ts
DataOutputEvent.stopPropagation;
```

---

### PrintCodeEvent

Defined in: [printer-legacy/src/events.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/events.ts#L48)

Event emitted around code block generation for a GraphQL type.

The `output` property is mutable, allowing event handlers to modify
the generated code before it's included in the documentation.

#### Example

```typescript
events.on(PrintTypeEvents.AFTER_PRINT_CODE, (event: PrintCodeEvent) => {
  // Add a comment to all generated code
  event.output = `# Auto-generated\n${event.output}`;
});
```

#### Extends

- `DataOutputEvent`&lt;[`PrintCodeEventData`](#printcodeeventdata-1), `string`&gt;

#### Implements

- `IPrintCodeEvent`

#### Constructors

##### Constructor

```ts
new PrintCodeEvent(
   data,
   initialOutput,
   options?): PrintCodeEvent;
```

Defined in: [printer-legacy/src/events.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/events.ts#L52)

###### Parameters

###### data

[`PrintCodeEventData`](#printcodeeventdata-1)

###### initialOutput

`string`

###### options?

`CancellableEventOptions`

###### Returns

[`PrintCodeEvent`](#printcodeevent)

###### Overrides

```ts
DataOutputEvent<PrintCodeEventData, string>.constructor
```

#### Properties

##### data

```ts
readonly data: PrintCodeEventData;
```

Defined in: utils/dist/events.d.ts:111

Read-only event data payload.

###### Implementation of

```ts
IPrintCodeEvent.data;
```

###### Inherited from

```ts
DataOutputEvent.data;
```

##### output

```ts
output: string;
```

Defined in: utils/dist/events.d.ts:127

The generated output.
Handlers can modify this property to change the final result.

###### Implementation of

```ts
IPrintCodeEvent.output;
```

###### Inherited from

```ts
DataOutputEvent.output;
```

#### Accessors

##### defaultAction

###### Get Signature

```ts
get defaultAction(): DefaultAction | undefined;
```

Defined in: utils/dist/events.d.ts:78

Gets the default action function if one was provided.

###### Returns

`DefaultAction` \| `undefined`

###### Implementation of

```ts
IPrintCodeEvent.defaultAction;
```

###### Inherited from

[`PrintTypeEvent`](#printtypeevent).[`defaultAction`](#defaultaction-2)

##### defaultPrevented

###### Get Signature

```ts
get defaultPrevented(): boolean;
```

Defined in: utils/dist/events.d.ts:70

Gets whether the default action has been prevented.

###### Returns

`boolean`

###### Set Signature

```ts
set defaultPrevented(value): void;
```

Defined in: utils/dist/events.d.ts:82

Allows setting defaultPrevented to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Implementation of

```ts
IPrintCodeEvent.defaultPrevented;
```

###### Inherited from

```ts
DataOutputEvent.defaultPrevented;
```

##### propagationStopped

###### Get Signature

```ts
get propagationStopped(): boolean;
```

Defined in: utils/dist/events.d.ts:74

Gets whether propagation has been stopped.

###### Returns

`boolean`

###### Set Signature

```ts
set propagationStopped(value): void;
```

Defined in: utils/dist/events.d.ts:86

Allows setting propagationStopped to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Implementation of

```ts
IPrintCodeEvent.propagationStopped;
```

###### Inherited from

```ts
DataOutputEvent.propagationStopped;
```

#### Methods

##### preventDefault()

```ts
preventDefault(): void;
```

Defined in: utils/dist/events.d.ts:91

Prevents the default action from executing.
Only works if the event is cancellable.

###### Returns

`void`

###### Implementation of

```ts
IPrintCodeEvent.preventDefault;
```

###### Inherited from

```ts
DataOutputEvent.preventDefault;
```

##### runDefaultAction()

```ts
runDefaultAction(): Promise<void>;
```

Defined in: utils/dist/events.d.ts:100

Executes the default action for an event if it hasn't been prevented.

###### Returns

`Promise`&lt;`void`&gt;

###### Implementation of

```ts
IPrintCodeEvent.runDefaultAction;
```

###### Inherited from

```ts
DataOutputEvent.runDefaultAction;
```

##### stopPropagation()

```ts
stopPropagation(): void;
```

Defined in: utils/dist/events.d.ts:96

Stops propagation to remaining event handlers.
Handlers registered after the current one will not execute.

###### Returns

`void`

###### Implementation of

```ts
IPrintCodeEvent.stopPropagation;
```

###### Inherited from

```ts
DataOutputEvent.stopPropagation;
```

---

### PrintTypeEvent

Defined in: [printer-legacy/src/events.ts:77](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/events.ts#L77)

Event emitted around full documentation generation for a GraphQL type.

The `output` property is mutable, allowing event handlers to modify
the complete generated documentation.

#### Example

```typescript
events.on(PrintTypeEvents.AFTER_PRINT_TYPE, (event: PrintTypeEvent) => {
  // Add a footer to all type documentation
  event.output = `${event.output}\n\n---\nGenerated by GraphQL-Markdown`;
});
```

#### Extends

- `DataOutputEvent`&lt;[`PrintTypeEventData`](#printtypeeventdata-1), `Maybe`&lt;`MDXString`&gt;&gt;

#### Implements

- `IPrintTypeEvent`

#### Constructors

##### Constructor

```ts
new PrintTypeEvent(
   data,
   initialOutput,
   options?): PrintTypeEvent;
```

Defined in: [printer-legacy/src/events.ts:81](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/events.ts#L81)

###### Parameters

###### data

[`PrintTypeEventData`](#printtypeeventdata-1)

###### initialOutput

`Maybe`&lt;`MDXString`&gt;

###### options?

`CancellableEventOptions`

###### Returns

[`PrintTypeEvent`](#printtypeevent)

###### Overrides

```ts
DataOutputEvent<PrintTypeEventData, Maybe<MDXString>>.constructor
```

#### Properties

##### data

```ts
readonly data: PrintTypeEventData;
```

Defined in: utils/dist/events.d.ts:111

Read-only event data payload.

###### Implementation of

```ts
IPrintTypeEvent.data;
```

###### Inherited from

```ts
DataOutputEvent.data;
```

##### output

```ts
output: Maybe;
```

Defined in: utils/dist/events.d.ts:127

The generated output.
Handlers can modify this property to change the final result.

###### Implementation of

```ts
IPrintTypeEvent.output;
```

###### Inherited from

```ts
DataOutputEvent.output;
```

#### Accessors

##### defaultAction

###### Get Signature

```ts
get defaultAction(): DefaultAction | undefined;
```

Defined in: utils/dist/events.d.ts:78

Gets the default action function if one was provided.

###### Returns

`DefaultAction` \| `undefined`

###### Implementation of

```ts
IPrintTypeEvent.defaultAction;
```

###### Inherited from

```ts
DataOutputEvent.defaultAction;
```

##### defaultPrevented

###### Get Signature

```ts
get defaultPrevented(): boolean;
```

Defined in: utils/dist/events.d.ts:70

Gets whether the default action has been prevented.

###### Returns

`boolean`

###### Set Signature

```ts
set defaultPrevented(value): void;
```

Defined in: utils/dist/events.d.ts:82

Allows setting defaultPrevented to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Implementation of

```ts
IPrintTypeEvent.defaultPrevented;
```

###### Inherited from

```ts
DataOutputEvent.defaultPrevented;
```

##### propagationStopped

###### Get Signature

```ts
get propagationStopped(): boolean;
```

Defined in: utils/dist/events.d.ts:74

Gets whether propagation has been stopped.

###### Returns

`boolean`

###### Set Signature

```ts
set propagationStopped(value): void;
```

Defined in: utils/dist/events.d.ts:86

Allows setting propagationStopped to true directly.

###### Parameters

###### value

`boolean`

###### Returns

`void`

###### Implementation of

```ts
IPrintTypeEvent.propagationStopped;
```

###### Inherited from

```ts
DataOutputEvent.propagationStopped;
```

#### Methods

##### preventDefault()

```ts
preventDefault(): void;
```

Defined in: utils/dist/events.d.ts:91

Prevents the default action from executing.
Only works if the event is cancellable.

###### Returns

`void`

###### Implementation of

```ts
IPrintTypeEvent.preventDefault;
```

###### Inherited from

```ts
DataOutputEvent.preventDefault;
```

##### runDefaultAction()

```ts
runDefaultAction(): Promise<void>;
```

Defined in: utils/dist/events.d.ts:100

Executes the default action for an event if it hasn't been prevented.

###### Returns

`Promise`&lt;`void`&gt;

###### Implementation of

```ts
IPrintTypeEvent.runDefaultAction;
```

###### Inherited from

```ts
DataOutputEvent.runDefaultAction;
```

##### stopPropagation()

```ts
stopPropagation(): void;
```

Defined in: utils/dist/events.d.ts:96

Stops propagation to remaining event handlers.
Handlers registered after the current one will not execute.

###### Returns

`void`

###### Implementation of

```ts
IPrintTypeEvent.stopPropagation;
```

###### Inherited from

```ts
DataOutputEvent.stopPropagation;
```

## Other

### ComposePageTypeEventData

Defined in: [types/src/printer.d.ts:114](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L114)

Data payload for compose page type events.

#### Properties

##### name

```ts
readonly name: Maybe<string>;
```

Defined in: [types/src/printer.d.ts:118](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L118)

The name identifier for the type

##### options

```ts
readonly options: PrintTypeOptions;
```

Defined in: [types/src/printer.d.ts:120](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L120)

The print options in effect

##### sections

```ts
readonly sections: PageSections;
```

Defined in: [types/src/printer.d.ts:122](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L122)

The map of all page sections (mutable in BEFORE event)

##### type

```ts
readonly type: unknown;
```

Defined in: [types/src/printer.d.ts:116](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L116)

The GraphQL type being composed

---

### PageSection

Defined in: [types/src/printer.d.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L24)

Represents a single section of a page with optional title and content.

#### Properties

##### content?

```ts
optional content?:
  | string
  | MDXString
  | PageSection
  | PageSection[];
```

Defined in: [types/src/printer.d.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L30)

The section content

##### level?

```ts
optional level?: number;
```

Defined in: [types/src/printer.d.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L28)

Optional section level for hierarchical structuring

##### title?

```ts
optional title?: string | MDXString;
```

Defined in: [types/src/printer.d.ts:26](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L26)

Optional title/heading for the section

---

### PageSections

Defined in: [types/src/printer.d.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L36)

Map of all available sections in a type page.

#### Indexable

```ts
[key: string]: Maybe<PageSection | PageHeader>
```

Additional custom sections can be added by event handlers

#### Properties

##### code?

```ts
optional code?: PageSection;
```

Defined in: [types/src/printer.d.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L50)

GraphQL code block

##### customDirectives?

```ts
optional customDirectives?: PageSection;
```

Defined in: [types/src/printer.d.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L52)

Custom directives

##### description?

```ts
optional description?: PageSection;
```

Defined in: [types/src/printer.d.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L48)

Type description from GraphQL comments

##### example?

```ts
optional example?: PageSection;
```

Defined in: [types/src/printer.d.ts:56](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L56)

Usage examples

##### header?

```ts
optional header?: PageHeader;
```

Defined in: [types/src/printer.d.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L40)

YAML frontmatter or top-level heading

##### mdxDeclaration?

```ts
optional mdxDeclaration?: PageHeader;
```

Defined in: [types/src/printer.d.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L44)

MDX import declarations

##### metadata?

```ts
optional metadata?: PageSection;
```

Defined in: [types/src/printer.d.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L54)

Type metadata (fields, arguments, etc.)

##### metatags?

```ts
optional metatags?: PageHeader;
```

Defined in: [types/src/printer.d.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L42)

HTML meta tags

##### relations?

```ts
optional relations?: PageSection;
```

Defined in: [types/src/printer.d.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L58)

Related types

##### tags?

```ts
optional tags?: PageSection;
```

Defined in: [types/src/printer.d.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L46)

Custom tags (e.g., @deprecated)

---

### PrintCodeEventData

Defined in: [types/src/printer.d.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L64)

Data payload for print code events.

#### Properties

##### options

```ts
readonly options: PrintTypeOptions;
```

Defined in: [types/src/printer.d.ts:70](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L70)

The print options in effect

##### type

```ts
readonly type: unknown;
```

Defined in: [types/src/printer.d.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L66)

The GraphQL type being printed

##### typeName

```ts
readonly typeName: string;
```

Defined in: [types/src/printer.d.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L68)

The name of the type

---

### PrintTypeEventData

Defined in: [types/src/printer.d.ts:76](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L76)

Data payload for print type events.

#### Properties

##### name

```ts
readonly name: Maybe<string>;
```

Defined in: [types/src/printer.d.ts:80](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L80)

The name identifier for the type

##### options

```ts
readonly options: PrintTypeOptions;
```

Defined in: [types/src/printer.d.ts:82](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L82)

The print options in effect

##### type

```ts
readonly type: unknown;
```

Defined in: [types/src/printer.d.ts:78](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/types/src/printer.d.ts#L78)

The GraphQL type being printed
