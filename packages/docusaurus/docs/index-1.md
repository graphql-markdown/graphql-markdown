# index

Docusaurus integration for running GraphQL-Markdown and wiring CLI commands.

## Functions

### default()

```ts
function default(_, options): Promise<Plugin>;
```

Defined in: [docusaurus/src/index.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/docusaurus/src/index.ts#L28)

Docusaurus plugin wrapper that wires GraphQL-Markdown into the build,
optionally running the CLI during `docusaurus build` and registering
the `graphql-to-doc` command on the local CLI.

#### Parameters

##### \_

`LoadContext`

Load context (unused).

##### options

`ConfigOptions` & `Partial`&lt;`PluginOptions`&gt;

GraphQL-Markdown CLI options plus Docusaurus plugin options.

#### Returns

`Promise`&lt;`Plugin`&gt;

A configured Docusaurus plugin instance.
