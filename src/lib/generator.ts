import * as Eta from "eta";
import {
  parse,
  printSchema,
  visit,
} from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";

import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { UrlLoader } from "@graphql-tools/url-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";

import { visitor } from "./visitor";

const OperationTypes = ["Query", "Mutation", "Subscription"];

export const readSchema = async (schemaLocation: string): Promise<string> => {
  const schema = await loadSchema(schemaLocation, {
      loaders: [new GraphQLFileLoader(), new UrlLoader(), new JsonFileLoader()], commentDescriptions: true
    })
  return printSchema(schema);
};

export const parseSchema = (schema) => {
  const ast = parse(schema, { noLocation: true });
  return visit(ast, visitor);
};

export const renderASTSchema = (node: any): Maybe<string> => {
  if (typeof node === "undefined") return;
  if ( OperationTypes.includes(node.name)) {
    let data: string[] = [];
    node.fields.forEach((element) => {
      data.push(renderASTSchema({...element, kind: node.name}) || "")
    });
    return data.join("\r\n");
  }
  return Eta.render(`<% layout("${__dirname}/__layouts__/node") %>`, node) as string;
}
