import * as fs from "fs";
import * as path from "path";

import * as Eta from "eta";
import * as GraphQL from "graphql";
import * as prettier from "prettier";

import { loadSchema } from "@graphql-tools/load";
import { UrlLoader } from "@graphql-tools/url-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

import { visitor } from "./visitor";

const OperationTypes = ["Query", "Mutation", "Subscription"];

export const readSchema = async (schemaLocation: string): Promise<string> => {
  const schema = await loadSchema(schemaLocation, {
    loaders: [new GraphQLFileLoader(), new UrlLoader(), new JsonFileLoader()],
    commentDescriptions: true,
  });
  return GraphQL.printSchema(schema);
};

export const parseSchema = (schema: string): any => {
  const ast = GraphQL.parse(schema, { noLocation: true });
  return GraphQL.visit(ast, { leave: visitor });
};

export const renderNode = async (node: any, layoutsFolder: string): Promise<string> => {
  if (typeof node === "undefined") return;
  const result = (await Eta.renderFile(`${layoutsFolder}/node`, node)) as string;
  return prettier.format(result, { parser: "markdown" });
};

export const saveToFile = (
  content: string,
  location: { folder: string; file: string },
  outputFolder: string
): void => {
  const filepath = path.resolve(outputFolder, location.folder, location.file);
  fs.writeFileSync(filepath, content);
};

export const generateMarkdownFromSchema = async (
  schemaLocation: string,
  layoutsFolder?: string,
  outputFolder?: string
): Promise<void> => {
  if (typeof layoutsFolder === "undefined") {
    layoutsFolder = `${__dirname}/__layouts__`;
  }

  if (typeof outputFolder === "undefined") {
    outputFolder = `${__dirname}/output`;
  }

  const schema = await readSchema(schemaLocation);

  const nodes = parseSchema(schema);

  nodes.forEach((node: any) => {
    if (OperationTypes.includes(node.name)) {
      node.fields.forEach((element: any) =>
        renderNode({ ...element, kind: node.name }, layoutsFolder)
      );
    }
    else {
      renderNode(node, layoutsFolder)
    }
  });
};
