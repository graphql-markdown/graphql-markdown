import * as path from "path";
import { promises as fs } from "fs";

import {
  __basedir,
  getConfigurationOption,
  loadSchemaFromConfiguration,
  parseSchema,
  renderNode,
} from "../";

export const saveToFile = async (
  content: string,
  location: { readonly folder: string; readonly file: string }
): Promise<void> => {
  const filepath = path.resolve(
    __basedir,
    getConfigurationOption("output"),
    location.folder,
    location.file
  );

  await fs.writeFile(filepath, content);
};

export const generateMarkdownFromSchema = async (): Promise<any> => {
  const schema = loadSchemaFromConfiguration();
  const nodes = parseSchema(schema);

  const result = await nodes.map(async (node: any) => {
    const markdown = await renderNode(node);
    return markdown;
  });

  return result;
};
