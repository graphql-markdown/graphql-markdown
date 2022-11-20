import t from "tap";
import sinon from "sinon";

import {
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLDirective,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLSchema,
} from "graphql";

import Printer from "../../src/printer";

t.formatSnapshot = (object: any) => JSON.stringify(object, null, 2);

t.test("printCode()", async () => {
  const baseURL = "graphql";
  const root = "docs";

  const sandbox = sinon.createSandbox();
  const schema = sinon.createStubInstance(GraphQLSchema);

  t.beforeEach(() => {
    schema.getType.returnsArg(0);
  });

  const printerInstance = new Printer(schema, baseURL, root, {});

  const types = [
    {
      name: "Directive",
      spyOn: "printCodeDirective",
      type: new GraphQLDirective({
        name: "TestDirective",
        locations: [],
      }),
    },
    {
      name: "Enum",
      spyOn: "printCodeEnum",
      type: new GraphQLEnumType({
        name: "TestEnum",
        values: {},
      }),
    },
    {
      name: "Input",
      spyOn: "printCodeType",
      type: new GraphQLInputObjectType({
        name: "TestInput",
        fields: {},
      }),
    },
    {
      name: "Interface",
      spyOn: "printCodeType",
      type: new GraphQLInterfaceType({
        name: "TestInterface",
        fields: {},
      }),
    },
    {
      name: "Object",
      spyOn: "printCodeType",
      type: new GraphQLObjectType({
        name: "TestObject",
        fields: {},
      }),
    },
    {
      name: "Scalar",
      spyOn: "printCodeScalar",
      type: new GraphQLScalarType<string, string>({
        name: "TestScalar",
      }),
    },
    {
      name: "Union",
      spyOn: "printCodeUnion",
      type: new GraphQLUnionType({
        name: "TestUnion",
        types: [],
      }),
    },
    {
      name: "Query",
      spyOn: "printCodeField",
      type: {
        name: "TestQuery",
        type: GraphQLID,
        args: [],
      },
    },
  ];

  t.afterEach(() => {
    sandbox.restore();
  });

  types.forEach(({ name, type, spyOn }) =>
    t.test(
      `returns a Markdown graphql codeblock with type ${name}`,
      async () => {
        const spy = sandbox.spy(printerInstance, spyOn as keyof Printer);

        const code = printerInstance.printCode(type);

        t.ok(
          spy.calledWith(type),
          `returns a Markdown graphql codeblock with type ${name}`
        );

        t.matchSnapshot(
          code,
          `returns a Markdown graphql codeblock with type ${name}`
        );
      }
    )
  );

  t.test(
    "returns a Markdown codeblock with non supported message for unsupported type",
    async () => {
      const type = "TestFooBarType";

      const code = printerInstance.printCode(type as any);

      t.matchSnapshot(code);
    }
  );
});
