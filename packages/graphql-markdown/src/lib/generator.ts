import { LoadConfigOptions, ParsedNode } from "..";
import { renderNode, saveMarkdownFile } from "./render";
import { Configuration } from "./config";
import { parseSchema } from "./parser";

export type Result = {
  type: string;
  name: string;
  markdown?: string;
  filepath?: string;
};

const loadNodes = async (
  options?: LoadConfigOptions
): Promise<ParsedNode[]> => {
  await Configuration.load(options);

  const schema = await Configuration.loadSchema();

  if (typeof schema === "undefined") {
    throw new Error("An error occurred while loading the schema");
  }

  return parseSchema(schema);
};

export const generateMarkdownFromSchema = async (
  options?: LoadConfigOptions,
  saveToFiles?: boolean
): Promise<Result[]> => {
  const nodes = await loadNodes(options);

  const processor = saveToFiles === true ? saveMarkdownFile : renderNode;

  const results = await Promise.all(
    nodes.map(async (node: ParsedNode): Promise<Result> => {
      const result = await processor(node);
      return {
        name: node.name,
        type: node.type,
        // eslint-disable-next-line prettier/prettier
        ...saveToFiles === true ? { filepath: result } : { markdown: result },
      };
    })
  );

  return results;
};
