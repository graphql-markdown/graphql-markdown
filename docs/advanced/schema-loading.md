---
pagination_prev: null
pagination_next: null
---

# Schema loading

By default, the `schema` default loading expects a local GraphQL schema definition file (`*.graphql`).

Additional GraphQL document loaders can be used (see [full list](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders)).

For example, if you want to load a schema from a URL, you first need to add the package `@graphql-tools/url-loader` to your Docusaurus project:

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

You can declare as many loaders as you need using the structure:

```ts
type className = string; // UrlLoader

type moduleName = string; // "@graphql-tools/url-loader"
type rootTypes = { query?: string, mutation?: string, subscription?: string };
type moduleOptions = { [option: string]: any, rootType?: rootTypes };

type module = { 
  module: moduleName, 
  options: moduleOptions | undefined 
}

type loaders = {
  [className: className]: moduleName | module
}
```
