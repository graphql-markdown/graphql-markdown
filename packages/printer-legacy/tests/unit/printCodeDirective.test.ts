import t from "tap";
import sinon from "sinon";

import {
  GraphQLDirective,
  GraphQLBoolean,
  DirectiveLocation,
  GraphQLSchema,
} from "graphql";

import Printer from "../../src/printer";

t.formatSnapshot = (object: any) => JSON.stringify(object, null, 2);

t.test("printCodeDirective()", async () => {
  const sandbox = sinon.createSandbox();

  const baseURL = "graphql";
  const root = "docs";
  const schema = sinon.createStubInstance(GraphQLSchema);
  schema.getType.returnsArg(0);

  const printerInstance = new Printer(schema, baseURL, root, {});

  t.afterEach(() => {
    sandbox.restore();
  });

  t.test("returns a directive", async () => {
    const type = new GraphQLDirective({
      name: "FooBar",
      locations: [],
    });

    const code = printerInstance.printCodeDirective(type);

    t.matchSnapshot(code, "returns a directive");
  });

  t.test("returns a directive with its arguments", async () => {
    const type = new GraphQLDirective({
      name: "FooBar",
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
