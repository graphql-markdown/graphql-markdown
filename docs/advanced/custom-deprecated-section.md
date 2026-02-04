---
pagination_prev: null
pagination_next: null
description: Customize how deprecated fields and types are displayed in your GraphQL documentation using CSS styling.
keywords:
  - deprecated fields
  - GraphQL deprecation
  - custom styling
  - CSS customization
  - deprecated types
---

# Customize deprecated sections

When using the option [`printTypeOptions.deprecated`](/docs/settings#printtypeoptions) set to `group`, the rendering can be customized using the CSS class `.deprecated`.

Adding a `warning` emoji ⚠️ is done with a quick tweak of [Docusaurus CSS](https://docusaurus.io/docs/styling-layout).

```css title="/src/css/custom.css"
.deprecated a::after,
span.deprecated::after {
  content: "⚠️";
  padding-left: 4px !important;
  transform: none !important;
}

.deprecated {
  padding-top: 1rem;
}
```

The above CSS will render the deprecated sections as the following

![custom-deprecated-section](/img/docs/custom-deprecated-section.png)
