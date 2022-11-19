import t from "tap";
import sinon from "sinon";

import {
  GraphQLInputField,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

import Printer from "../../src/printer";

t.formatSnapshot = (object: any) => JSON.stringify(object, null, 2);

t.test("printCodeField()", async () => {
  const sandbox = sinon.createSandbox();

  const baseURL = "graphql";
  const root = "docs";
  const schema = sinon.createStubInstance(GraphQLSchema);
  schema.getType.returnsArg(0);

  const printerInstance = new Printer(schema, baseURL, root, {});

  t.afterEach(() => {
    sandbox.restore();
  });

  t.test("returns a field with its type", async () => {
    const type = {
      name: "FooBar",
      type: GraphQLString,
      description: "",
      defaultValue: undefined,
      deprecationReason: undefined,
      extensions: {},
      astNode: undefined,
    } as GraphQLInputField;

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
      description: "",
      defaultValue: undefined,
      deprecationReason: undefined,
      extensions: {},
      astNode: undefined,
    } as GraphQLInputField;

    const code = printerInstance.printCodeField(type);

    t.matchSnapshot(code, "returns a field with its type and arguments");
  });
});
