const t = require("tap");
const sinon = require("sinon");

const { GraphQLInt, GraphQLScalarType } = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printCodeScalar()", async () => {
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

  const type = new GraphQLScalarType({
    name: "ScalarTypeName",
    type: GraphQLInt,
  });

  t.test("returns scalar code structure", async () => {
    const code = printerInstance.printCodeScalar(type);

    t.matchSnapshot(code, "returns scalar code structure");
  });
});
