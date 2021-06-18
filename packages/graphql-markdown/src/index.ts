import path from "path";
export const __basedir = path.resolve(__dirname, ".."); // eslint-disable-line no-underscore-dangle

export * from "./lib/config";
export * from "./lib/generator";
export * from "./lib/parser";
export * from "./lib/render";
