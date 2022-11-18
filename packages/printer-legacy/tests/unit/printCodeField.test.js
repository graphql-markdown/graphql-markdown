const t = require("tap");
const sinon = require("sinon");

const { GraphQLString } = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printCodeField()", async () => {
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

  t.test("returns a field with its type", async () => {
    const type = { name: "FooBar", type: "string" };

    const code = printerInstance.printCodeField(type);

    t.matchSnapshot(code, "returns a field with its type");
  });

  t.test("returns a field with its type and arguments", async () => {
    const type = {
      name: "TypeFooBar",
      type: GraphQLString,
      args: [
        {
          name: "ArgFooBar",
          type: GraphQLString,
        },
      ],
    };

    const code = printerInstance.printCodeField(type);

    t.matchSnapshot(code, "returns a field with its type and arguments");
  });
});
