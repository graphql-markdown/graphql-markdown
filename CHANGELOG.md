<a id="1.26.4"></a>
# [1.26.4](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.26.4) - 2024-12-22

🐛 This release adds fixes for [`printTypeOptions`](https://graphql-markdown.dev/docs/settings#printtypeoptions) parameters `hierarchy` and `example`.

## What's Changed
* ♻️ remove circular dependencies in [#1820](https://github.com/graphql-markdown/graphql-markdown/issues/1820)
* :bug:  fix error when hierarchy is defined in CLI but validation failed against default value in [#1884](https://github.com/graphql-markdown/graphql-markdown/issues/1884)
* 🐛 fix example option with schema containing recursive types in [#1887](https://github.com/graphql-markdown/graphql-markdown/issues/1887), reported by [@TurkeyMcGuyver](https://github.com/TurkeyMcGuyver) in [#1883](https://github.com/graphql-markdown/graphql-markdown/issues/1883) 

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.26.3...1.26.4

[Changes][1.26.4]


<a id="1.26.3"></a>
# [1.26.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.26.3) - 2024-11-14

🐛 This releases fixes graphql-markdown logs not being reported to Docusaurus 3.

## What's Changed

* :bug:  fix dynamic import for logger packages by [@edno](https://github.com/edno) in [#1802](https://github.com/graphql-markdown/graphql-markdown/pull/1802)
* 📦 fix(deps): update graphql-tools monorepo by [@renovate](https://github.com/renovate) in [#1801](https://github.com/graphql-markdown/graphql-markdown/pull/1801)
* 📦 fix(deps): update dependency @graphql-inspector/core to v6.2.0 by [@renovate](https://github.com/renovate) in [#1799](https://github.com/graphql-markdown/graphql-markdown/pull/1799)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.26.2...1.26.3

[Changes][1.26.3]


<a id="1.26.2"></a>
# [1.26.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.26.2) - 2024-09-06

🐛  This release fixes `[ERROR] Error: Cannot find module '@graphql-markdown/printer-legacy'.`, a missing package reported by [@mderriey](https://github.com/mderriey) in [#1691](https://github.com/graphql-markdown/graphql-markdown/issues/1691).

## What's Changed
* :bug:  fix missing dependency printer-legacy by [@edno](https://github.com/edno) in [#1692](https://github.com/graphql-markdown/graphql-markdown/pull/1692)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.26.0...1.26.2

[Changes][1.26.2]


<a id="1.26.0"></a>
# [1.26.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.26.0) - 2024-08-14

**💥  MISSING DEPENDENCY ([#1691](https://github.com/graphql-markdown/graphql-markdown/issues/1691)) FIXED IN RELEASE `1.26.2` 💥** 

---

:sparkle: You can now generate the documentation using a flat files structure (single folder),  provided by the option `printTypeOptions.hierarchy`. The option also deprecates the option `printTypeOptions.useApiGroup` (more information in the [documentation](https://graphql-markdown.dev/docs/settings#printtypeoptions)).

<img width="1049" alt="Screenshot 2024-08-03 at 12 17 47" src="https://github.com/user-attachments/assets/b2d41d8b-efca-4e2d-8ac7-d685c26d7b4c">

:magic_wand: With the option `printTypeOptions.hierarchy`, you can also now rename the top categories when using `api` hierarchy (more information in the [documentation](https://graphql-markdown.dev/docs/settings#printtypeoptions)).

⚠️ **BREAKING CHANGE** -  When using `api` hierarchy, the top categories are now `Operations` and `Types` instead of `Api` and `Types`. The option `printTypeOptions.hierarchy` allows backward compatibility (more information in the [documentation](https://graphql-markdown.dev/docs/settings#printtypeoptions)).

🐣  This release also introduces the `force` parameter that ensures the target folder is empty before generating the documentation (more information in the [documentation](https://graphql-markdown.dev/docs/settings#force)).

## What's Changed
* 📝 add warning upgrade 1.3.0 in docs by [@edno](https://github.com/edno) in [#1602](https://github.com/graphql-markdown/graphql-markdown/pull/1602)
* ✨ add parameter to force empty output folder by [@edno](https://github.com/edno) in [#1608](https://github.com/graphql-markdown/graphql-markdown/pull/1608)
* ✨ add support for custom useApiGroup groups name by [@edno](https://github.com/edno) in [#1609](https://github.com/graphql-markdown/graphql-markdown/pull/1609)
* :recycle:  replace deprecated fs.rmdir by fs.rm by [@edno](https://github.com/edno) in [#1610](https://github.com/graphql-markdown/graphql-markdown/pull/1610)
* ✨ support flat files structure by [@edno](https://github.com/edno) in [#1622](https://github.com/graphql-markdown/graphql-markdown/pull/1622)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.25.0...1.26.0

[Changes][1.26.0]


<a id="1.25.0"></a>
# [1.25.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.25.0) - 2024-07-26

:warning: **BREAKING CHANGE** - This release removes `sidebars` files generation. The sidebars now rely on the Docusaurus [default sidebar](https://docusaurus.io/docs/sidebar#default-sidebar) behavior.

## What's Changed
* ✨ remove sidebar file generation by [@edno](https://github.com/edno) in [#1596](https://github.com/graphql-markdown/graphql-markdown/pull/1596)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.4...1.25.0

[Changes][1.25.0]


<a id="1.24.4"></a>
# [1.24.4](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.24.4) - 2024-07-20

:bug: Generated links now follow Docusaurus [recommended practices](https://docusaurus.io/docs/versioning#link-docs-by-file-paths) to link docs by file path. This fix adds the `.mdx` extension to generated links in Markdown files. 

:rabbit: _A CodeSandox demo using Docusaurus versioning is available here: https://codesandbox.io/p/devbox/determined-spence-mrpnmp_ 

## What's Changed
* ✨ support relative paths by [@edno](https://github.com/edno) in [#1583](https://github.com/graphql-markdown/graphql-markdown/pull/1583)
* :technologist:  fix snyk reports by [@edno](https://github.com/edno) in [#1585](https://github.com/graphql-markdown/graphql-markdown/pull/1585)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.3...1.24.4

[Changes][1.24.4]


<a id="1.24.3"></a>
# [1.24.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.24.3) - 2024-07-18

:bug: This release removes the use of block quotes for type description, fixing issues like [#1535](https://github.com/graphql-markdown/graphql-markdown/issues/1535)

## What's Changed
* :bug:  remove blockquotes by [@edno](https://github.com/edno) in [#1572](https://github.com/graphql-markdown/graphql-markdown/pull/1572)



**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.2...1.24.3

[Changes][1.24.3]


<a id="1.24.2"></a>
# [1.24.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.24.2) - 2024-06-23

🔧 Technical maintenance release for dependencies upgrades.

⚠️ This version removes compatibility with the `graphql` package version below **16** (see issue https://github.com/graphql-markdown/graphql-markdown/issues/1458).

## What's Changed
* :package:  restrict graphql version to 16 and fix peer deps declarations in [#1525](https://github.com/graphql-markdown/graphql-markdown/pull/1525)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.1...1.24.2

[Changes][1.24.2]


<a id="1.24.1"></a>
# [1.24.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.24.1) - 2024-04-19

## What's Changed
* 🐛 fix mdx special chars escaped in code section ([#1382](https://github.com/graphql-markdown/graphql-markdown/pull/1382))
* 🐛 add missing support for non printable type in examples ([#1419](https://github.com/graphql-markdown/graphql-markdown/pull/1419)) reported by [@Dodoboulistick](https://github.com/Dodoboulistick) in [#1417](https://github.com/graphql-markdown/graphql-markdown/issues/1417)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.0...1.24.1

[Changes][1.24.1]


<a id="1.24.0"></a>
# [1.24.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.24.0) - 2024-02-19

:robot:  A new feature [`printTypeOptions.exampleSection`](https://graphql-markdown.github.io/docs/settings#printtypeoptions) adds supports for examples using schema directives.
The feature allows inheritance of examples, so once a scalar is set with an example all types using this scalar will share the example. And, of course, you can override those examples. You can also use a custom directive and custom parser. 
More details in the [documentation](https://graphql-markdown.github.io/docs/advanced/examples).

| Object | Operation |
|---|---|
|![Screenshot from 2024-02-19 18-38-20](https://github.com/graphql-markdown/graphql-markdown/assets/324670/3039b891-33da-4817-863d-305071f20c12)|![Screenshot from 2024-02-19 18-38-37](https://github.com/graphql-markdown/graphql-markdown/assets/324670/c21e17cc-822f-4fcb-b226-2829c86d70c9)|

The screenshots come from the [_Group by_ demo](https://graphql-markdown.github.io/examples/group-by) with the feature enabled.

## What's Changed

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.23.0...1.24.0

[Changes][1.24.0]


<a id="1.23.0"></a>
# [1.23.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.23.0) - 2024-02-10

:sparkle: Executable types (operations and related directives) and system types (entity types) have now separate sections. 
The behaviour can be disabled by setting the option `printTypeOptions.useApiGroup`  to `false` or using the cli flag `--noApiGroup` (see [documentation](https://graphql-markdown.github.io/docs/settings#printtypeoptions)).

![Screenshot from 2024-02-10 16-37-28](https://github.com/graphql-markdown/graphql-markdown/assets/324670/d339e140-4738-4df6-8631-d1e1d4fe9954)

The online examples have been updated with [one using the new sections](https://graphql-markdown.github.io/examples/default) and [one with the option disabled](https://graphql-markdown.github.io/examples/group-by). Note that the examples have some [custom CSS](https://github.com/graphql-markdown/graphql-markdown/blob/1.23.0/website/src/css/custom.css#L109-L113) that is not part of the default package.

## What's changed

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.22.0...1.23.0

[Changes][1.23.0]


<a id="1.22.0"></a>
# [1.22.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.22.0) - 2023-12-27

🧑‍🔧 A new setting `docOptions.frontMatter` makes it easier to generate pages with Docusaurus settings. Using this setting you can pass any [front matter setting](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter) to the generator.

Example for the Docusaurus `draft` setting:
```js
plugins: [
    [
      "@graphql-markdown/docusaurus",
       {
        schema: "./schema/swapi.graphql",
        docOptions: {
          frontMatter: {
            draft: true, // set draft for generated pages
          },
        },
      },
    ],
  ],
```

**[DEPRECATED]** This option deprecates the options `docOptions.pagination` and `docOptions.toc` (more details in the [documentation](https://graphql-markdown.github.io/docs/settings#docoptions)).

## What's Changed


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.21.3...1.22.0

[Changes][1.22.0]


<a id="1.21.3"></a>
# [1.21.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.21.3) - 2023-11-24

🐛  Fix the incorrect build for [1.21.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.21.2) that was missing the changes for [#1101](https://github.com/graphql-markdown/graphql-markdown/issues/1101).

## What's Changed
### @graphql-markdown/docusaurus@1.21.3
- 📦 bump dependency @graphql-markdown/core to 1.7.3
- 📦 bump dependency @graphql-markdown/printer-legacy to 1.5.3

### @graphql-markdown/core@1.7.3
- 📦 bump peer dependency @graphql-markdown/printer-legacy to 1.5.3

### @graphql-markdown/printer-legacy@1.5.3
- ✨ rebuild package

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.21.2...1.21.3

[Changes][1.21.3]


<a id="1.21.2"></a>
# [1.21.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.21.2) - 2023-11-22

:magic_wand:   Improve compatibility with Docusaurus 3 by using the new [admonition format](https://docusaurus.io/docs/markdown-features/admonitions) for the `deprecated` admonition (see [#1096](https://github.com/graphql-markdown/graphql-markdown/issues/1096)).

| Docusaurus 2 | Docusaurus 3 |
|---|---|
|<code>:::caution DEPRECATED</code>|<code>:::warning[DEPRECATED]</code>|

## What's Changed

### @graphql-markdown/docusaurus@1.21.2
* :package: bump dependency @graphql-markdown/core to 1.7.2 [#1103](https://github.com/graphql-markdown/graphql-markdown/issues/1103) 
* :package: bump dependency @graphql-markdown/printer-legacy to 1.5.2 [#1103](https://github.com/graphql-markdown/graphql-markdown/issues/1103) 

### @graphql-markdown/core@1.7.2
* :package: bump peer dependency @graphql-markdown/printer-legacy to 1.5.2 [#1103](https://github.com/graphql-markdown/graphql-markdown/issues/1103) 

### @graphql-markdown/printer-legacy@1.5.2
* :sparkles:  (feat) replace caution admonition by warning for docusaurus v3 by [@edno](https://github.com/edno) in [#1101](https://github.com/graphql-markdown/graphql-markdown/pull/1101)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.21.1...1.21.2

[Changes][1.21.2]


<a id="1.21.1"></a>
# [1.21.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.21.1) - 2023-11-05

:rocket:  Fix **compatibility with Docusaurus 3**, since it comes with MDX v3 that is stricter than the version used by Docusaurus 2. :rocket: 

_The compatibility with Docusaurus 2 is maintained, and there is no plan to drop it._

## What's Changed

### @graphql-markdown/docusaurus@1.21.1
* :package: bump dependency @graphql-markdown/core to 1.7.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)
* :package: bump dependency @graphql-markdown/printer-legacy to 1.5.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)

### @graphql-markdown/core@1.7.1
* :package: bump dependency @graphql-markdown/graphql to 1.0.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)
* :package: bump dependency @graphql-markdown/utils to 1.6.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)
* :package: bump peer dependency @graphql-markdown/diff to 1.1.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)
* :package: bump peer dependency @graphql-markdown/helpers to 1.0.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)
* :package: bump peer dependency @graphql-markdown/printer-legacy to 1.5.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)
* :package: bump peer dependency graphql-config to 5.0.3 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)

### @graphql-markdown/helpers@1.0.1
* :package: bump dependency @graphql-markdown/graphql to 1.0.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)

### @graphql-markdown/graphql@1.0.1
* :package: bump dependency @graphql-markdown/utils to 1.6.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)

### @graphql-markdown/printer-legacy@1.5.1
* :bug: fix docusaurus v3 support by [@edno](https://github.com/edno) in [#1073](https://github.com/graphql-markdown/graphql-markdown/pull/1073)
* :package: bump dependency @graphql-markdown/graphql to 1.0.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)
* :package: bump dependency @graphql-markdown/utils to 1.6.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)

### @graphql-markdown/diff@1.1.1
* :package: bump dependency @graphql-markdown/graphql to 1.0.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)
* :package: bump dependency @graphql-markdown/utils to 1.6.1 [#1075](https://github.com/graphql-markdown/graphql-markdown/issues/1075)

### @graphql-markdown/utils@1.6.1
*  📝 udpate typedoc to fix compatibility with docusaurus v3 [#1072](https://github.com/graphql-markdown/graphql-markdown/issues/1072) 

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.21.0...1.21.1

[Changes][1.21.1]


<a id="1.21.0"></a>
# [1.21.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.21.0) - 2023-09-30

### 🚀  **BIG release** 🚀 

This is an exceptionally big release packed with a lot of changes, so read carefully the release notes before upgrading.

The main changes are under the hood as we migrated the codebase from Javascript to Typescript to simplify the coding experience but also to increase the code safety.

## ⚠️ Breaking changes
- Custom directive helpers have been moved to dedicated packages, see [docs](https://graphql-markdown.github.io/docs/advanced/custom-directive#helpers).

## ✨ New features
 - `onlyDocDirective` filters the schema entities to be rendered in the documentation. This is the counterpart of `skipDocDirective`, based on a request from [@brampurnot](https://github.com/brampurnot) in [#994](https://github.com/graphql-markdown/graphql-markdown/issues/994). See [documentation](https://graphql-markdown.github.io/docs/settings#onlydocdirective).
 - `metatags` adds HTML metadata to pages using [Docusaurus head metadata](https://docusaurus.io/docs/markdown-features/head-metadata), based on a request from [@akillkumar](https://github.com/akillkumar) in [#1015](https://github.com/graphql-markdown/graphql-markdown/issues/1015). See [documentation](https://graphql-markdown.github.io/docs/settings#metatags).
 - Helper `directiveDescriptor` now supports the `description` placeholder, where `description` is the default directive's description.

## 🛠️ Other changes
- Typing is available in a dedicated package `@graphql-markdown/types`.
- Modules helpers, graphql and logger have been extracted from `@graphql-markdown/utils` into dedicated packages.
- Logger has now a single method called log().
- TS API is getting documented, see [API](https://graphql-markdown.github.io/api/) in the docs.
- More and better tests.
- Upgrade dependencies version.



**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.4...1.21.0

[Changes][1.21.0]


<a id="1.20.4"></a>
# [1.20.4](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.20.4) - 2023-08-07

:technologist: Technical release to freeze the last JS changes before the migration of the code to TS.

## What's Changed

### @graphql-markdown/docusaurus@1.20.4
* :package: bump dependency @graphql-markdown/core to 1.6.4

### @graphql-markdown/core@1.6.4
* :bug: fix typo in generateDocFromSchema (no impact) by [@edno](https://github.com/edno) in [#917](https://github.com/graphql-markdown/graphql-markdown/pull/917)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.3...1.20.4

[Changes][1.20.4]


<a id="1.20.3"></a>
# [1.20.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.20.3) - 2023-07-19

:bug: Fix a CSS issue for type badges in *related type* sections (see option [`printTypeOptions.relatedTypeSection`](https://graphql-markdown.github.io/docs/settings#printtypeoptions)).

* **Before fix** :disappointed: 
  ![Screenshot 2023-07-19 at 14-22-28 Deleted GraphQL-Markdown](https://github.com/graphql-markdown/graphql-markdown/assets/324670/185015cc-a811-47ba-9564-69b65049d11f)

* **After fix** :grinning: 
  ![Screenshot 2023-07-19 at 14-30-46 Deleted GraphQL-Markdown](https://github.com/graphql-markdown/graphql-markdown/assets/324670/05a2d2ac-a6f4-4a8b-8bfd-15a0e19aab4e)

## What's Changed

### @graphql-markdown/docusaurus@1.20.3
* :package: bump dependency @graphql-markdown/core to 1.6.3
 * :package: bump dependency @graphql-markdown/printer-legacy to 1.4.3

### @graphql-markdown/core@1.6.3
* :package: bump peerDependency @graphql-markdown/printer-legacy to 1.4.3

### @graphql-markdown/printer-legacy@1.4.3
* :bug: fix badge css for relation of type sections by [@edno](https://github.com/edno) in [#908](https://github.com/graphql-markdown/graphql-markdown/pull/908)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.2...1.20.3

[Changes][1.20.3]


<a id="1.20.2"></a>
# [1.20.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.20.2) - 2023-07-07

:sparkles: New option `printTypeOptions.codeSection` and CLI flag `--noCode` for hiding the codeblock section, based on an initial request from [@ris314](https://github.com/ris314) in [#895](https://github.com/graphql-markdown/graphql-markdown/issues/895). See [documentation](https://graphql-markdown.github.io/docs/settings#printtypeoptions) for more information.

![Screenshot 2023-07-07 at 16-28-08 AddCourse GraphQL-Markdown](https://github.com/graphql-markdown/graphql-markdown/assets/324670/4a3ceb99-266d-4bd4-846b-65ba448f8077)


## What's Changed

### @graphql-markdown/docusaurus@1.20.2
* :sparkles:  add print option to hide code blocks by [@edno](https://github.com/edno) in [#897](https://github.com/graphql-markdown/graphql-markdown/pull/897)
* :package: bump dependency @graphql-markdown/core to 1.6.2
 * :package: bump dependency @graphql-markdown/printer-legacy to 1.4.2


### @graphql-markdown/core@1.6.2
* :sparkles:  add print option to hide code blocks by [@edno](https://github.com/edno) in [#897](https://github.com/graphql-markdown/graphql-markdown/pull/897)
* :package: bump peerDependency @graphql-markdown/printer-legacy to 1.4.2

### @graphql-markdown/printer-legacy@1.4.2
* :sparkles:  add print option to hide code blocks by [@edno](https://github.com/edno) in [#897](https://github.com/graphql-markdown/graphql-markdown/pull/897)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.1...1.20.2

[Changes][1.20.2]


<a id="1.20.1"></a>
# [1.20.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.20.1) - 2023-07-06

## What's Changed

:package: Update compatibility with `prettier v3` when using [`pretty`](https://graphql-markdown.github.io/docs/settings#pretty) setting. :magic_wand: 

### @graphql-markdown/docusaurus@1.20.1
* :package: bump dependency @graphql-markdown/core to 1.6.1
* :package: bump dependency @graphql-markdown/printer-legacy to 1.4.1

### @graphql-markdown/core@1.6.1
* :package: chore(deps): update dependency prettier to v3 by [@renovate](https://github.com/renovate) in [#892](https://github.com/graphql-markdown/graphql-markdown/pull/892)
* :package: bump dependency @graphql-markdown/utils to 1.5.1
* :package: bump peerDependency @graphql-markdown/diff to 1.0.14
* :package: bump peerDependency @graphql-markdown/printer-legacy to 1.4.1

### @graphql-markdown/utils@1.5.1
* :package: chore(deps): update dependency prettier to v3 by [@renovate](https://github.com/renovate) in [#892](https://github.com/graphql-markdown/graphql-markdown/pull/892)

### @graphql-markdown/printer-legacy@1.4.1
* :package: bump dependency @graphql-markdown/utils to 1.5.1

### @graphql-markdown/diff@1.0.14
* :package: bump dependency @graphql-markdown/utils to 1.5.1


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.0...1.20.1

[Changes][1.20.1]


<a id="1.20.0"></a>
# [1.20.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.20.0) - 2023-07-01

:sparkles: [GraphQL Config](https://the-guild.dev/graphql/config) is now supported, see the [documentation](https://graphql-markdown.github.io/docs/configuration#graphql-config) for more information and limitations :rocket: 


> *This is the default set up when creating a new site using the [template](https://github.com/graphql-markdown/template).*


First install the package `graphql-config`, then you are ready to go.

```bash
npm install graphql-config
```

Example `.graphqlrc`:

```yaml
schema: "https://graphql.anilist.co/"
extensions:
  graphql-markdown:
    linkRoot: "/examples/default"
    baseURL: "."
    homepage: "data/anilist.md"
    loaders:
      UrlLoader:
        module: "@graphql-tools/url-loader"
        options: 
          method: "POST"
    printTypeOptions:
      deprecated: "group"
    docOptions:
      pagination: false
      toc: false
```

## What's Changed

### @graphql-markdown/docusaurus@1.20.0
* :technologist:  force loading  @docusaurus/logger on module init by [@edno](https://github.com/edno) in [#886](https://github.com/graphql-markdown/graphql-markdown/pull/886)
* :sparkles:  add graphql-config projects support by [@edno](https://github.com/edno) in [#888](https://github.com/graphql-markdown/graphql-markdown/pull/888)
* :package:  bump dependency @graphql-markdown/core to 1.6.0

### @graphql-markdown/core@1.6.0
* :sparkles:  add support for graphql-config ([#828](https://github.com/graphql-markdown/graphql-markdown/issues/828)) by [@edno](https://github.com/edno) in [#885](https://github.com/graphql-markdown/graphql-markdown/pull/885)
* :sparkles:  add graphql-config projects support by [@edno](https://github.com/edno) in [#888](https://github.com/graphql-markdown/graphql-markdown/pull/888)
* :sparkles:  support schema options in graphql-config by [@edno](https://github.com/edno) in [#889](https://github.com/graphql-markdown/graphql-markdown/pull/889)
*  :package:  bump peerDependency @graphql-markdown/diff to 1.0.13

### @graphql-markdown/diff@1.0.13

* :package: fix(deps): update dependency @graphql-inspector/core to v4.2.2 by [@renovate](https://github.com/renovate) in [#880](https://github.com/graphql-markdown/graphql-markdown/pull/880)
* :package: fix(deps): update dependency @graphql-inspector/core to v5 by [@renovate](https://github.com/renovate) in [#881](https://github.com/graphql-markdown/graphql-markdown/pull/881)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.19.0...1.20.0

[Changes][1.20.0]


<a id="1.19.0"></a>
# [1.19.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.19.0) - 2023-06-03

> :warning: *This release introduces minor breaking changes, see section breaking changes.*

---

:label: Building upon `customDirective` released in 1.18.0, we added a new option `tag` that allows one to display custom badges (tags) in the documentation pages. 

The feature is an extension of the `customDirective` by using the already available directive processing. It works the same way as `descriptor`, and it also comes with an helper `directiveTag`... more details in the [documentation](https://graphql-markdown.github.io/docs/advanced/custom-directive).

```js
  customDirective: {
    beta: {
      tag: (directive) => ({
        text: directive?.name.toUpperCase(),
        classname: "badge--danger",
      }),
    },
```


![Screenshot from 2023-06-03 11-27-49](https://github.com/graphql-markdown/graphql-markdown/assets/324670/985f3868-ac9f-4fdf-8069-43a68c344718)

![Screenshot from 2023-06-03 11-28-21](https://github.com/graphql-markdown/graphql-markdown/assets/324670/c245d30c-e1d8-403f-bcaa-fa1323e6f565)

## Breaking changes

* Since tags have now a dedicated handler, the directives declared in `customDirective` for **`descriptor` won't display a badge**. A helper `helper.directiveTag` is provided for backward compatibility. 
  Users who want to keep the previous behavior just need to declare `tag: helper.directiveTag` for each directive declared.

  ```js
  const { helper } = require("@graphql-markdown/utils");

  //---//
    auth: {
        descriptor: (directive, type) =>
          helper.directiveDescriptor(
            directive,
            type,
            "This requires the current user to be in `${requires}` role.",
          ),
        tag: helper.directiveTag,
      },
  ```

* The **deprecated "warning badge" has been changed into an admonition** for a clearer UI.

  ![Screenshot from 2023-06-03 08-22-06](https://github.com/graphql-markdown/graphql-markdown/assets/324670/13f62166-8765-4816-8e79-000615035e6f)

* Last change is the **change of position of the custom directive descriptions** that are now *after* the type description instead of before.

  ![Screenshot from 2023-06-03 11-25-14](https://github.com/graphql-markdown/graphql-markdown/assets/324670/d30059b5-3a57-4f99-9d44-185591afedf1)

## What's Changed

### @graphql-markdown/docusaurus@1.19.0
* :package: bump dependency @graphql-markdown/core from 1.4.2 to 1.5.0
* :package: bump dependency @graphql-markdown/printer-legacy from 1.3.1 to 1.3.2
* :sparkles:  add custom logger support by [@edno](https://github.com/edno) in [#869](https://github.com/graphql-markdown/graphql-markdown/pull/869)

### @graphql-markdown/core@1.5.0
* :package: bump dependency @graphql-markdown/utils from 1.4.1 to 1.5.0
* :package: bump peerDependency @graphql-markdown/printer-legacy from 1.3.2 to 1.4.0
* :package: bump peerDependency @graphql-markdown/diff from 1.0.11 to 1.0.12
* :sparkles: custom tags for types by [@edno](https://github.com/edno) in [#863](https://github.com/graphql-markdown/graphql-markdown/pull/863)
* :sparkles:  add custom logger support by [@edno](https://github.com/edno) in [#869](https://github.com/graphql-markdown/graphql-markdown/pull/869)

### @graphql-markdown/printer-legacy@1.4.0
* :package: bump dependency @graphql-markdown/utils from 1.4.1 to 1.5.0
* :sparkles: custom tags for types by [@edno](https://github.com/edno) in [#863](https://github.com/graphql-markdown/graphql-markdown/pull/863)

### @graphql-markdown/diff@1.0.12
* :package: bump dependency @graphql-markdown/utils from 1.4.0 to 1.4.1

### @graphql-markdown/utils@1.5.0
* :sparkles: custom tags for types by [@edno](https://github.com/edno) in [#863](https://github.com/graphql-markdown/graphql-markdown/pull/863)
* :sparkles:  add custom logger support by [@edno](https://github.com/edno) in [#869](https://github.com/graphql-markdown/graphql-markdown/pull/869)

[Changes][1.19.0]


<a id="1.18.2"></a>
# [1.18.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.18.2) - 2023-06-01


:sparkle:  Add wildcard `*` support for **`customDirective`**, more details in the [documentation](https://graphql-markdown.github.io/docs/advanced/custom-directive).

## What's Changed

### @graphql-markdown/docusaurus@1.18.2
* :package: bump dependency @graphql-markdown/core from 1.4.1 to 1.4.2
* :package: bump dependency @graphql-markdown/printer-legacy from 1.3.1 to 1.3.2

### @graphql-markdown/core@1.4.2
* :package: bump dependency @graphql-markdown/utils from 1.4.0 to 1.4.1
* :package: bump peerDependency @graphql-markdown/printer-legacy from 1.3.1 to 1.3.2
* :package: bump peerDependency @graphql-markdown/diff from 1.0.10 to 1.0.11

### @graphql-markdown/printer-legacy@1.3.2
* :package: bump dependency @graphql-markdown/utils from 1.4.0 to 1.4.1

### @graphql-markdown/diff@1.0.11
* :package: fix(deps): update graphql-tools monorepo to v8 (major) by [@renovate](https://github.com/renovate) in [#854](https://github.com/graphql-markdown/graphql-markdown/pull/854)
* :package: bump dependency @graphql-markdown/utils from 1.4.0 to 1.4.1

### @graphql-markdown/utils@1.4.1
* :package: fix(deps): update graphql-tools monorepo to v8 (major) by [@renovate](https://github.com/renovate) in [#854](https://github.com/graphql-markdown/graphql-markdown/pull/854)
* :sparkles:  add wildcard support to custom directive feature by [@edno](https://github.com/edno) in [#860](https://github.com/graphql-markdown/graphql-markdown/pull/860)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.18.1...1.18.2

[Changes][1.18.2]


<a id="1.18.1"></a>
# [1.18.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.18.1) - 2023-05-07

:bug: Fix missing code indentation for fields in some cases ([#850](https://github.com/graphql-markdown/graphql-markdown/issues/850)) by [@ljiang-ti](https://github.com/ljiang-ti) in [#851](https://github.com/graphql-markdown/graphql-markdown/issues/851).
## What's Changed

### @graphql-markdown/docusaurus@1.18.1
* :package: bump dependency @graphql-markdown/core from 1.4.0 to 1.4.1
* :package: bump dependency @graphql-markdown/printer-legacy from 1.3.0 to 1.3.1

### @graphql-markdown/core@1.4.1
* :package: bump peerDependency @graphql-markdown/printer-legacy from 1.3.0 to 1.3.1

### @graphql-markdown/printer-legacy@1.3.1
* :bug: Fix indentation level in code section by [@ljiang-ti](https://github.com/ljiang-ti) in [#851](https://github.com/graphql-markdown/graphql-markdown/pull/851)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.18.0...1.18.1

[Changes][1.18.1]


<a id="1.18.0"></a>
# [1.18.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.18.0) - 2023-05-05

:star_struck: A new really cool feature by [@ljiang-ti](https://github.com/ljiang-ti), [**`customDirective`**](https://graphql-markdown.github.io/docs/settings#customdirective) provides documentation of schema directives at type level. One can now choose to print a custom description for schema directives applying to a type or field. :sparkles: 

:point_right: ~_There is a [open discussion](https://github.com/graphql-markdown/graphql-markdown/issues/843) for this feature, and the possible improvements._~

```js {6-19}
plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      customDirective: {
        auth: {
          descriptor: (directive, type) =>
            directiveDescriptor(
              directive,
              type,
              "This requires the current user to be in `${requires}` role.",
            ),
        },
        // ... other custom directive options
      },
    },
  ],
],
```

![Screenshot from 2023-05-05 10-21-14](https://user-images.githubusercontent.com/324670/236418483-81387261-72d2-4a7d-b8e0-1b0c8c1376d9.png)

If you want to see it live, the [`group-by` example documentation](https://graphql-markdown.github.io/examples/group-by) has been updated to showcase the feature.

You can find more examples and information regarding helpers to get you started in the [documentation](https://graphql-markdown.github.io/docs/advanced/custom-directive).

## What's Changed

### @graphql-markdown/docusaurus@1.18.0
* :sparkles: Support custom directives by [@ljiang-ti](https://github.com/ljiang-ti) in [#844](https://github.com/graphql-markdown/graphql-markdown/pull/844)
* :package: bump dependency @graphql-markdown/core from 1.3.0 to 1.4.0
* :package: bump dependency @graphql-markdown/printer-legacy from 1.2.3 to 1.3.0

### @graphql-markdown/core@1.4.0
* :technologist:  tidy up core package by [@edno](https://github.com/edno) in [#837](https://github.com/graphql-markdown/graphql-markdown/pull/837)
* :sparkles: Support custom directives by [@ljiang-ti](https://github.com/ljiang-ti) in [#844](https://github.com/graphql-markdown/graphql-markdown/pull/844)
* :package: bump dependency @graphql-markdown/utils from 1.3.0 to 1.4.0
* :package: bump peerDependency @graphql-markdown/printer-legacy from 1.2.3 to 1.3.0
* :package: bump peerDependency @graphql-markdown/diff from 1.0.9 to 1.0.10

### @graphql-markdown/printer-legacy@1.3.0
* :sparkles: Support custom directives by [@ljiang-ti](https://github.com/ljiang-ti) in [#844](https://github.com/graphql-markdown/graphql-markdown/pull/844)
* :package: bump dependency @graphql-markdown/utils from 1.3.0 to 1.4.0

### @graphql-markdown/utils@1.4.0
* :sparkles: Support custom directives by [@ljiang-ti](https://github.com/ljiang-ti) in [#844](https://github.com/graphql-markdown/graphql-markdown/pull/844)

### @graphql-markdown/diff@1.0.10
* 📦 npm(deps): Bump @graphql-inspector/core from 4.0.3 to 4.2.1 by [@dependabot](https://github.com/dependabot) in [#842](https://github.com/graphql-markdown/graphql-markdown/pull/842)
* :package: bump dependency @graphql-markdown/utils from 1.3.0 to 1.4.0


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.17.3...1.18.0

[Changes][1.18.0]


<a id="1.17.3"></a>
# [1.17.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.17.3) - 2023-04-20

Fix the issue when an operation and a type have the same name with the feature `groupByDirective`, reported in [#831](https://github.com/graphql-markdown/graphql-markdown/issues/831) :bug: 

## What's Changed

### @graphql-markdown/docusaurus@1.17.3
* :package: bump dependency @graphql-markdown/core from 1.2.2 to 1.3.0
* :package: bump dependency @graphql-markdown/printer-legacy from 1.2.2 to 1.2.3

### @graphql-markdown/core@1.3.0
* :bug: Support documentation categories by different root types by [@ljiang-ti](https://github.com/ljiang-ti) in [#833](https://github.com/graphql-markdown/graphql-markdown/pull/833)
* :recycle: move group functions to package utils by [@edno](https://github.com/edno) in [#835](https://github.com/graphql-markdown/graphql-markdown/pull/835)
* :package: bump dependency @graphql-markdown/utils from 1.2.1 to 1.3.0
* :package: bump peerDependency @graphql-markdown/printer-legacy from 1.2.2 to 1.2.3
* :package: bump peerDependency @graphql-markdown/diff from 1.0.8 to 1.0.9

### @graphql-markdown/printer-legacy@1.2.3
* :bug: Support documentation categories by different root types by [@ljiang-ti](https://github.com/ljiang-ti) in [#833](https://github.com/graphql-markdown/graphql-markdown/pull/833)
* :package: bump dependency @graphql-markdown/utils from 1.2.1 to 1.3.0

### @graphql-markdown/utils@1.3.0
* :recycle: move group functions to package utils by [@edno](https://github.com/edno) in [#835](https://github.com/graphql-markdown/graphql-markdown/pull/835)

### @graphql-markdown/diff@1.0.9
* :package: bump dependency @graphql-markdown/utils from 1.2.1 to 1.3.0

## New Contributors
* [@ljiang-ti](https://github.com/ljiang-ti) made their first contribution in [#833](https://github.com/graphql-markdown/graphql-markdown/pull/833)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.17.2...1.17.3

[Changes][1.17.3]


<a id="1.17.2"></a>
# [1.17.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.17.2) - 2023-04-17

Fix issue on schema loader options ([#815](https://github.com/graphql-markdown/graphql-markdown/issues/815)) by [@chmanie](https://github.com/chmanie) 🐛

## What's Changed

### @graphql-markdown/core@1.17.2

* 📦 Bump dependency @graphql-markdown/core from 1.2.1 to 1.2.2
* 📦 Bump peerDependency @graphql-markdown/printer-legacy from 1.2.1 to 1.2.2

### @graphql-markdown/core@1.2.2

* 📦 Bump dependency @graphql-markdown/utils from 1.2.0 to 1.2.1
* 📦 Bump peerDependency @graphql-markdown/printer-legacy from 1.2.1 to 1.2.2
* 📦 Bump peerDependency @graphql-markdown/diff from 1.0.7 to 1.0.8

### @graphql-markdown/printer-legacy@1.2.2

* 📦 Bump @graphql-markdown/utils from 1.2.0 to 1.2.1

### @graphql-markdown/diff@1.0.8

* 📦 npm(deps): Bump @graphql-inspector/core from 4.0.2 to 4.0.3 by [@dependabot](https://github.com/dependabot) in [#826](https://github.com/graphql-markdown/graphql-markdown/pull/826)
* 📦 npm(deps): Bump @graphql-tools/load from 7.8.13 to 7.8.14 by [@dependabot](https://github.com/dependabot) in [#827](https://github.com/graphql-markdown/graphql-markdown/pull/827)
* 📦 Bump dependency @graphql-markdown/utils from 1.2.0 to 1.2.1

### @graphql-markdown/utils@1.2.1

* 📦 npm(deps): Bump @graphql-tools/load from 7.8.13 to 7.8.14 by [@dependabot](https://github.com/dependabot) in [#827](https://github.com/graphql-markdown/graphql-markdown/pull/827)
* :bug: Merge loaderOptions into loader object passed to graphql-tools by [@chmanie](https://github.com/chmanie) in [#814](https://github.com/graphql-markdown/graphql-markdown/pull/814)

## New Contributors
* [@chmanie](https://github.com/chmanie) made their first contribution in [#814](https://github.com/graphql-markdown/graphql-markdown/pull/814)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.17.1...1.17.2

[Changes][1.17.2]


<a id="1.17.1"></a>
# [1.17.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.17.1) - 2023-04-16

🐞  Fix some inconsistencies when handling `@deprecated` directive:
- `@deprecated` is now printed in code snippets for a better visibility
- `printDeprecated: "skip"` skips all deprecated types, including types in code snippets and metadata (fields, enum values)

## What's Changed

### @graphql-markdown/docusaurus@1.17.1
* 📦 bump dependency @graphql-markdown/core from 1.2.0 to 1.2.1
* 📦 bump dependency @graphql-markdown/printer-legacy from 1.2.0 to 1.2.1

### @graphql-markdown/core@1.2.1
* 📦 bump peerDependency @graphql-markdown/printer-legacy from 1.2.0 to 1.2.1

### @graphql-markdown/printer-legacy@1.2.1
* ✨ improve handling of deprecated directive by [@edno](https://github.com/edno) in [#824](https://github.com/graphql-markdown/graphql-markdown/pull/824)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.17.0...1.17.1

[Changes][1.17.1]


<a id="1.17.0"></a>
# [1.17.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.17.0) - 2023-04-02

## What's Changed

Lot of changes in this release 🚀 
 * :bug: fix multiline description formatting reported by [@patrys](https://github.com/patrys) in [#808](https://github.com/graphql-markdown/graphql-markdown/issues/808)
 * ✨ options `skipDocDirective` and `--skip` now support multiple values
 * 🔮  new options `printTypeOptions.deprecated` and `--deprecated` give more control over `deprecated` types, based on an initial request from [@patrys](https://github.com/patrys) in [#735](https://github.com/graphql-markdown/graphql-markdown/issues/735)
 
> The new option `printTypeOptions.deprecated` comes with several options (see [documentation](https://graphql-markdown.github.io/docs/settings#printtypeoptions)), and the most exciting of those allows `@deprecated` entities to be grouped together - and, it is customisable (see [documentation](https://graphql-markdown.github.io/docs/advanced/custom-deprecated-section)).

<img width="400" alt="custom-deprecated-section-5b7fd7a5deebdcddb64e68c8958f355a" src="https://user-images.githubusercontent.com/324670/229355935-263ce6cb-a7f7-4d13-a295-5661fcb23f83.png">


### @graphql-markdown/docusaurus@1.17.0
* ✨ option skipDocDirective supports multiple values by [@edno](https://github.com/edno) in [#810](https://github.com/graphql-markdown/graphql-markdown/pull/810)
* ✨ printTypeOptions by [@edno](https://github.com/edno) in [#806](https://github.com/graphql-markdown/graphql-markdown/pull/806)
* 📦 bump dependency @graphql-markdown/core from 1.1.7 to 1.2.0
* 📦 bump dependency @graphql-markdown/printer-legacy from 1.1.7 to 1.2.0

### @graphql-markdown/core@1.2.0
* ✨ option skipDocDirective supports multiple values by [@edno](https://github.com/edno) in [#810](https://github.com/graphql-markdown/graphql-markdown/pull/810)
* ✨ printTypeOptions group deprecated by [@edno](https://github.com/edno) in [#806](https://github.com/graphql-markdown/graphql-markdown/pull/806)
* :sparkles:  add printTypeOptions deprecated 'skip' by [@edno](https://github.com/edno) in [#811](https://github.com/graphql-markdown/graphql-markdown/pull/811)
* 📦 bump dependency @graphql-markdown/utils from 1.1.4 to 1.2.0
* 📦 bump peerDependency @graphql-markdown/printer-legacy from 1.1.7 to 1.2.0
* 📦 bump peerDependency @graphql-markdown/diff from 1.0.6 to 1.0.7

### @graphql-markdown/printer-legacy@1.2.0
* :bug:  fix multiline description formatting by [@edno](https://github.com/edno) in [#809](https://github.com/graphql-markdown/graphql-markdown/pull/809)
* ✨ option skipDocDirective supports multiple values by [@edno](https://github.com/edno) in [#810](https://github.com/graphql-markdown/graphql-markdown/pull/810)
* ✨ printTypeOptions group deprecated by [@edno](https://github.com/edno) in [#806](https://github.com/graphql-markdown/graphql-markdown/pull/806)
* 📦 bump dependency @graphql-markdown/utils from 1.1.4 to 1.2.0

### @graphql-markdown/utils@1.2.0
* :sparkles: add `isDeprecated` in graphql utils
* :sparkles: `hasDirective` now supports array in graphql utils

### @graphql-markdown/diff@1.0.7
* 📦 bump dependency @graphql-markdown/utils from 1.1.4 to 1.2.0


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.7...1.17.0

[Changes][1.17.0]


<a id="1.16.7"></a>
# [1.16.7](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16.7) - 2023-03-28

## What's Changed

:bug:  Fix undefined on undeclared root type instead of empty object reported by [@LunaticMuch](https://github.com/LunaticMuch) in [#802](https://github.com/graphql-markdown/graphql-markdown/issues/802)

❕ _This release has some significant code refactoring. If you experience regressions with this release, [please report them](https://github.com/graphql-markdown/graphql-markdown/issues/new?assignees=edno&labels=bug&template=bug_report.md&title=)._

### @graphql-markdown/docusaurus@1.16.7
* 📦 bump dependency @graphql-markdown/printer-legacy from 1.1.6 to 1.1.7
* 📦 bump dependency @graphql-markdown/core from 1.1.6 to 1.1.7

### @graphql-markdown/core@1.1.7
* 📦 bump peerDependencies @graphql-markdown/printer-legacy from 1.1.6 to 1.1.7
* 📦 bump peerDependencies @graphql-markdown/diff from 1.0.5 to 1.0.6
* 📦 bump dependency @graphql-markdown/utils from 1.1.3 to 1.1.4

### @graphql-markdown/printer-legacy@1.1.7
* ♻️ refactor printer-legacy by [@edno](https://github.com/edno) in [#763](https://github.com/graphql-markdown/graphql-markdown/pull/763)
* 📦 bump dependency @graphql-markdown/utils from 1.1.3 to 1.1.4

### @graphql-markdown/utils@1.1.4
* 📦 npm(deps): Bump @graphql-tools/load from 7.8.11 to 7.8.12 by [@dependabot](https://github.com/dependabot) in [#781](https://github.com/graphql-markdown/graphql-markdown/pull/781)
* 📦 npm(deps): Bump @graphql-tools/load from 7.8.12 to 7.8.13 by [@dependabot](https://github.com/dependabot) in [#794](https://github.com/graphql-markdown/graphql-markdown/pull/794)
* :bug:  fix undefined on undeclared root type instead of empty object by [@edno](https://github.com/edno) in [#803](https://github.com/graphql-markdown/graphql-markdown/pull/803)

### @graphql-markdown/diff@1.0.6
* 📦 npm(deps): Bump @graphql-tools/load from 7.8.11 to 7.8.12 by [@dependabot](https://github.com/dependabot) in [#781](https://github.com/graphql-markdown/graphql-markdown/pull/781)
* 📦 fix(deps): update dependency @graphql-inspector/core to v4 by [@renovate](https://github.com/renovate) in [#783](https://github.com/graphql-markdown/graphql-markdown/pull/783)
* 📦 npm(deps): Bump @graphql-tools/load from 7.8.12 to 7.8.13 by [@dependabot](https://github.com/dependabot) in [#794](https://github.com/graphql-markdown/graphql-markdown/pull/794)
* 📦 bump dependency @graphql-markdown/utils from 1.1.3 to 1.1.4


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.6...1.16.7

[Changes][1.16.7]


<a id="1.16.6"></a>
# [1.16.6](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16.6) - 2023-02-12

## What's Changed

:bug: Fix the support of `skipDocDirective` on fields, reported by [@jroith](https://github.com/jroith) in [#777](https://github.com/graphql-markdown/graphql-markdown/issues/777).

### @graphql-markdown/printer-legacy@1.1.6

* :bug: fix `skipDocDirective` on fields by [@edno](https://github.com/edno) in [#779](https://github.com/graphql-markdown/graphql-markdown/pull/779)

### @graphql-markdown/core@1.1.6

* 📦 update peerDependency @graphql-markdown/printer-legacy to 1.1.6 by [@edno](https://github.com/edno) in [#780](https://github.com/graphql-markdown/graphql-markdown/pull/780)

### @graphql-markdown/docusaurus@1.16.6

* 📦 update dependency @graphql-markdown/printer-legacy to 1.1.6 by [@edno](https://github.com/edno) in [#780](https://github.com/graphql-markdown/graphql-markdown/pull/780)
* 📦 update dependency @graphql-markdown/core to 1.1.6 by [@edno](https://github.com/edno) in [#780](https://github.com/graphql-markdown/graphql-markdown/pull/780)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.5...1.16.6

[Changes][1.16.6]


<a id="1.16.5"></a>
# [1.16.5](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16.5) - 2023-02-04

## What's Changed

🐛 fix undefined css class on returned types and related types badges.

### @graphql-markdown/printer-legacy@1.1.5

* :bug:  fix undefined css class on returned types and related types badges by [@edno](https://github.com/edno) in [#772](https://github.com/graphql-markdown/graphql-markdown/pull/772)

### @graphql-markdown/core@1.1.5

* 📦 update peerDependency @graphql-markdown/printer-legacy to 1.1.5 by [@edno](https://github.com/edno) in [#773](https://github.com/graphql-markdown/graphql-markdown/issues/773)

### @graphql-markdown/docusaurus@1.16.5

* 📦 update dependency @graphql-markdown/core to 1.1.5 by [@edno](https://github.com/edno) in [#773](https://github.com/graphql-markdown/graphql-markdown/issues/773)
* 📦 update dependency @graphql-markdown/printer-legacy to 1.1.5 by [@edno](https://github.com/edno) in [#773](https://github.com/graphql-markdown/graphql-markdown/issues/773)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.4...1.16.5

[Changes][1.16.5]


<a id="1.16.4"></a>
# [1.16.4](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16.4) - 2023-02-03

🤩  [@carolstran](https://github.com/carolstran) fixed a long due [DOM warning](https://github.com/graphql-markdown/graphql-markdown/issues/764) where `class` was used instead of `className` in React MDX component.

## What's Changed

### @graphql-markdown/docusaurus@1.16.4
* 📦 update dependency @graphql-markdown/core to 1.1.4
* 📦 update dependency @graphql-markdown/printer-legacy to 1.1.4

### @graphql-markdown/core@1.1.4
* 📦 update dependency @graphql-markdown/utils to 1.1.3
* 📦 update peerDependency @graphql-markdown/diff to 1.0.5
* 📦 update peerDependency @graphql-markdown/printer-legacy to 1.1.4

### @graphql-markdown/printer-legacy@1.1.4
* 🐛 Refactor class to className in Badge component [#765](https://github.com/graphql-markdown/graphql-markdown/issues/765) by [@carolstran](https://github.com/carolstran)
* 📦 update dependency @graphql-markdown/utils to 1.1.3

### @graphql-markdown/utils@1.1.3
* 📦 update dependency @graphql-tools/load to 7.8.11

### @graphql-markdown/diff@1.0.5
* 📦 update dependency @graphql-markdown/utils to 1.1.3
* 📦 update dependency @graphql-inspector/core to 3.5.0
* 📦 update dependency @graphql-tools/graphql-file-loader to 7.5.15
* 📦 update dependency @graphql-tools/load to 7.8.11

## New Contributors
* [@carolstran](https://github.com/carolstran) made their first contribution in [#765](https://github.com/graphql-markdown/graphql-markdown/pull/765)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.3...1.16.4

[Changes][1.16.4]


<a id="1.16.3"></a>
# [1.16.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16.3) - 2023-01-13

## What's Changed

Fix issue on root scalar types null when using JSON schema loader by [@melvey](https://github.com/melvey) 🐛 

### @graphql-markdown/utils@1.1.2
* :bug:  Handle null root types by [@melvey](https://github.com/melvey) in [#751](https://github.com/graphql-markdown/graphql-markdown/issues/751)

### @graphql-markdown/core@1.1.3
* 📦  Bump dependency @graphql-markdown/utils@1.1.2 by [@edno](https://github.com/edno) in [#754](https://github.com/graphql-markdown/graphql-markdown/issues/754)
* 📦  Bump peerDependency @graphql-markdown/printer-legacy@1.1.3 by [@edno](https://github.com/edno) in [#754](https://github.com/graphql-markdown/graphql-markdown/issues/754)
* 📦  Bump peerDependency @graphql-markdown/diff@1.0.4 by [@edno](https://github.com/edno) in [#754](https://github.com/graphql-markdown/graphql-markdown/issues/754)

### @graphql-markdown/docusaurus@1.16.3
* 📦  Bump dependency @graphql-markdown/utils@1.1.2 by [@edno](https://github.com/edno) in [#754](https://github.com/graphql-markdown/graphql-markdown/issues/754)
* 📦  Bump dependency @graphql-markdown/printer-legacy@1.1.3 by [@edno](https://github.com/edno) in [#754](https://github.com/graphql-markdown/graphql-markdown/issues/754)

### @graphql-markdown/printer-legacy@1.1.3
* 📦  Bump dependency @graphql-markdown/utils@1.1.2 by [@edno](https://github.com/edno) in [#754](https://github.com/graphql-markdown/graphql-markdown/issues/754)

### @graphql-markdown/diff@1.0.4
* 📦  Bump dependency @graphql-markdown/utils@1.1.2 by [@edno](https://github.com/edno) in [#754](https://github.com/graphql-markdown/graphql-markdown/issues/754)
* 📦  Bump dependency @graphql-tools/graphql-file-loader@7.5.14 by [@edno](https://github.com/edno) in [#754](https://github.com/graphql-markdown/graphql-markdown/issues/754)
* 📦  Bump dependency @graphql-tools/load@7.8.9 by [@edno](https://github.com/edno) in [#754](https://github.com/graphql-markdown/graphql-markdown/issues/754)

## New Contributors
* [@melvey](https://github.com/melvey) made their first contribution in [#751](https://github.com/graphql-markdown/graphql-markdown/pull/751)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.2...1.16.3

[Changes][1.16.3]


<a id="1.16.2"></a>
# [1.16.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16.2) - 2023-01-07

## What's Changed
* :construction_worker:  add custom workspace dep checker by [@edno](https://github.com/edno) in [#726](https://github.com/graphql-markdown/graphql-markdown/pull/726)
* chore(deps): update dependency @graphql-tools/graphql-file-loader to v7.5.13 by [@renovate](https://github.com/renovate) in [#730](https://github.com/graphql-markdown/graphql-markdown/pull/730)
* chore(deps): update dependency prettier to v2.8.1 by [@renovate](https://github.com/renovate) in [#731](https://github.com/graphql-markdown/graphql-markdown/pull/731)
* 📦 npm(deps): Bump @graphql-tools/load from 7.8.6 to 7.8.8 by [@dependabot](https://github.com/dependabot) in [#733](https://github.com/graphql-markdown/graphql-markdown/pull/733)
* 📦 npm(deps): Bump json5 from 1.0.1 to 1.0.2 by [@dependabot](https://github.com/dependabot) in [#743](https://github.com/graphql-markdown/graphql-markdown/pull/743)
* 📦 npm(deps): Bump json5 from 1.0.1 to 1.0.2 by [@dependabot](https://github.com/dependabot) in [#747](https://github.com/graphql-markdown/graphql-markdown/pull/747)
* chore(deps): update dependency prettier to v2.8.2 by [@renovate](https://github.com/renovate) in [#748](https://github.com/graphql-markdown/graphql-markdown/pull/748)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.1...1.16.2

[Changes][1.16.2]


<a id="1.16.1"></a>
# [1.16.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16.1) - 2022-11-28

💥 **HOTFIX for release 1.16.0**

See [1.16.0 release notes](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16) for changes.

### @graphql-markdown/docusaurus@1.16.1
* bump package @graphql-markdown/core@1.1.1
* bump package @graphql-markdown/printer-legacy@1.1.1

### @graphql-markdown/core@1.1.1
* :bug:  fix destructure property bug on `@graphql-markdown/core` by [@edno](https://github.com/edno) in [#724](https://github.com/graphql-markdown/graphql-markdown/pull/724)

### @graphql-markdown/printer-legacy@1.1.1
* fix dependency semver pattern


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.16...1.16.1

[Changes][1.16.1]


<a id="1.16"></a>
# [1.16.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16) - 2022-11-28

❗ **DO NOT USE! Broken package `@graphql-markdown/core@1.1.0` fixed with release [1.16.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.16.1)** ❗

## What's Changed

✨ Directives are now printed with `on` location information, eg:

```graphql
directive @example on
  | FIELD
  | FRAGMENT_SPREAD
  | INLINE_FRAGMENT
```

🪄 Support excluding types by directive, [see doc](https://graphql-markdown.github.io/docs/settings#skipdocdirective).

### @graphql-markdown/docusaurus@1.16.0
* :sparkles:  exclude type by directive by [@edno](https://github.com/edno) in [#686](https://github.com/graphql-markdown/graphql-markdown/pull/686)

### @graphql-markdown/core@1.1.0
* :sparkles:  exclude type by directive by [@edno](https://github.com/edno) in [#686](https://github.com/graphql-markdown/graphql-markdown/pull/686)
* 📦 npm(deps): Bump @graphql-tools/load from 7.8.0 to 7.8.1 by [@dependabot](https://github.com/dependabot) in [#698](https://github.com/graphql-markdown/graphql-markdown/pull/698)
* 📦 npm(deps): Bump @graphql-tools/load from 7.8.1 to 7.8.4 by [@dependabot](https://github.com/dependabot) in [#705](https://github.com/graphql-markdown/graphql-markdown/pull/705)
* 📦 npm(deps): Bump @graphql-tools/load from 7.8.4 to 7.8.6 by [@dependabot](https://github.com/dependabot) in [#716](https://github.com/graphql-markdown/graphql-markdown/pull/716)

### @graphql-markdown/utils@1.1.0
* ✨ add directive locations by [@edno](https://github.com/edno) in [#685](https://github.com/graphql-markdown/graphql-markdown/pull/685)
* :sparkles:  exclude type by directive by [@edno](https://github.com/edno) in [#686](https://github.com/graphql-markdown/graphql-markdown/pull/686)

### @graphql-markdown/printer-legacy@1.1.0
* ✨ add directive locations by [@edno](https://github.com/edno) in [#685](https://github.com/graphql-markdown/graphql-markdown/pull/685)

### @graphql-markdown/diff@1.0.2
* bump @graphql-markdown/core to 1.1.0

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/%40graphql-markdown/docusaurus%401.15.1...1.16

[Changes][1.16]


<a id="@graphql-markdown/docusaurus@1.15.1"></a>
# [1.15 (@graphql-markdown/docusaurus@1.15.1)](https://github.com/graphql-markdown/graphql-markdown/releases/tag/@graphql-markdown/docusaurus@1.15.1) - 2022-10-23

# @graphql-markdown/docusaurus@1.15.1

`@graphql-markdown/docusaurus` is now a micro package part of the **graphql-markdown** packages ecosystem ✨ 

## ‼️ Breaking changes ‼️  

* `@graphql-tools/graphql-file-loader` is no more a dependency and must be installed separately in your Docusaurus installation.
  ```bash
  npm i @graphql-tools/graphql-file-loader
  ```
   Explicitly declare the loader in your `@graphql-markdown/docusaurus` plugin configuration, see the [doc](https://graphql-markdown.github.io/docs/advanced/schema-loading).
   ```js
  module.exports = {
    // ...
    plugins: [
      [
        "@graphql-markdown/docusaurus",
        {
          schema: "./schema/swapi.graphql",
          rootPath: "./docs", // docs will be generated under './docs/swapi' (rootPath/baseURL)
          baseURL: "swapi",
          homepage: "./docs/swapi.md",
          loaders: {
            GraphQLFileLoader: "@graphql-tools/graphql-file-loader" // local file schema
          }
        },
      ],
    ],
  };
  ```

* `diffMethod` is now set to `NONE` (disabled) by default. If you miss it, see the [doc](https://graphql-markdown.github.io/docs/settings#diffmethod).

# @graphql-markdown/core@1.0.1

Update dependency to `@graphql-markdown/utils@1.0.1`

# @graphql-markdown/utils@1.0.1

Fix issue with `@graphq-tools/graphql-file-loader` required.
See release notes for `@graphql-markdown/docusaurus@1.15.1`

# @graphql-markdown/printer-legacy@1.0.1

Update dependency to `@graphql-markdown/utils@1.0.1`

# @graphql-markdown/diff@1.0.1

Update dependency to `@graphql-markdown/utils@1.0.1`

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.14.0...@graphql-markdown/docusaurus@1.15.1

[Changes][@graphql-markdown/docusaurus@1.15.1]


<a id="1.14.0"></a>
# [1.14.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.14.0) - 2022-10-04

### ‼️ The package has been renamed to `@graphql-markdown/docusaurus`. ‼️ 

#### Migration

1.  **Remove** the old package: `npm uninstall @edno/docusaurus2-graphql-doc-generator`
2. **Install** the new package: `npm install @graphql-markdown/docusaurus`
3. **Update** `docusaurus.config.js`
    ```diff
    module.exports = {
      // ...
      plugins: [
        [
    --    "@edno/docusaurus2-graphql-doc-generator",
    ++    "@graphql-markdown/docusaurus",
          {
             // ... settings are unchanged
          },
        ],
      ],
      // ...
    };
    ```

[Changes][1.14.0]


<a id="1.13.1"></a>
# [1.13.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.13.1) - 2022-09-04

## What's Changed
* improve Docusausus TS support by [@edno](https://github.com/edno) in [#625](https://github.com/graphql-markdown/graphql-markdown/pull/625)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.13.0...1.13.1

[Changes][1.13.1]


<a id="1.13.0"></a>
# [1.13.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.13.0) - 2022-09-02

🪄 A new option for the schema loader allows custom root types in your schema (see [documentation](https://graphql-markdown.github.io/docs/advanced/custom-root-types)), based on a request from [@JaKXz](https://github.com/JaKXz).

## What's Changed
* use prepare script for husky install by [@JaKXz](https://github.com/JaKXz) in [#623](https://github.com/graphql-markdown/graphql-markdown/pull/623)
* 🐛 fix the issue when operation names are used as custom type names by [@edno](https://github.com/edno) & [@JaKXz](https://github.com/JaKXz) in [#622](https://github.com/graphql-markdown/graphql-markdown/pull/622)

## New Contributors
* [@JaKXz](https://github.com/JaKXz) made their first contribution in [#623](https://github.com/graphql-markdown/graphql-markdown/pull/623)

[Changes][1.13.0]


<a id="1.12.1"></a>
# [1.12.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.12.1) - 2022-08-27

🛠️ Align NodeJS engine min version with Docusaurus.

[Changes][1.12.1]


<a id="1.12.0"></a>
# [1.12.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.12.0) - 2022-08-27

✨ Some shiny new features making the documentation easier to navigate, based on a request from [@LunaticMuch](https://github.com/LunaticMuch).

1. **Type relations** give you information about where a type is used: operation, union, interface, type... 
2. **Parent prefix** makes it easier to read fields in type pages, especially for nested ones
3. **Type attributes badges** provide a quick overview of the field attributes such as root type, list, nullability, and groups (if you use the [grouping feature](https://graphql-markdown.github.io/docs/settings#groupbydirective))

👀  Look at [Demo 1](https://graphql-markdown.github.io/schema/schema) to see how the documentation renders with those options.

ℹ️  All those options are enabled by default, but they can be toggled off if you don't need them, see the [documentation](https://graphql-markdown.github.io/docs/settings#printtypeoptions).

💅 Those changes have also been a good opportunity for cleaning the MDX structures in the Markdown generated files.


## What's Changed
* 📦 npm(deps): Bump @graphql-tools/load from 7.7.0 to 7.7.1 by [@dependabot](https://github.com/dependabot) in [#590](https://github.com/graphql-markdown/graphql-markdown/pull/590)
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.4.0 to 7.5.0 by [@dependabot](https://github.com/dependabot) in [#589](https://github.com/graphql-markdown/graphql-markdown/pull/589)
* Update dependency graphql to v16.6.0 by [@renovate](https://github.com/renovate) in [#605](https://github.com/graphql-markdown/graphql-markdown/pull/605)
* 📦 npm(deps): Bump @graphql-tools/load from 7.7.1 to 7.7.4 by [@dependabot](https://github.com/dependabot) in [#602](https://github.com/graphql-markdown/graphql-markdown/pull/602)
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.5.0 to 7.5.2 by [@dependabot](https://github.com/dependabot) in [#601](https://github.com/graphql-markdown/graphql-markdown/pull/601)
* :sparkles:  implement type relation map ([#585](https://github.com/graphql-markdown/graphql-markdown/issues/585)) by [@edno](https://github.com/edno) in [#595](https://github.com/graphql-markdown/graphql-markdown/pull/595)
* ✨ add badges to type information by [@edno](https://github.com/edno) in [#610](https://github.com/graphql-markdown/graphql-markdown/pull/610)
* :sparkles:  add doc group to type badges by [@edno](https://github.com/edno) in [#611](https://github.com/graphql-markdown/graphql-markdown/pull/611)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.11.0...1.12.0


[Changes][1.12.0]


<a id="1.11.0"></a>
# [1.11.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.11.0) - 2022-07-17

✨ New [documentation option](https://graphql-markdown.github.io/docs/settings#docoptions) `index` for generating index page for schema categories (eg. queries, inputs, mutations...) powered by [Docusaurus generated index](https://docusaurus.io/docs/sidebar/items#generated-index-page) feature. You can see the option in action in [Demo 2](https://graphql-markdown.github.io/group-by/category/directives).

## What's Changed
* 📦 npm(deps): Bump @graphql-inspector/core from 3.1.2 to 3.2.0 by [@dependabot](https://github.com/dependabot) in [#572](https://github.com/graphql-markdown/graphql-markdown/pull/572)
* :sparkles:  add support for generated category index by [@edno](https://github.com/edno) in [#575](https://github.com/graphql-markdown/graphql-markdown/pull/575)
* 🧪 improve code coverage by [@edno](https://github.com/edno) in [#577](https://github.com/graphql-markdown/graphql-markdown/pull/577)
* 🧪 update StrykerJS config by [@edno](https://github.com/edno) in [#578](https://github.com/graphql-markdown/graphql-markdown/pull/578)
* :construction_worker:  trigger doc generation on release by [@edno](https://github.com/edno) in [#582](https://github.com/graphql-markdown/graphql-markdown/pull/582)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.10.3...1.11.0

[Changes][1.11.0]


<a id="1.10.3"></a>
# [1.10.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.10.3) - 2022-07-05

## What's Changed
* 📦 npm(deps): Bump @graphql-tools/load from 7.5.13 to 7.5.14 by [@dependabot](https://github.com/dependabot) in [#549](https://github.com/graphql-markdown/graphql-markdown/pull/549)
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.3.14 to 7.3.15 by [@dependabot](https://github.com/dependabot) in [#550](https://github.com/graphql-markdown/graphql-markdown/pull/550)
* Configure Renovate by [@renovate](https://github.com/renovate) in [#553](https://github.com/graphql-markdown/graphql-markdown/pull/553)
* Pin dependencies by [@renovate](https://github.com/renovate) in [#554](https://github.com/graphql-markdown/graphql-markdown/pull/554)
* 📦 npm(deps): Bump @graphql-tools/load from 7.5.14 to 7.6.0 by [@dependabot](https://github.com/dependabot) in [#561](https://github.com/graphql-markdown/graphql-markdown/pull/561)
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.3.15 to 7.3.16 by [@dependabot](https://github.com/dependabot) in [#562](https://github.com/graphql-markdown/graphql-markdown/pull/562)
* :test_tube:  fix smoke test Url loader config by [@edno](https://github.com/edno) in [#571](https://github.com/graphql-markdown/graphql-markdown/pull/571)
* 📦 npm(deps): Bump @graphql-tools/load from 7.6.0 to 7.7.0 by [@dependabot](https://github.com/dependabot) in [#570](https://github.com/graphql-markdown/graphql-markdown/pull/570)
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.3.16 to 7.4.0 by [@dependabot](https://github.com/dependabot) in [#568](https://github.com/graphql-markdown/graphql-markdown/pull/568)

## New Contributors
* [@renovate](https://github.com/renovate) made their first contribution in [#553](https://github.com/graphql-markdown/graphql-markdown/pull/553)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.10.2...1.10.3

[Changes][1.10.3]


<a id="1.10.2"></a>
# [1.10.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.10.2) - 2022-06-04

This release provides several fixes affecting the rendering of array/list nested types.

## What's Changed
* ♻️ code refactoring by [@edno](https://github.com/edno) in [#541](https://github.com/graphql-markdown/graphql-markdown/pull/541)
* :bug:  fix rendering default array enum by [@edno](https://github.com/edno) in [#544](https://github.com/graphql-markdown/graphql-markdown/pull/544)
* :bug:  fix incorrect link format for arg array types by [@edno](https://github.com/edno) in [#545](https://github.com/graphql-markdown/graphql-markdown/pull/545)
* 🐛  fix printer lib broken logic for nested types by [@edno](https://github.com/edno) in [#546](https://github.com/graphql-markdown/graphql-markdown/pull/546)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.10.1...1.10.2

[Changes][1.10.2]


<a id="1.10.1"></a>
# [1.10.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.10.1) - 2022-05-25

## What's Changed
* 📦 npm(deps): Bump @graphql-tools/load from 7.5.11 to 7.5.13 by [@dependabot](https://github.com/dependabot) in [#532](https://github.com/graphql-markdown/graphql-markdown/pull/532)
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.3.12 to 7.3.14 by [@dependabot](https://github.com/dependabot) in [#531](https://github.com/graphql-markdown/graphql-markdown/pull/531)
* 🐛 fix default value `0` not rendered in doc by [@edno](https://github.com/edno) in [#537](https://github.com/graphql-markdown/graphql-markdown/pull/537)
* :bug:  fix missing nullability flag in doc by [@edno](https://github.com/edno) in [#538](https://github.com/graphql-markdown/graphql-markdown/pull/538)
* :bug:  fix missing `[]` for list entity type by [@edno](https://github.com/edno) in [#539](https://github.com/graphql-markdown/graphql-markdown/pull/539)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.10.0...1.10.1

[Changes][1.10.1]


<a id="1.10.0"></a>
# [1.10.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.10.0) - 2022-05-18

✨ New options available for disabling Docusaurus navigation buttons and table of content for schema documentation pages. 
More information in the [documentation](https://graphql-markdown.github.io/docs/settings#docoptions).

## What's Changed
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.3.9 to 7.3.10 by [@dependabot](https://github.com/dependabot) in [#507](https://github.com/graphql-markdown/graphql-markdown/pull/507)
* 📦 npm(deps): Bump @graphql-tools/load from 7.5.8 to 7.5.9 by [@dependabot](https://github.com/dependabot) in [#508](https://github.com/graphql-markdown/graphql-markdown/pull/508)
* 📦 npm(deps): Bump @graphql-tools/load from 7.5.9 to 7.5.10 by [@dependabot](https://github.com/dependabot) in [#509](https://github.com/graphql-markdown/graphql-markdown/pull/509)
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.3.10 to 7.3.11 by [@dependabot](https://github.com/dependabot) in [#511](https://github.com/graphql-markdown/graphql-markdown/pull/511)
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.3.11 to 7.3.12 by [@dependabot](https://github.com/dependabot) in [#522](https://github.com/graphql-markdown/graphql-markdown/pull/522)
* 📦 npm(deps): Bump @graphql-tools/load from 7.5.10 to 7.5.11 by [@dependabot](https://github.com/dependabot) in [#525](https://github.com/graphql-markdown/graphql-markdown/pull/525)
* :sparkles: add doc options support by [@edno](https://github.com/edno) in [#528](https://github.com/graphql-markdown/graphql-markdown/pull/528)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.9.3...1.10.0

[Changes][1.10.0]


<a id="1.9.3"></a>
# [1.9.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.9.3) - 2022-04-14

## What's Changed
* 📦 npm(deps): bump @graphql-tools/load from 7.5.3 to 7.5.5 by [@dependabot](https://github.com/dependabot) in [#487](https://github.com/graphql-markdown/graphql-markdown/pull/487)
* 📦 npm(deps): bump @graphql-tools/graphql-file-loader from 7.3.5 to 7.3.7 by [@dependabot](https://github.com/dependabot) in [#484](https://github.com/graphql-markdown/graphql-markdown/pull/484)
* 📦 npm(deps): Bump @graphql-tools/load from 7.5.5 to 7.5.6 by [@dependabot](https://github.com/dependabot) in [#488](https://github.com/graphql-markdown/graphql-markdown/pull/488)
* 📦 npm(deps): Bump ansi-regex from 3.0.0 to 3.0.1 by [@dependabot](https://github.com/dependabot) in [#491](https://github.com/graphql-markdown/graphql-markdown/pull/491)
* 📦 npm(deps): Bump @graphql-inspector/core from 3.1.1 to 3.1.2 by [@dependabot](https://github.com/dependabot) in [#490](https://github.com/graphql-markdown/graphql-markdown/pull/490)
* :recycle: code refactoring by [@edno](https://github.com/edno) in [#492](https://github.com/graphql-markdown/graphql-markdown/pull/492)
* :bug:  remove blank line from code block by [@edno](https://github.com/edno) in [#498](https://github.com/graphql-markdown/graphql-markdown/pull/498)
* :package:  update dependencies by [@edno](https://github.com/edno) in [#500](https://github.com/graphql-markdown/graphql-markdown/pull/500)
* 📦 npm(deps): Bump @graphql-tools/graphql-file-loader from 7.3.8 to 7.3.9 by [@dependabot](https://github.com/dependabot) in [#505](https://github.com/graphql-markdown/graphql-markdown/pull/505)
* 📦 npm(deps): Bump @graphql-tools/load from 7.5.7 to 7.5.8 by [@dependabot](https://github.com/dependabot) in [#506](https://github.com/graphql-markdown/graphql-markdown/pull/506)


**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.9.2...1.9.3

[Changes][1.9.3]


<a id="1.9.2"></a>
# [1.9.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.9.2) - 2022-03-25

## What's Changed
* :memo: move online docs to dedicated repo by [@edno](https://github.com/edno) in [#475](https://github.com/graphql-markdown/graphql-markdown/pull/475)
* :bug:  update so the keyword input displays by [@coder2034](https://github.com/coder2034) in [#480](https://github.com/graphql-markdown/graphql-markdown/pull/480)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.9.1...1.9.2

[Changes][1.9.2]


<a id="1.9.1"></a>
# [1.9.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.9.1) - 2022-03-20

No functional changes in the package, only repo location changed to https://github.com/graphql-markdown/graphql-markdown.

## What's Changed
* :package:  add commitizen by [@elias-pap](https://github.com/elias-pap) in [#465](https://github.com/graphql-markdown/graphql-markdown/pull/465)
* :technologist: move repo to graphql-markdown org by [@edno](https://github.com/edno) in [#470](https://github.com/graphql-markdown/graphql-markdown/pull/470)
* :memo: fix Docusaurus links by [@edno](https://github.com/edno) in [#473](https://github.com/graphql-markdown/graphql-markdown/pull/473)

**Full Changelog**: https://github.com/graphql-markdown/graphql-markdown/compare/1.9.0...1.9.1


[Changes][1.9.1]


<a id="1.9.0"></a>
# [1.9.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.9.0) - 2022-03-13

This version comes with plugin multi-instance support, by [@elias-pap](https://github.com/elias-pap).
You can read more about it in the [documentation](https://github.com/edno/graphql-markdown#plugin-multi-instance).

## What's Changed
* feat: add multi-instance support by [@elias-pap](https://github.com/elias-pap) in [edno/graphql-markdown#449](https://github.com/edno/graphql-markdown/pull/449)
* Update github actions workflows by [@edno](https://github.com/edno) in [edno/graphql-markdown#455](https://github.com/edno/graphql-markdown/pull/455)
* code refactoring by [@edno](https://github.com/edno) in [edno/graphql-markdown#459](https://github.com/edno/graphql-markdown/pull/459)
* test: improve coverage by [@elias-pap](https://github.com/elias-pap) in [edno/graphql-markdown#460](https://github.com/edno/graphql-markdown/pull/460)
* docs(README.md): add multi-instance usage by [@elias-pap](https://github.com/elias-pap) in [edno/graphql-markdown#462](https://github.com/edno/graphql-markdown/pull/462)
* add pr template by [@edno](https://github.com/edno) in [edno/graphql-markdown#464](https://github.com/edno/graphql-markdown/pull/464)

## New Contributors
* [@elias-pap](https://github.com/elias-pap) made their first contribution in [edno/graphql-markdown#449](https://github.com/edno/graphql-markdown/pull/449)

**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.8.5...1.9.0

[Changes][1.9.0]


<a id="1.8.5"></a>
# [1.8.5](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.8.5) - 2022-02-24

## What's Changed
* Fix compilation error for `@specifiedBy` directives by adding a newline by [@jlndk](https://github.com/jlndk) in [edno/graphql-markdown#447](https://github.com/edno/graphql-markdown/pull/447)

## New Contributors
* [@jlndk](https://github.com/jlndk) made their first contribution in [edno/graphql-markdown#447](https://github.com/edno/graphql-markdown/pull/447)

**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.8.4...1.8.5

[Changes][1.8.5]


<a id="1.8.4"></a>
# [1.8.4](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.8.4) - 2022-02-21

You can now [try](https://github.com/edno/graphql-markdown/tree/1.8.4#try-it) GraphQL Markdown with our live sandbox.

## What's Changed
* Improve schema index page by [@edno](https://github.com/edno) in [edno/graphql-markdown#446](https://github.com/edno/graphql-markdown/pull/446)

**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.8.3...1.8.4

[Changes][1.8.4]


<a id="1.8.3"></a>
# [1.8.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.8.3) - 2022-02-17

## What's Changed
* Fix: apply `groupByDirective` option from config file by [@davidyaha](https://github.com/davidyaha) in [edno/graphql-markdown#442](https://github.com/edno/graphql-markdown/pull/442)

## New Contributors
* [@davidyaha](https://github.com/davidyaha) made their first contribution in [edno/graphql-markdown#442](https://github.com/edno/graphql-markdown/pull/442)

**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.8.2...1.8.3

[Changes][1.8.3]


<a id="1.8.2"></a>
# [1.8.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.8.2) - 2022-01-15

Fix NPM package containing extra files (no code change)

[Changes][1.8.2]


<a id="1.8.1"></a>
# [1.8.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.8.1) - 2022-01-15

## What's Changed
* fix hasPrettierModule by [@edno](https://github.com/edno) in [edno/graphql-markdown#427](https://github.com/edno/graphql-markdown/pull/427)


**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.8.0...1.8.1

[Changes][1.8.1]


<a id="1.8.0"></a>
# [1.8.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.8.0) - 2022-01-15

The package continues shrinking by size and by number of dependencies.

![Screenshot 2022-01-15 at 14 12 43](https://user-images.githubusercontent.com/324670/149623081-c28c20a2-2506-4361-924a-e876a31d27a4.png)
Source: [Bundlephobia](https://bundlephobia.com/scan-results?packages=@edno/docusaurus2-graphql-doc-generator@1.5.0,@edno/docusaurus2-graphql-doc-generator@1.6.0,@edno/docusaurus2-graphql-doc-generator@1.7.0,@edno/docusaurus2-graphql-doc-generator@1.8.0&sortMode=alphabetic)

## What's Changed
* remove picocolors dependency by [@edno](https://github.com/edno) in [edno/graphql-markdown#422](https://github.com/edno/graphql-markdown/pull/422)
* prettier as optional peer dependency by [@edno](https://github.com/edno) in [edno/graphql-markdown#423](https://github.com/edno/graphql-markdown/pull/423)

## Maintenance
* fix sonarcloud code smells by [@edno](https://github.com/edno) in [edno/graphql-markdown#402](https://github.com/edno/graphql-markdown/pull/402)
* fix smoke test failing on node warning by [@edno](https://github.com/edno) in [edno/graphql-markdown#415](https://github.com/edno/graphql-markdown/pull/415)
* fix docker command for running demo by [@edno](https://github.com/edno) in [edno/graphql-markdown#424](https://github.com/edno/graphql-markdown/pull/424)
* update package.json entries by [@edno](https://github.com/edno) in [edno/graphql-markdown#426](https://github.com/edno/graphql-markdown/pull/426)
* update package dependencies by [@edno](https://github.com/edno) in [edno/graphql-markdown#425](https://github.com/edno/graphql-markdown/pull/425)

**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.7.0...1.8.0

[Changes][1.8.0]


<a id="1.7.0"></a>
# [1.7.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.7.0) - 2021-11-21

## Breaking change ⚠️ 
* GraphQL package is now a peer dependency by [@edno](https://github.com/edno) in [edno/graphql-markdown#399](https://github.com/edno/graphql-markdown/pull/399)

> **You need to add `graphql` dependency to your project if not already installed.**


**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.6.0...1.7.0

[Changes][1.7.0]


<a id="1.6.0"></a>
# [1.6.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.6.0) - 2021-11-16

This version comes with a new feature for grouping documentation using GraphQL directives, by [@coder2034](https://github.com/coder2034). 
You can read more about it in the [documentation](https://edno.github.io/graphql-markdown/#about-groupbydirective), and you can see [a demo here](https://edno.github.io/graphql-markdown/group-by).

## What's Changed
* add feature for grouping by category by [@coder2034](https://github.com/coder2034) in [edno/graphql-markdown#358](https://github.com/edno/graphql-markdown/pull/358)
* fix pages count in summary by [@edno](https://github.com/edno) in [edno/graphql-markdown#375](https://github.com/edno/graphql-markdown/pull/375)
* add contributing guidelines by [@edno](https://github.com/edno) in [edno/graphql-markdown#379](https://github.com/edno/graphql-markdown/pull/379)

## New Contributors
* [@coder2034](https://github.com/coder2034) made their first contribution in [edno/graphql-markdown#358](https://github.com/edno/graphql-markdown/pull/358)

**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.5.4...1.6.0

[Changes][1.6.0]


<a id="1.5.4"></a>
# [1.5.4](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.5.4) - 2021-10-25

## What's Changed
* Fix missing generated.md ([#371](https://github.com/graphql-markdown/graphql-markdown/issues/371)) by [@edno](https://github.com/edno) in [edno/graphql-markdown#372](https://github.com/edno/graphql-markdown/pull/372)


**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.5.3...1.5.4

[Changes][1.5.4]


<a id="1.5.3"></a>
# [1.5.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.5.3) - 2021-10-24

🔴  **The package is missing `assets/generated.md`, this can be fixed using the `homepage` option and downloading the missing file [here](https://raw.githubusercontent.com/edno/graphql-markdown/main/assets/generated.md).** ([#371](https://github.com/graphql-markdown/graphql-markdown/issues/371))

## What's Changed
* Add options customization in loaders by [@GuiHash](https://github.com/GuiHash) in [edno/graphql-markdown#365](https://github.com/edno/graphql-markdown/pull/365)

## Maintenance
* Fix actions not triggered for external PRs by [@edno](https://github.com/edno) in [edno/graphql-markdown#359](https://github.com/edno/graphql-markdown/pull/359)
* Remove lodash and slugify dependencies by [@edno](https://github.com/edno) in [edno/graphql-markdown#361](https://github.com/edno/graphql-markdown/pull/361)
* Remove nyc, npm and yarn from dev dependencies by [@edno](https://github.com/edno) in [edno/graphql-markdown#364](https://github.com/edno/graphql-markdown/pull/364)
* Reduce Jest memory usage by [@edno](https://github.com/edno) in [edno/graphql-markdown#363](https://github.com/edno/graphql-markdown/pull/363)

## New Contributors
* [@GuiHash](https://github.com/GuiHash) made their first contribution in [edno/graphql-markdown#365](https://github.com/edno/graphql-markdown/pull/365)

**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.5.1...1.5.3

[Changes][1.5.3]


<a id="1.5.1"></a>
# [1.5.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.5.1) - 2021-10-19

## What's Changed
* Fix MDX renderer error with curly braces by [@edno](https://github.com/edno) in [edno/graphql-markdown#356](https://github.com/edno/graphql-markdown/pull/356)


**Full Changelog**: https://github.com/edno/graphql-markdown/compare/1.5.0...1.5.1

[Changes][1.5.1]


<a id="1.5.0"></a>
# [1.5.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.5.0) - 2021-10-09

### 💥 BREAKING CHANGE💥 

Starting version `1.5.0`, `docusaurus2-graphql-doc-generator` only provides `graphql-file-loader` document loader out-of-the-box.
Thus, by default, the `schema` default loading expects a local GraphQL schema definition file (`*.graphql`).

See [`loaders` option documentation](README.md#loaders) in [README](README.md) file.

For a full compatibility with previous versions, add the following packages to your Docusaurus project:

```shell
yarn add @graphql-tools/url-loader @graphql-tools/json-file-loader
```

Once installed, you can declare both loaders into `docusaurus2-graphql-doc-generator` configuration:

```js
plugins: [
  [
    '@edno/docusaurus2-graphql-doc-generator',
    {
      //... existing configuration
      loaders: {
        UrlLoader: "@graphql-tools/url-loader",
        JsonFileLoader: "@graphql-tools/json-file-loader"
      }
    },
  ],
]
```

*Note, you don't need to re-declare `graphql-file-loader` since it is provided out-of-the-box.*

> #### Why this change?
> There are several reasons behing this change:
> - Reducing dependencies footprint and management
> - More flexibility as more GraphQL document loaders become available
> - Preparation work for version 2.0

### Other changes

More dependencies removed: `moment`, `chalk` (replaced by `picocolors`), `colors` (replaced by `picocolors`).

[Changes][1.5.0]


<a id="1.4.3"></a>
# [1.4.3](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.4.3) - 2021-10-04

Technical maintenance:
 - Improve devx (CI, testing)
 - Update dependencies
 - Remove extra files from package (reduced size by about 5kB)

[Changes][1.4.3]


<a id="1.4.2"></a>
# [1.4.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.4.2) - 2021-09-09

Reduce the size of the package from 348 kB to 44.6 kB.

[Changes][1.4.2]


<a id="1.4.1"></a>
# [1.4.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.4.1) - 2021-09-06

Fix issues with Windows OS ([#201](https://github.com/graphql-markdown/graphql-markdown/issues/201), [#287](https://github.com/graphql-markdown/graphql-markdown/issues/287), [#288](https://github.com/graphql-markdown/graphql-markdown/issues/288)).

[Changes][1.4.1]


<a id="1.4.0"></a>
# [1.4.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.4.0) - 2021-08-15

[@jineshshah36](https://github.com/jineshshah36) spotted a bug ([#234](https://github.com/graphql-markdown/graphql-markdown/issues/234)) and submitted a fix that was worth another release 😃 

- Fix default value handling for `Int` when not set ([#235](https://github.com/graphql-markdown/graphql-markdown/issues/235) by [@jineshshah36](https://github.com/jineshshah36))

- Upgrade `graphql-tools` to version 7.

[Changes][1.4.0]


<a id="1.3.1"></a>
# [1.3.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.3.1) - 2021-08-04

Fix 1.3.0 packaging issue (missing files [#254](https://github.com/graphql-markdown/graphql-markdown/issues/254) reported by [@dkershner6](https://github.com/dkershner6))

[Changes][1.3.1]


<a id="1.3.0"></a>
# [1.3.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.3.0) - 2021-07-12

> **BROKEN PACKAGE FIXED IN 1.3.1**

**~This is the last release for the version 1 (a beta for the version 2 will be soon release).~**

- move from plugin generated toolbar to Docusaurus auto-generated toolbar
- fix some async issues that may cause the server to crash when starting
- dependencies updates

⚠️  If you use a custom homepage (see [options](https://github.com/edno/graphql-markdown#options)), then you will need to add the metadata `sidebar_position: 1` to ensure that it is shown at the top of the sidebar (see [README](https://github.com/edno/graphql-markdown#home-page)).

[Changes][1.3.0]


<a id="1.2.2"></a>
# [1.2.2-beta](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.2.2) - 2021-06-02

Fix [#223](https://github.com/graphql-markdown/graphql-markdown/issues/223) where `@specifiedBy` MDX was breaking Docusaurus parser.

Fix homepage slug that was not set properly (please open an issue if this impacts your current setup).

[Changes][1.2.2]


<a id="1.2.1"></a>
# [1.2.1-beta](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.2.1) - 2021-05-29

Remove unused dependency

[Changes][1.2.1]


<a id="1.2.0-beta"></a>
# [1.2.0-beta](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.2.0-beta) - 2021-05-13

Add support of the directive `specifiedBy` for type `scalar`

<img width="535" alt="Screenshot 2021-05-13 at 14 30 27" src="https://user-images.githubusercontent.com/324670/118126279-699b9f80-b3f8-11eb-9eaa-c3b591e57ba0.png">

Update display of the directive `@deprecated` using Docusaurus CSS instead of custom React component

| Before  | After  |
|---|---|
| <img width="556" alt="Screenshot 2021-05-13 at 14 43 42" src="https://user-images.githubusercontent.com/324670/118127184-ac11ac00-b3f9-11eb-8fe8-564b9867d596.png">  | <img width="576" alt="Screenshot 2021-05-13 at 14 41 45" src="https://user-images.githubusercontent.com/324670/118127188-acaa4280-b3f9-11eb-84f9-b973f97be0b9.png">  |

[Changes][1.2.0-beta]


<a id="1.1.1-beta"></a>
# [1.1.1-beta](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.1.1-beta) - 2021-05-10

Upgrade dependencies.

[Changes][1.1.1-beta]


<a id="1.1.0-beta"></a>
# [1.1.0-beta](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.1.0-beta) - 2020-11-15

Added support for `@deprecated` types and fields.

[Changes][1.1.0-beta]


<a id="1.0.0-beta"></a>
# [1.0.0-beta](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.0.0-beta) - 2020-10-24

1.0.0 (beta) is ready for use 🎉 

For a local demo, you can clone this repository and run the `demo` command:
```shell
git clone https://github.com/edno/docusaurus2-graphql-doc-generator.git
yarn
yarn demo
```
Then open the URL [`http://localhost:8080/docs/schema`](http://localhost:8080/docs/schema) in your browser 🚀 

[Changes][1.0.0-beta]


[1.26.4]: https://github.com/graphql-markdown/graphql-markdown/compare/1.26.3...1.26.4
[1.26.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.26.2...1.26.3
[1.26.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.26.0...1.26.2
[1.26.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.25.0...1.26.0
[1.25.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.4...1.25.0
[1.24.4]: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.3...1.24.4
[1.24.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.2...1.24.3
[1.24.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.1...1.24.2
[1.24.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.24.0...1.24.1
[1.24.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.23.0...1.24.0
[1.23.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.22.0...1.23.0
[1.22.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.21.3...1.22.0
[1.21.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.21.2...1.21.3
[1.21.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.21.1...1.21.2
[1.21.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.21.0...1.21.1
[1.21.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.4...1.21.0
[1.20.4]: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.3...1.20.4
[1.20.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.2...1.20.3
[1.20.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.1...1.20.2
[1.20.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.20.0...1.20.1
[1.20.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.19.0...1.20.0
[1.19.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.18.2...1.19.0
[1.18.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.18.1...1.18.2
[1.18.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.18.0...1.18.1
[1.18.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.17.3...1.18.0
[1.17.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.17.2...1.17.3
[1.17.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.17.1...1.17.2
[1.17.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.17.0...1.17.1
[1.17.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.7...1.17.0
[1.16.7]: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.6...1.16.7
[1.16.6]: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.5...1.16.6
[1.16.5]: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.4...1.16.5
[1.16.4]: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.3...1.16.4
[1.16.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.2...1.16.3
[1.16.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.16.1...1.16.2
[1.16.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.16...1.16.1
[1.16]: https://github.com/graphql-markdown/graphql-markdown/compare/@graphql-markdown/docusaurus@1.15.1...1.16
[@graphql-markdown/docusaurus@1.15.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.14.0...@graphql-markdown/docusaurus@1.15.1
[1.14.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.13.1...1.14.0
[1.13.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.13.0...1.13.1
[1.13.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.12.1...1.13.0
[1.12.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.12.0...1.12.1
[1.12.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.11.0...1.12.0
[1.11.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.10.3...1.11.0
[1.10.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.10.2...1.10.3
[1.10.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.10.1...1.10.2
[1.10.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.10.0...1.10.1
[1.10.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.9.3...1.10.0
[1.9.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.9.2...1.9.3
[1.9.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.9.1...1.9.2
[1.9.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.9.0...1.9.1
[1.9.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.8.5...1.9.0
[1.8.5]: https://github.com/graphql-markdown/graphql-markdown/compare/1.8.4...1.8.5
[1.8.4]: https://github.com/graphql-markdown/graphql-markdown/compare/1.8.3...1.8.4
[1.8.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.8.2...1.8.3
[1.8.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.8.1...1.8.2
[1.8.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.8.0...1.8.1
[1.8.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.7.0...1.8.0
[1.7.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.6.0...1.7.0
[1.6.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.5.4...1.6.0
[1.5.4]: https://github.com/graphql-markdown/graphql-markdown/compare/1.5.3...1.5.4
[1.5.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.5.1...1.5.3
[1.5.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.5.0...1.5.1
[1.5.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.4.3...1.5.0
[1.4.3]: https://github.com/graphql-markdown/graphql-markdown/compare/1.4.2...1.4.3
[1.4.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.4.1...1.4.2
[1.4.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.4.0...1.4.1
[1.4.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.3.1...1.4.0
[1.3.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/graphql-markdown/graphql-markdown/compare/1.2.2...1.3.0
[1.2.2]: https://github.com/graphql-markdown/graphql-markdown/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/graphql-markdown/graphql-markdown/compare/1.2.0-beta...1.2.1
[1.2.0-beta]: https://github.com/graphql-markdown/graphql-markdown/compare/1.1.1-beta...1.2.0-beta
[1.1.1-beta]: https://github.com/graphql-markdown/graphql-markdown/compare/1.1.0-beta...1.1.1-beta
[1.1.0-beta]: https://github.com/graphql-markdown/graphql-markdown/compare/1.0.0-beta...1.1.0-beta
[1.0.0-beta]: https://github.com/graphql-markdown/graphql-markdown/tree/1.0.0-beta

<!-- Generated by https://github.com/rhysd/changelog-from-release v3.8.1 -->
