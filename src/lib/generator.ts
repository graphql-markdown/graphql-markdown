import { promises as fs } from "fs";
import * as path from "path";

import { parseSchema } from "./parser";
import { renderNode } from "./renderer";
import { getConfigOption, loadSchemaFromConfig } from "./config";

const OperationTypes = ["Query", "Mutation", "Subscription"];

export const saveToFile = async (
  content: string,
  location: { folder: string; file: string }
): Promise<void> => {
  const filepath = path.resolve(
    getConfigOption("outputFolder"),
    location.folder,
    location.file
  );

  await fs.writeFile(filepath, content);
};

export const generateMarkdownFromSchema = async (): Promise<void> => {
  const schema = await loadSchemaFromConfig();

  const nodes = parseSchema(schema);

  nodes.forEach(async (node: any) => {
    if (OperationTypes.includes(node.name)) {
      node.fields.forEach(
        async (element: any) =>
          await renderNode({ ...element, kind: node.name })
      );
    } else {
      await renderNode(node);
    }
  });
};
