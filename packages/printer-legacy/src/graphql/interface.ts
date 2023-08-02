import { printObjectMetadata, printCodeType } from "./object";
import { PrintTypeOptions } from "../const/options";

export const printInterfaceMetadata = printObjectMetadata;

export const printCodeInterface = (type: unknown, options: PrintTypeOptions) =>
  printCodeType(type, "interface", options);
