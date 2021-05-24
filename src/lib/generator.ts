import * as path from "path";
import { promises as fs } from "fs";

import { getConfigurationOption, loadSchemaFromConfiguration } from "./config";
import { parseSchema } from "./parser";
import { renderNode } from "./renderer";

const OperationTypes = ["query", "mutation", "subscription"] as const;

export const saveToFile = async (
  content: string,
  location: { readonly folder: string; readonly file: string }
): Promise<void> => {
  const filepath = path.resolve(
    process.cwd(),
    getConfigurationOption("output"),
    location.folder,
    location.file
  );

  await fs.writeFile(filepath, content);
};

export const generateMarkdownFromSchema = async (): Promise<void> => {
  const schema = loadSchemaFromConfiguration();
  const nodes = parseSchema(schema);

  await nodes.forEach(async (node: any) => {
    if (OperationTypes.includes(node.name)) {
      await node.fields.forEach(async (element: any) => {
        {
          await renderNode({
            ...element,
            kind: "OperationTypeDefinition",
            operation: node.name,
          });
        }
      });
    } else {
      await renderNode(node);
    }
  });
};
