export const directiveSpecifiedBy = {
  arguments: [
    {
      kind: "Argument",
      name: "url",
      value: "https://www.w3.org/TR/SRI",
    },
  ],
  kind: "Directive",
  name: "@specifiedBy",
  simplifiedKind: "directive",
};

export const directiveDeprecated = {
  arguments: [
    {
      kind: "Argument",
      name: "reason",
      value: "This is deprecated",
    },
  ],
  kind: "Directive",
  name: "@deprecated",
  simplifiedKind: "directive",
};

export default {
  arguments: [],
  kind: "DirectiveDefinition",
  name: "@auth",
  repeatable: true,
  simplifiedKind: "directive",
};
