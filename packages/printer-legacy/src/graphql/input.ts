import { printObjectMetadata, printCodeType } from "./object";
import { Options } from "../const/options";

export const printInputMetadata = printObjectMetadata;

export const printCodeInput = (type: unknown, options: Options) => printCodeType(type, "input", options);
