import { promises as fs } from "fs";
import * as path from "path";

import * as Eta from "eta";
import * as GraphQL from "graphql";
import * as prettier from "prettier";

import { visitor } from "./visitor";
import { loadGraphqlConfig } from "./graphql-config";

const OperationTypes = ["Query", "Mutation", "Subscription"];

export const loadSchema = async (): Promise<GraphQL.DocumentNode> => {
  const config = await loadGraphqlConfig();
  return await config!.getDefault().getSchema("DocumentNode");
};

export const parseSchema = (schema: GraphQL.DocumentNode): any => {
  return GraphQL.visit(schema, { leave: visitor });
};

export const renderNode = async (
  node: any,
  layoutsFolder: string
): Promise<string> => {
  const result = (await Eta.renderFile(
    `${layoutsFolder}/index`,
    node
  )) as string;

  return prettier.format(result, { parser: "markdown" });
};

export const saveToFile = async (
  content: string,
  location: { folder: string; file: string },
  outputFolder: string
): Promise<void> => {
  const filepath = path.resolve(outputFolder, location.folder, location.file);

  await fs.writeFile(filepath, content);
};

export const generateMarkdownFromSchema = async (
  layoutsFolder?: string,
  outputFolder?: string
): Promise<void> => {
  if (typeof layoutsFolder === "undefined") {
    layoutsFolder = `${__dirname}/__layouts__`;
  }

  if (typeof outputFolder === "undefined") {
    outputFolder = `${__dirname}/output`;
  }

  const schema = await loadSchema();

  const nodes = parseSchema(schema);

  nodes.forEach(async (node: any) => {
    if (OperationTypes.includes(node.name)) {
      node.fields.forEach(async (element: any) =>
        await renderNode({ ...element, kind: node.name }, layoutsFolder)
      );
    } else {
      await renderNode(node, layoutsFolder);
    }
  });
};
