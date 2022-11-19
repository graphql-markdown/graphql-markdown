import t from "tap";
import sinon from "sinon";

import { GraphQLSchema, GraphQLScalarType } from "graphql";

import Printer from "../../src/printer";

t.formatSnapshot = (object: any) => JSON.stringify(object, null, 2);

t.test("printCodeScalar()", async () => {
  const sandbox = sinon.createSandbox();

  const baseURL = "graphql";
  const root = "docs";
  const schema = sinon.createStubInstance(GraphQLSchema);
  schema.getType.returnsArg(0);

  const printerInstance = new Printer(schema, baseURL, root, {});

  t.afterEach(() => {
    sandbox.restore();
  });

  const type = new GraphQLScalarType<number, number>({
    name: "ScalarTypeName"
  });

  t.test("returns scalar code structure", async () => {
    const code = printerInstance.printCodeScalar(type);

    t.matchSnapshot(code, "returns scalar code structure");
  });
});
