const t = require("tap");
const sinon = require("sinon");

const { GraphQLInt, GraphQLEnumType, GraphQLScalarType } = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printCodeEnum()", async () => {
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

  t.test("returns enum code structure", async () => {
    const type = new GraphQLEnumType({
      name: "EnumTypeName",
      values: {
        one: { value: "one" },
        two: { value: "two" },
      },
    });

    const code = printerInstance.printCodeEnum(type);

    t.matchSnapshot(code, "returns enum code structure");
  });

  t.test("returns empty string if not enum type", async () => {
    const type = new GraphQLScalarType({
      name: "ScalarTypeName",
      type: GraphQLInt,
    });

    const code = printerInstance.printCodeEnum(type);

    t.equal(code, "");
  });
});
