import { createPackageTypedocConfig } from "@graphql-markdown/tooling-config/typedoc/package-base";

export default createPackageTypedocConfig({
  exclude: ["./src/index.ts"],
});