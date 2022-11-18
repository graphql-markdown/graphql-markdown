const t = require("tap");
const sinon = require("sinon");

const {
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLDirective,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
} = require("graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("printCode()", async () => {
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
      type: new GraphQLScalarType({
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

  types.map(({ name, type, spyOn }) =>
    t.test(
      `returns a Markdown graphql codeblock with type ${name}`,
      async () => {
        const spy = sandbox.spy(printerInstance, spyOn);

        const code = printerInstance.printCode(type);

        t.ok(spy.calledWith(type));

        t.matchSnapshot(
          code,
          `returns a Markdown graphql codeblock with type ${name}`,
        );
      },
    ),
  );

  t.test(
    "returns a Markdown codeblock with non supported message for unsupported type",
    async () => {
      const type = "TestFooBarType";

      const code = printerInstance.printCode(type);

      t.matchSnapshot(code);
    },
  );
});
