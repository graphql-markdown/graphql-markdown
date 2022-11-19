import t from "tap";
import sinon from "sinon";

import { GraphQLEnumType, GraphQLScalarType, GraphQLSchema } from "graphql";

import Printer from "../../src/printer";

t.formatSnapshot = (object: any) => JSON.stringify(object, null, 2);

t.test("printCodeEnum()", async () => {
  const sandbox = sinon.createSandbox();

  const baseURL = "graphql";
  const root = "docs";
  const schema = sinon.createStubInstance(GraphQLSchema);
  schema.getType.returnsArg(0);

  const printerInstance = new Printer(schema, baseURL, root, {});

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
    const type = new GraphQLScalarType<number, number>({
      name: "ScalarTypeName",
    });

    const code = printerInstance.printCodeEnum(type);

    t.equal(code, "");
  });
});
