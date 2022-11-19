import t from "tap";
import sinon from "sinon";

import {
  GraphQLArgument,
  GraphQLEnumValue,
  GraphQLInputType,
  GraphQLScalarType,
  GraphQLSchema,
} from "graphql";

import Printer from "../../src/printer";

t.formatSnapshot = (object: any) => JSON.stringify(object, null, 2);

t.test("printDeprecation()", async () => {
  const sandbox = sinon.createSandbox();

  const baseURL = "graphql";
  const root = "docs";
  const schema = sinon.createStubInstance(GraphQLSchema);
  schema.getType.returnsArg(0);

  const printerInstance = new Printer(schema, baseURL, root, {});

  t.afterEach(() => {
    sandbox.restore();
  });

  t.test("prints deprecated badge if type is deprecated", async () => {
    const type = {
      name: "EntityTypeName",
      isDeprecated: true,
      deprecationReason: undefined,
      description: undefined,
      type: {} as GraphQLInputType,
      defaultValue: undefined,
      extensions: {},
      astNode: undefined,
    } as GraphQLArgument;
    const deprecation = printerInstance.printDeprecation(type);

    t.matchSnapshot(
      deprecation,
      "prints deprecated badge if type is deprecated"
    );
  });

  t.test(
    "prints deprecation reason if type is deprecated with reason",
    async () => {
      const type = {
        name: "EntityTypeName",
        isDeprecated: true,
        deprecationReason: "foobar",
        description: undefined,
        type: {} as GraphQLInputType,
        value: undefined,
        extensions: {},
        astNode: undefined,
      } as GraphQLEnumValue;
      const deprecation = printerInstance.printDeprecation(type);

      t.matchSnapshot(
        deprecation,
        "prints deprecation reason if type is deprecated with reason"
      );
    }
  );

  t.test(
    "does not print deprecated badge if type is not deprecated",
    async () => {
      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
        specifiedByURL: "https://lorem.ipsum",
      });

      const deprecation = printerInstance.printDeprecation(type);

      t.equal(deprecation, "");
    }
  );
});
