import * as path from "path";
import { promises as fs } from "fs";

import { ASTNode, DocumentNode } from "graphql";

import { getSimplifiedNodeKind, parseSchema } from "../src/lib/parser";

describe("parser", () => {
  describe("getSimplifiedNodeKind", () => {
    const operations = [
      ["./__data__/node/mutation", "mutation"],
      ["./__data__/node/query", "query"],
      ["./__data__/node/subscription", "subscription"],
    ];
    it.each(operations)(
      "should return the operation object name as simplified type",
      async (source: string, expected: string) => {
        expect.hasAssertions();

        const node: ASTNode = (await import(source)).default as ASTNode;
        expect(getSimplifiedNodeKind(node)).toEqual(expected);
      }
    );
  });

  describe("parseSchema", () => {
    let schema: DocumentNode; // eslint-disable-line init-declarations

    beforeAll(async () => {
      const schemaLocation = path.resolve(
        `${__dirname}/__data__/schema/tweet.json`
      );
      schema = JSON.parse(
        (await fs.readFile(schemaLocation)).toString()
      ) as unknown as DocumentNode;
    });

    it("should returned a parsed schema", () => {
      expect.hasAssertions();

      const parsed = parseSchema(schema);

      expect(parsed).toMatchSnapshot();
    });
  });
});
