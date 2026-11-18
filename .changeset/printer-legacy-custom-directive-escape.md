---
"@graphql-markdown/printer-legacy": patch
---

Security fix (GHSA-6m8m-x9vx-3f84): the built-in "Directives" section now escapes `customDirective` descriptor output with `escapeMDX`, as the description slot already did. Before, a descriptor that put schema values in its text, such as the documented `directiveDescriptor` helper, let a schema author inject HTML, JSX or MDX expressions into the generated page. Descriptor output that relied on being printed as raw MDX is now shown as text.
