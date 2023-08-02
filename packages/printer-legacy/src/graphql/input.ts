import { printObjectMetadata, printCodeType } from "./object";
import { PrintTypeOptions } from "../const/options";

export const printInputMetadata = printObjectMetadata;

export const printCodeInput = (type: unknown, options: PrintTypeOptions) =>
  printCodeType(type, "input", options);
