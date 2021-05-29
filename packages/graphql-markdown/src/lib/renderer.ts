import * as path from "path";

import * as Eta from "eta";
import * as prettier from "prettier";

import { getConfigurationOption } from "./config";

export const renderNode = async (node: any): Promise<string> => {
  const layout = path.resolve(
    process.cwd(),
    getConfigurationOption("layouts"),
    "layout"
  );
  const result = (await Eta.renderFile(layout, node)) as string;

  return prettier.format(result, { parser: "markdown" });
};
