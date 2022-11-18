const t = require("tap");
const sinon = require("sinon");

const {
  GraphQLDirective,
  GraphQLBoolean,
  GraphQLString,
  DirectiveLocation,
} = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printCodeDirective()", async () => {
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

  t.test("returns a directive", async () => {
    const type = new GraphQLDirective({
      name: "FooBar",
      type: GraphQLString,
      locations: [],
    });

    const code = printerInstance.printCodeDirective(type);

    t.matchSnapshot(code, "returns a directive");
  });

  t.test("returns a directive with its arguments", async () => {
    const type = new GraphQLDirective({
      name: "FooBar",
      type: GraphQLString,
      locations: [],
      args: {
        ArgFooBar: {
          type: GraphQLBoolean,
        },
      },
    });

    const code = printerInstance.printCodeDirective(type);

    t.matchSnapshot(code, "returns a directive with its arguments");
  });

  [
    {
      testCase: "multiple locations",
      locations: [DirectiveLocation.QUERY, DirectiveLocation.FIELD],
    },
    { testCase: "single location", locations: [DirectiveLocation.QUERY] },
  ].forEach(({ testCase, locations }) => {
    t.test(`returns a directive with ${testCase}`, async () => {
      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
        locations: locations,
        args: {
          ArgFooBar: {
            type: GraphQLBoolean,
          },
        },
      });

      const code = printerInstance.printCodeDirective(type);

      t.matchSnapshot(code, `returns a directive with ${testCase}`);
    });
  });
});
