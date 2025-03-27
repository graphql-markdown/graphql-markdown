# directives/tag

Custom directive `tag` helper.

## See

[Option `customDirective.[directive].tag`](https://graphql-markdown.dev/docs/advanced/custom-directive#tag)

## Functions

### directiveTag()

```ts
function directiveTag(
   directive, 
   type?, 
   classname?): Badge
```

Defined in: [directives/tag.ts:51](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/helpers/src/directives/tag.ts#L51)

Helper for rendering custom description from schema directive on type.
This is an example on how to build a custom `tag` callback.

#### Parameters

##### directive

`GraphQLDirective`

the schema directive to parse.

##### type?

`unknown`

the type being processed.

##### classname?

`string` = `"badge--secondary"`

optional CSS classname, `"badge--secondary"` by default.

#### Returns

`Badge`

a custom description based on directive value.

#### Example

```js
import { GraphQLDirective, GraphQLScalarType } from "graphql";
import { directiveTag } from "@graphql-markdown/helpers/directives/tag";

const directive = new GraphQLDirective({
  name: "auth",
  description: "Authentication required",
  locations: [],
});

const type = new GraphQLScalarType<string>({
  name: "FooBar",
  astNode: {
    kind: Kind.SCALAR_TYPE_DEFINITION,
    name: { kind: Kind.NAME, value: "FooBar" },
    directives: [
      {
        kind: Kind.DIRECTIVE,
        name: { kind: Kind.NAME, value: "auth" },
      },
    ],
  },
});

directiveTag(directive, type);
// Expected result: { text: "@auth", classname: "badge--secondary" }
```
