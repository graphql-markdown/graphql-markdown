# directives/with-directive

`decorators` render helper for directive-definition-only content.

## Functions

### withDirective()

```ts
function withDirective(name, render): DecoratorRenderer;
```

Defined in: [directives/with-directive.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/directives/with-directive.ts#L47)

Builds a decorator `render` for content derived from a directive's own
definition — not per-occurrence argument values, so no `resolve` is
needed. Looks the directive up once and skips the decorator (renders
nothing) when it is absent from the schema, sparing `render` its own
`getDirectiveFromSchema` call and null check.

#### Parameters

##### name

`string`

the schema directive name to resolve.

##### render

(`directive`, `options`, `context`) => `Maybe`&lt;`string`&gt;

called with the resolved directive, the print options, and
the decorator's context, only when the directive is present in the schema.

#### Returns

`DecoratorRenderer`

a DecoratorRenderer for use as a decorator's `render`.

#### Example

```js
import { withDirective } from "@graphql-markdown/helpers/directives/with-directive";
import { directiveDescriptor } from "@graphql-markdown/helpers/directives/descriptor";
import { hasDirectiveNamed } from "@graphql-markdown/graphql";

decorators: {
  authDescription: {
    predicate: hasDirectiveNamed("auth"),
    position: { into: "description" },
    render: withDirective("auth", (directive, options, { type }) =>
      directiveDescriptor(directive, type, "Requires the `${requires}` role."),
    ),
  },
}
```
