---
position: 90
pagination_prev: null
pagination_next: null
---

# Troubleshooting

## Duplicate "graphql" modules cannot be used at the same time

Add a `resolutions` entry to your `package.json`:

```json title="package.json"
"resolutions": 
{
  "graphql": "16.9.0"
}
```

## Unable to find any GraphQL type definitions

There are several potential solutions:

1. Change the temporary folder location:
```js
{
  tmpDir: "./.docusaurus"
}
```

2. Disable schema diff feature:
```js
{
  diffMethod: "NONE" 
}
```

3. Check file permissions on the temporary directory

### Schema Loading Issues

1. Ensure required loaders are installed:
```shell
npm install @graphql-tools/url-loader @graphql-tools/json-file-loader
```

2. Verify loader configuration:
```js
{
  loaders: {
    UrlLoader: "@graphql-tools/url-loader",
    JsonFileLoader: "@graphql-tools/json-file-loader"
  }
}
```

### "UrlLoader" does not exist in type "LoaderOption".ts

*Reported in [#2213](https://github.com/graphql-markdown/graphql-markdown/issues/2213).*

```
Object literal may only specify known properties, and 'UrlLoader' does not exist in type 'LoaderOption'.ts(2353)
core.d.ts(128, 3): The expected type comes from property 'loaders' which is declared here on type 'ConfigOptions'
```

Cast the `loaders` as LoaderOption

```ts
loaders: {
  UrlLoader: {
    module: "@graphql-tools/url-loader",
    options: {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      },
    },
  },
} as LoaderOption,
```

### Memory Issues During Generation

For large schemas, try:

1. Increase Node.js memory limit:
```shell
NODE_OPTIONS=--max-old-space-size=4096 npx docusaurus graphql-to-doc
```

2. Use the `--chunk-size` option to process in batches:
```shell
npx docusaurus graphql-to-doc --chunk-size 50
```

## Getting Help

If you're still having issues:

1. Check the [GitHub issues](https://github.com/graphql-markdown/graphql-markdown/issues)
2. File a new issue with:
   - Your configuration
   - Schema size/complexity
   - Error messages
   - Node.js and package versions
