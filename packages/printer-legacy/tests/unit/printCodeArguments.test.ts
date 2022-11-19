import t from "tap";
import sinon from "sinon";

import { GraphQLDirective, GraphQLScalarType, GraphQLSchema } from "graphql";

import Printer from "../../src/printer";

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printCodeArguments()", async () => {
  const sandbox = sinon.createSandbox();

  const baseURL = "graphql";
  const root = "docs";
  const schema = sinon.createStubInstance(GraphQLSchema);
  schema.getType.returnsArg(0);

  const printerInstance = new Printer(schema, baseURL, root, {});

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
            type: new GraphQLScalarType<string, string>({name: "string"}),
            defaultValue: "defaultValue",
          },
          ParamNoDefault: { type: new GraphQLScalarType<any, any>({name: "any"}) },
          ParamIntZero: { type: new GraphQLScalarType<number, number>({name: "int"}), defaultValue: 0 },
          ParamIntNoDefault: { type: new GraphQLScalarType<number, number>({name: "int"}) },
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
