import { parseSchema } from "../src/lib/parser";

import { promises as fs } from "fs";
import * as path from "path";

import { DocumentNode } from "graphql";

describe("parseSchema", () => {
  let schema: DocumentNode;

  beforeAll(async () => {
    const schemaLocation = path.resolve(
      `${__dirname}/__data__/schema/tweet.json`
    );
    schema = JSON.parse((
      await fs.readFile(schemaLocation)
    ).toString()) as unknown as DocumentNode;
  });

  it("should returned a parsed schema ", () => {
    const parsed = parseSchema(schema);
    expect(parsed).toMatchSnapshot();
  });
});
