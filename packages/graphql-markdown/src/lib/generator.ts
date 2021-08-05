import { Configuration, ConfigurationOptions } from "./config";
import { LoadConfigOptions, ParsedNode, Result } from "..";
import { renderNode, saveMarkdownFile } from "./render";
import { parseSchema } from "./parser";

const loadNodes = async (
  options?: LoadConfigOptions
): Promise<ParsedNode[]> => {
  await Configuration.load(options);

  const schema = await Configuration.schema();

  if (typeof schema === "undefined") {
    throw new Error("An error occurred while loading the schema");
  }

  return parseSchema(schema);
};

type Options = {
  saveToFiles?: boolean;
  loaderOptions?: LoadConfigOptions;
  generatorOptions?: ConfigurationOptions;
};

export const generateMarkdownFromSchema = async (
  options?: Options
): Promise<Result[]> => {
  const nodes = await loadNodes(options?.loaderOptions);

  const processor =
    options?.saveToFiles === true ? saveMarkdownFile : renderNode;

  const results = await Promise.all(
    nodes.map(async (node: ParsedNode): Promise<Result> => {
      const result = await processor(node, options?.generatorOptions);
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
