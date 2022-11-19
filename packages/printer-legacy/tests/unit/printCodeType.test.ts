import t from "tap";
import sinon from "sinon";

import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLSchema,
} from "graphql";

import Printer from "../../src/printer";

t.formatSnapshot = (object: any) => JSON.stringify(object, null, 2);

t.test("printCodeType()", async () => {
  const sandbox = sinon.createSandbox();

  const baseURL = "graphql";
  const root = "docs";
  const schema = sinon.createStubInstance(GraphQLSchema);
  schema.getType.returnsArg(0);

  const printerInstance = new Printer(schema, baseURL, root, {});

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
        new GraphQLInterfaceType({ name: "TestInterfaceName", fields: {} }),
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
