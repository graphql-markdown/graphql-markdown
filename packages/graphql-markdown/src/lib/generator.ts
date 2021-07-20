import { ParsedNode } from "src/types";

import { loadSchemaFromConfiguration, parseSchema, renderNode } from "../";

export const generateMarkdownFromSchema = async (): Promise<string[]> => {
  const schema = loadSchemaFromConfiguration();
  const nodes = parseSchema(schema);

  const result = await Promise.all(
    nodes.map(async (node: ParsedNode) => {
      const markdown = await renderNode(node);
      return markdown;
    })
  );

  return result;
};
