const path = require("path");

const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");

const { loadSchema, getSchemaMap } = require("../../../src/lib/graphql");

const EXPECT_PATH = path.join(
  __dirname,
  "__expect__",
  __OS__,
  path.basename(__filename),
);

const SCHEMA_FILE = require.resolve(
  "../../__data__/schema_with_custom_root_types.graphql",
);
describe("graphql", () => {
  describe("schema with custom rootTypes", () => {
    let schema;
    beforeAll(async () => {
      schema = await loadSchema(SCHEMA_FILE, {
        loaders: [new GraphQLFileLoader()],
        rootTypes: { query: "Root", subscription: "" },
      });
    });

    test("loadSchema returns schema with custom root types", () => {
      expect.hasAssertions();

      expect(schema.getQueryType().name).toBe("Root");
      expect(schema.getMutationType()).toBeUndefined();
      expect(schema.getSubscriptionType()).toBeUndefined();
    });

    test("getSchemaMap returns a filtered map of schema types", () => {
      expect.hasAssertions();

      const schemaTypeMap = getSchemaMap(schema);

      expect(JSON.stringify(schemaTypeMap, null, 2)).toMatchFile(
        path.join(EXPECT_PATH, `getSchemaMapCustomRootTypes.json`),
      );
    });
  });
});
