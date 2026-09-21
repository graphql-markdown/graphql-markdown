// @ts-check

/** @type {import("stylelint").Config} */
export default {
  extends: "stylelint-config-standard",
  rules: {
    // Docusaurus CSS Modules use camelCase class names and Infima's
    // `--ifm-*`/`--aa-*` custom-property naming; neither is kebab-case.
    "custom-property-pattern": null,
    "selector-class-pattern": null,
    // `:global(...)` is CSS Modules syntax, not a real pseudo-class.
    "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global"] }],
    // Modern `rgb(x x x / y%)` notation vs. `rgba(x, x, x, y)` is a syntax
    // preference with no functional difference; not worth rewriting the
    // theme's existing colors for.
    "color-function-notation": null,
    "color-function-alias-notation": null,
    "alpha-value-notation": null,
    "media-feature-range-notation": null,
    // The `-webkit-mask-*` properties here are load-bearing for Safari,
    // which still requires the prefix -- not a stray autoprefixer leftover.
    "property-no-vendor-prefix": null,
  },
};
