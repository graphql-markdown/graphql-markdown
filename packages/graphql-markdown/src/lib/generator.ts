import {
  ConfigurationOptions,
  LoadConfigOptions,
  ParsedNode,
  Result,
} from "..";
import { renderNode, saveMarkdownFile } from "./render";
import { Configuration } from "./config";
import { parseSchema } from "./parser";

const loadNodes = async (): Promise<ParsedNode[]> => {
  const schema = await Configuration.schema();

  if (typeof schema === "undefined") {
    throw new Error("An error occurred while loading the schema");
  }

  return parseSchema(schema);
};

type Options = {
  saveToFiles?: boolean;
  loaderOptions?: LoadConfigOptions;
  markdownOptions?: ConfigurationOptions;
};

export const generateMarkdownFromSchema = async (
  options?: Options
): Promise<Result[]> => {
  await Configuration.load({
    graphqlConfig: options?.loaderOptions,
    markdownConfig: options?.markdownOptions,
  });

  const nodes = await loadNodes();

  const processor =
    options?.saveToFiles === true ? saveMarkdownFile : renderNode;

  const results = await Promise.all(
    nodes.map(async (node: ParsedNode): Promise<Result> => {
      const result = await processor(node);
      return {
        name: node.name,
        type: node.type,
        /* eslint-disable prettier/prettier */
        ...(options?.saveToFiles === true
          ? { filepath: result }
          : { markdown: result }),
        /* eslint-enable */
      };
    })
  );

  return results;
};
