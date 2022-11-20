const t = require("tap");
const sinon = require("sinon");

const { GraphQLScalarType } = require("graphql");

const graphqlLib = require("@graphql-markdown/utils/graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printRelationOf()", async () => {
  const sandbox = sinon.createSandbox();

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

  t.afterEach(() => {
    sandbox.restore();
  });

  t.test("prints type relations", async () => {
    const type = new GraphQLScalarType({
      name: "String",
      description: "Lorem Ipsum",
    });

    sandbox.stub(graphqlLib, "getRelationOfReturn").callsFake(() => ({
      queries: [{ name: "Foo" }],
      interfaces: [{ name: "Bar" }],
      subscriptions: [{ name: "Baz" }],
    }));

    const deprecation = printerInstance.printRelationOf(
      type,
      "RelationOf",
      graphqlLib.getRelationOfReturn
    );

    t.matchSnapshot(deprecation, "prints type relations");
  });
});
