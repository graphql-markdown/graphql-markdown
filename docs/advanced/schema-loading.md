---
pagination_prev: null
pagination_next: null
---

# Schema loading

GraphQL-Markdown use external loaders for loading GraphQL schemas (see [full list](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders)).

You can declare as many loaders as you need using a `LoaderOption` map:

```ts
// highlight-start
type LoaderOption = {
  [name: ClassName]: PackageName | PackageConfig;
};
// highlight-end

type PackageName = string & { _opaque: typeof PackageName };

type ClassName = string & { _opaque: typeof ClassName };

type PackageConfig = {
  module: PackageName;
  options?: PackageOptionsConfig;
};

type RootTypes = { query?: string; mutation?: string; subscription?: string };

type PackageOptionsConfig = BaseLoaderOptions & RootTypes;
```

## Local schema (file)

Use `@graphql-tools/graphql-file-loader` if you want to load a local schema:

```shell title="shell"
npm install @graphql-tools/graphql-file-loader
```

Once done, you can declare the loader in `@graphql-markdown/docusaurus` configuration:

```js title="docusaurus.config.js"
plugins: [
  [
    "@graphql-markdown/docusaurus",
    /** @type {import('@graphql-markdown/types').ConfigOptions} */
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

Once done, you can declare the loader in `@graphql-markdown/docusaurus` configuration:

```js title="docusaurus.config.js"
plugins: [
  [
    "@graphql-markdown/docusaurus",
    /** @type {import('@graphql-markdown/types').ConfigOptions} */
    {
      // ... other options
      loaders: {
        UrlLoader: {
          module: "@graphql-tools/url-loader",
          options: {
            headers: {
              Authorization: "<API_KEY>" // replace with your key if the gateway needs an auth key
             }
          }
        }
      }
    },
  ],
],
```

:::tip

See our [Troubleshooting section](/docs/troubleshooting) in case of error ['UrlLoader' does not exist in type 'LoaderOption'.ts](/docs/troubleshooting#urlloader-does-not-exist-in-type-loaderoptionts).

:::
