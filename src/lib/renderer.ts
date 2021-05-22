import * as Eta from "eta";
import * as prettier from "prettier";

import { getConfigOption } from "./config";

export const renderNode = async (node: any): Promise<string> => {
  const result = (await Eta.renderFile(
    `${getConfigOption("layoutsFolder")}/index`,
    node
  )) as string;

  return prettier.format(result, { parser: "markdown" });
};
