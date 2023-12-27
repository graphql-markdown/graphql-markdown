---
pagination_prev: null
pagination_next: null
---

# Schema loading

GraphQL-Markdown use external loaders for loading GraphQL schemas (see [full list](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders)).

You can declare as many loaders as you need using the structure:

```ts
type RootTypes = { query?: string; mutation?: string; subscription?: string };

type PackageOptionsConfig = BaseLoaderOptions & RootTypes;

type PackageConfig = {
  module: PackageName;
  options?: PackageOptionsConfig;
};

type PackageName = string & { _opaque: typeof PackageName };

type ClassName = string & { _opaque: typeof ClassName };

type LoaderOption = {
  [name: ClassName]: PackageName | PackageConfig;
};
```

## Local schema (file)

Use `@graphql-tools/graphql-file-loader` if you want to load a local schema:

```shell title="shell"
npm install @graphql-tools/graphql-file-loader
```

Once done, you can declare the loader into `@graphql-markdown/docusaurus` configuration:

```js title="docusaurus.config.js"
plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      loaders: {
        GraphQLFileLoader: "@graphql-tools/graphql-file-loader"
      }
    },
  ],
],
```

## Remote schema (url)

Use `@graphql-tools/url-loader`, if you want to load a schema from a URL:

```shell title="shell"
npm install @graphql-tools/url-loader
```

Once done, you can declare the loader into `docusaurus2-graphql-doc-generator` configuration:

```js title="docusaurus.config.js"
plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      loaders: {
        UrlLoader: {
          module: "@graphql-tools/url-loader",
          options: {
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
             }
          }
        }
      }
    },
  ],
],
```
