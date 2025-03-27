---
position: 90
pagination_prev: null
pagination_next: null
---

# Troubleshooting

## Duplicate "graphql" modules cannot be used at the same time

Add a `resolutions` entry to your `package.json` file:

```json title="package.json"
"resolutions": {
  "graphql": "16.9.0"
}
```

## Unable to find any GraphQL type definitions

Try changing the temporary folder for the plugin by setting `tmpDir: "./.docusaurus"` (see [settings](/docs/settings) for more details).

You can also disable the schema diff feature with `diffMethod: "NONE"`.

## Unable to find any GraphQL type definitions for the following pointers

Install and declare the missing GraphQL document loader package, see [schema loading](/docs/advanced/schema-loading).

If the error persists, check that you have the correct class name in the configuration declaration.
