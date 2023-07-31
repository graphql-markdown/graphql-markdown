import { GraphQLInterfaceType } from "graphql";
import { printObjectMetadata, printCodeType } from "./object";
import { Options } from "../const/options";

export const printInterfaceMetadata = printObjectMetadata;

export const printCodeInterface = (type: GraphQLInterfaceType, options: Options) => printCodeType(type, "interface", options);
