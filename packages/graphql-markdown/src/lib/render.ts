import * as path from "path";
import { promises as fs } from "fs";

import * as Eta from "eta";
import * as prettier from "prettier";
import kebabCase from "kebab-case";
import slugify from "slugify";

import { Configuration, ConfigurationOptions } from "./config";
import { Maybe, ParsedNode } from "..";
import { getSimplifiedNodeKind } from "./parser";

const __basedir = path.resolve(__dirname, "../.."); // eslint-disable-line no-underscore-dangle

export const renderNode = async (
  node: ParsedNode,
  options?: Maybe<ConfigurationOptions>
): Promise<string> => {
  const layout = path.resolve(
    __basedir,
    options?.layouts ?? Configuration.get("layouts"),
    "layout"
  );
  const result = (await Eta.renderFile(layout, node)) as string;

  return prettier.format(result, { parser: "markdown" });
};

export const slug = (input: string): string => {
  return slugify(kebabCase(input));
};

export const saveMarkdownFile = async (
  node: ParsedNode,
  options?: Maybe<ConfigurationOptions>
): Promise<string> => {
  const folder = getSimplifiedNodeKind(node);
  const filename = `${slug(node.name)}.${options?.mdx === true ? "mdx" : "md"}`;
  const filePath = path.resolve(
    __basedir,
    options?.output ?? Configuration.get("output"),
    slug(folder),
    filename
  );

  const markdown = await renderNode(node, options);
  await fs.writeFile(filePath, markdown);

  return filePath;
};
