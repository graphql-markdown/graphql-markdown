const t = require("tap");
const sinon = require("sinon");

const { GraphQLInt, GraphQLScalarType, GraphQLUnionType } = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printCodeUnion()", async () => {
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

  t.test("returns union code structure", async () => {
    const type = new GraphQLUnionType({
      name: "UnionTypeName",
      types: [{ name: "one" }, { name: "two" }],
    });

    const code = printerInstance.printCodeUnion(type);

    t.matchSnapshot(code, "returns union code structure");
  });

  t.test("returns empty string if not union type", async () => {
    const type = new GraphQLScalarType({
      name: "ScalarTypeName",
      type: GraphQLInt,
    });

    const code = printerInstance.printCodeUnion(type);

    t.equal(code, "");
  });
});
