export default {
  kind: "ScalarTypeDefinition",
  name: "SRI",
  description:
    "An `integrity` value beginning with at least one string, with each string including a prefix indicating a particular hash algorithm (e.g. `sha256`, `sha384`, `sha512`), followed by a dash `-`, and ending with the actual base64-encoded hash.",
  directives: [],
};
