const t = require("tap");
const sinon = require("sinon");

const { GraphQLDirective } = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printCodeArguments()", async () => {
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

  t.test(
    "returns a Markdown one line per formatted argument with default value surrounded by ()",
    async () => {
      const type = new GraphQLDirective({
        name: "OperationName",
        locations: [],
        args: {
          ParamWithDefault: {
            type: "string",
            defaultValue: "defaultValue",
          },
          ParamNoDefault: { type: "any" },
          ParamIntZero: { type: "int", defaultValue: 0 },
          ParamIntNoDefault: { type: "int" },
        },
      });

      const code = printerInstance.printCodeArguments(type);

      t.matchSnapshot(
        code,
        "returns a Markdown one line per formatted argument with default value surrounded by ()",
      );
    },
  );

  t.test("returns an empty string if args list empty", async () => {
    const type = {
      name: "OperationName",
      args: [],
    };

    const code = printerInstance.printCodeArguments(type);

    t.equal(code, "");
  });

  t.test("returns an empty string if no args", async () => {
    const type = {
      name: "OperationName",
    };

    const code = printerInstance.printCodeArguments(type);

    t.equal(code, "");
  });
});
