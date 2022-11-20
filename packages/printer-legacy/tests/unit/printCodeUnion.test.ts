import t from "tap";
import sinon from "sinon";

import {
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
} from "graphql";

import Printer from "../../src/printer";

t.formatSnapshot = (object: any) => JSON.stringify(object, null, 2);

t.test("printCodeUnion()", async () => {
  const sandbox = sinon.createSandbox();

  const baseURL = "graphql";
  const root = "docs";
  const schema = sinon.createStubInstance(GraphQLSchema);
  schema.getType.returnsArg(0);

  const printerInstance = new Printer(schema, baseURL, root, {});

  t.afterEach(() => {
    sandbox.restore();
  });

  t.test("returns union code structure", async () => {
    const type = new GraphQLUnionType({
      name: "UnionTypeName",
      types: [
        new GraphQLObjectType({
          name: "one",
          description: undefined,
          fields: {},
        }),
        new GraphQLObjectType({
          name: "two",
          description: undefined,
          fields: {},
        }),
      ],
    });

    const code = printerInstance.printCodeUnion(type);

    t.matchSnapshot(code, "returns union code structure");
  });

  t.test("returns empty string if not union type", async () => {
    const type = new GraphQLScalarType<number, number>({
      name: "ScalarTypeName",
    });

    const code = printerInstance.printCodeUnion(type);

    t.equal(code, "");
  });
});
