# const/homepage

## Variables

### DEFAULT\_HOMEPAGE\_FILENAME

```ts
const DEFAULT_HOMEPAGE_FILENAME: "generated.md" = "generated.md";
```

Defined in: [packages/core/src/const/homepage.ts:6](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/const/homepage.ts#L6)

**`Internal`**

Output file name of the generated homepage when using the built-in template.

---

### DEFAULT\_HOMEPAGE\_TEMPLATE

```ts
const DEFAULT_HOMEPAGE_TEMPLATE: "---\nid: schema\nslug: ##baseURL##\ntitle: Schema Documentation\nsidebar_position: 1\nhide_table_of_contents: true\npagination_next: null\npagination_prev: null\nsidebar_class_name: navbar__toggle\n---\n\nThis documentation has been automatically generated from the GraphQL schema with [GraphQL-Markdown](https://graphql-markdown.dev/).\n";
```

Defined in: [packages/core/src/const/homepage.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/const/homepage.ts#L22)

**`Internal`**

The built-in homepage template, inlined.

The same content ships as `assets/generated.md` so anyone can point
`homepage` at it, copy it, or diff against it. Inlining it here means the
default path never touches the filesystem: rendering the homepage was the
last filesystem _read_ on the render path, and a write-only output adapter
has no way to satisfy one.

`assets/generated.md` remains the canonical artifact. A unit test asserts the
two are identical, so they cannot drift.
