const t = require("tap");
const sinon = require("sinon");

const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
} = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printCodeType()", async () => {
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

  t.test("returns an interface with its fields", async () => {
    const type = new GraphQLInterfaceType({
      name: "TestInterfaceName",
      fields: {
        one: { type: GraphQLString },
        two: { type: GraphQLBoolean },
      },
    });

    const code = printerInstance.printCodeType(type);

    t.matchSnapshot(code, "returns an interface with its fields");
  });

  t.test("returns an object with its fields and interfaces", async () => {
    const type = new GraphQLObjectType({
      name: "TestName",
      fields: {
        one: { type: GraphQLString },
        two: { type: GraphQLBoolean },
      },
      interfaces: () => [
        new GraphQLInterfaceType({ name: "TestInterfaceName" }),
      ],
    });

    const code = printerInstance.printCodeType(type);

    t.matchSnapshot(code, "returns an object with its fields and interfaces");
  });

  t.test("returns an input with its fields", async () => {
    const type = new GraphQLInputObjectType({
      name: "TestName",
      fields: {
        one: { type: GraphQLString },
        two: { type: GraphQLBoolean },
      },
    });

    const code = printerInstance.printCodeType(type);

    t.matchSnapshot(code, "returns an input with its fields");
  });
});
