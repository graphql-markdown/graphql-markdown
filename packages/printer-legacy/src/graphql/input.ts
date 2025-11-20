import type { PrintTypeOptions } from "@graphql-markdown/types";

import { printCodeType } from "./object";

export { printObjectMetadata as printInputMetadata } from "./object";

export const printCodeInput = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  return printCodeType(type, "input", options);
};
