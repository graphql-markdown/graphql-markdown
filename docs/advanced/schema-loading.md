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

```shell
npm install @graphql-tools/graphql-file-loader
```

Once done, you can declare the loader into `@graphql-markdown/docusaurus` configuration:

```js
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

```shell
npm install @graphql-tools/url-loader
```

Once done, you can declare the loader into `docusaurus2-graphql-doc-generator` configuration:

```js
plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      loaders: {
        UrlLoader: "@graphql-tools/url-loader"
      }
    },
  ],
],
```
