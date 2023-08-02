import type { PrintTypeOptions } from "@graphql-markdown/types";

import { printObjectMetadata, printCodeType } from "./object";

export const printInputMetadata = printObjectMetadata;

export const printCodeInput = (
  type: unknown,
  options: PrintTypeOptions,
): string => printCodeType(type, "input", options);
