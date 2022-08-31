const { loadSchema } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { getFilteredTypeMap } = require("../../../src/lib/graphql");

const SCHEMA_FILE = require.resolve(
  "../../__data__/subscription_object_type.graphql",
);

describe("subscription object", () => {
  let schema;
  beforeAll(async () => {
    schema = await loadSchema(SCHEMA_FILE, {
      loaders: [new GraphQLFileLoader()],
    });
  });

  test("returns a filtered map of schema types", () => {
    expect.hasAssertions();

    const typeMap = schema.getTypeMap();
    const schemaTypeMap = getFilteredTypeMap(typeMap, []);

    expect(schemaTypeMap).toMatchInlineSnapshot(`
      {
        "Boolean": "Boolean",
        "ID": "ID",
        "String": "String",
        "Subscription": "Subscription",
      }
    `);
  });
});
