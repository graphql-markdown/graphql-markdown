import * as fs from "fs/promises";
import { generateCode } from "../src/generate";
import { codegen } from "@graphql-codegen/core";
import { loadSchema, loadDocuments } from "@graphql-tools/load";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

jest.mock("fs/promises");
jest.mock("@graphql-tools/load");
jest.mock("@graphql-codegen/core");

describe("generateCode", () => {
  // Minimal valid GraphQLSchema for printSchema
  const mockSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: {
        _empty: { type: GraphQLString },
      },
    }),
  });
  const mockDocuments = [{}];
  const mockOutput = "generated code";

  beforeEach(() => {
    // @ts-ignore
    fs.writeFile.mockResolvedValue(undefined);
    // @ts-ignore
    loadSchema.mockResolvedValue(mockSchema);
    // @ts-ignore
    loadDocuments.mockResolvedValue(mockDocuments);
    // @ts-ignore
    codegen.mockResolvedValue(mockOutput);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("writes output to file if filename is provided", async () => {
    const config = {
      schema: "schema.graphql",
      documents: "docs.graphql",
      filename: "out.ts",
      plugins: [],
      pluginMap: {},
    };
    // All dependencies are already mocked in beforeEach

    // @ts-ignore
    const result = await generateCode(config);
    expect(fs.writeFile).toHaveBeenCalledWith("out.ts", mockOutput);
    expect(result).toBe(mockOutput);
  });

  it("does not write output to file if filename is not provided", async () => {
    const config = {
      schema: "schema.graphql",
      documents: "docs.graphql",
      plugins: [],
      pluginMap: {},
    };
    // All dependencies are already mocked in beforeEach

    // @ts-ignore
    const result = await generateCode(config);
    expect(fs.writeFile).not.toHaveBeenCalled();
    expect(result).toBe(mockOutput);
  });
});
