import * as path from "path";
import { promises as fs } from "fs";

import * as Eta from "eta";
import * as prettier from "prettier";
import kebabCase from "kebab-case";
import slugify from "slugify";

import { Configuration, OPTION } from "./config";
import { ParsedNode } from "..";
import { getSimplifiedNodeKind } from "./parser";

const __basedir = path.resolve(__dirname, "../.."); // eslint-disable-line no-underscore-dangle

const INDEX = "layout";

const EXTENSION = {
  MD: ".md",
  MDX: ".mdx",
};

export const renderNode = async (node: ParsedNode): Promise<string> => {
  const layoutsFolder = Configuration.get(OPTION.LAYOUTS) as string;

  const layout = path.resolve(__basedir, layoutsFolder, INDEX);
  const result = (await Eta.renderFile(layout, node)) as string;

  return prettier.format(result, { parser: "markdown" });
};

export const slug = (input: string): string => {
  return slugify(kebabCase(input));
};

export const saveMarkdownFile = async (node: ParsedNode): Promise<string> => {
  const outputFolder = Configuration.get(OPTION.OUTPUT) as string;
  const folder = getSimplifiedNodeKind(node);
  const extension =
    Configuration.get(OPTION.MDX) === true ? EXTENSION.MDX : EXTENSION.MD;
  const filename = `${slug(node.name)}${extension}`;
  const filePath = path.resolve(
    __basedir,
    outputFolder,
    slug(folder),
    filename
  );

  const markdown = await renderNode(node);
  await fs.writeFile(filePath, markdown);

  return filePath;
};
