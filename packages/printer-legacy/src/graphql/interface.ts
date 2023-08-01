import { printObjectMetadata, printCodeType } from "./object";
import { Options } from "../const/options";

export const printInterfaceMetadata = printObjectMetadata;

export const printCodeInterface = (type: unknown, options: Options) =>
  printCodeType(type, "interface", options);
