const t = require("tap");

const { GraphQLList, GraphQLDirective, GraphQLObjectType } = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("toLink()", async () => {
  const baseURL = "graphql";
  const root = "docs";
  const schema = {
    toString: () => "SCHEMA",
    getType: (type) => type,
    getTypeMap: () => {},
    getDirectives: () => {},
    getImplementations: () => {},
    getRootType: () => undefined,
    getQueryType: () => undefined,
    getMutationType: () => undefined,
    getSubscriptionType: () => undefined,
  };

  const printerInstance = new Printer(schema, baseURL, root);

  t.test("returns markdown link for GraphQL directive", async () => {
    const entityName = "TestDirective";
    const type = new GraphQLDirective({
      name: entityName,
      locations: [],
    });

    const link = printerInstance.toLink(type, entityName);

    t.matchSnapshot(link, "returns markdown link for GraphQL directive");
  });

  t.test(
    "returns markdown link surrounded by [] for GraphQL list/array",
    async () => {
      const entityName = "TestObjectList";
      const type = new GraphQLList(
        new GraphQLObjectType({
          name: entityName,
        }),
      );

      const link = printerInstance.toLink(type, entityName);

      t.matchSnapshot(
        link,
        "returns markdown link surrounded by [] for GraphQL list/array",
      );
    },
  );

  t.test("returns plain text for unknown entities", async () => {
    const type = "any";
    const entityName = "fooBar";

    const link = printerInstance.toLink(type, entityName);

    t.matchSnapshot(link, "returns plain text for unknown entities");
  });
});
