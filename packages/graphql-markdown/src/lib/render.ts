import * as path from "path";
import { promises as fs } from "fs";

import * as Eta from "eta";
import * as prettier from "prettier";
import kebabCase from "kebab-case";
import slugify from "slugify";

import { Configuration, ConfigurationOptions, OPTION } from "./config";
import { Maybe, ParsedNode } from "..";
import { getSimplifiedNodeKind } from "./parser";

const __basedir = path.resolve(__dirname, "../.."); // eslint-disable-line no-underscore-dangle

const INDEX = "layout";

const EXTENSION = {
  MD: ".md",
  MDX: ".mdx",
};

export const renderNode = async (
  node: ParsedNode,
  options?: Maybe<ConfigurationOptions>
): Promise<string> => {
  const layoutsFolder =
    options?.[OPTION.LAYOUTS] ?? Configuration.get(OPTION.LAYOUTS);

  const layout = path.resolve(__basedir, layoutsFolder, INDEX);
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
  const outputFolder =
    options?.[OPTION.OUTPUT] ?? Configuration.get(OPTION.OUTPUT);
  const folder = getSimplifiedNodeKind(node);
  const extension =
    (options?.[OPTION.MDX] ?? Configuration.get(OPTION.MDX)) === true
      ? EXTENSION.MDX
      : EXTENSION.MD;
  const filename = `${slug(node.name)}${extension}`;
  const filePath = path.resolve(
    __basedir,
    outputFolder,
    slug(folder),
    filename
  );

  const markdown = await renderNode(node, options);
  await fs.writeFile(filePath, markdown);

  return filePath;
};
