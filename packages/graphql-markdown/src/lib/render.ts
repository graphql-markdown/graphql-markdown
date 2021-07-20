import * as path from "path";
import { promises as fs } from "fs";

import * as Eta from "eta";
import * as prettier from "prettier";
import kebabCase from "kebab-case";
import slugify from "slugify";

import {
  __basedir,
  getConfigurationOption,
  getSimplifiedNodeKind,
} from "../index";

import { ParsedNode } from "src/types";

export const renderNode = async (node: ParsedNode): Promise<string> => {
  const layout = path.resolve(
    __basedir,
    getConfigurationOption("layouts"),
    "layout"
  );
  const result = (await Eta.renderFile(layout, node)) as string;

  return prettier.format(result, { parser: "markdown" });
};

export const slug = (input: string): string => {
  return slugify(kebabCase(input));
};

export const saveMarkdownFile = async (node: ParsedNode): Promise<string> => {
  const folder = getSimplifiedNodeKind(node);
  const filename = `${slug(node.name)}.md`;
  const filePath = path.resolve(
    __basedir,
    getConfigurationOption("output"),
    slug(folder),
    filename
  );

  const markdown = await renderNode(node);
  await fs.writeFile(filePath, markdown);

  return filePath;
};
