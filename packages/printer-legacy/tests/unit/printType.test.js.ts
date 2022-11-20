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

t.test("printType()", async () => {
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

  const typesWithInterface = [
    {
      name: "InterfaceType",
      spyOn: "printCodeType",
      type: new GraphQLInterfaceType({
        name: "TestInterfaceType",
        fields: {},
        interfaces: [{ name: "TestInterface" }],
      }),
    },
    {
      name: "Object",
      spyOn: "printCodeType",
      type: new GraphQLObjectType({
        name: "TestObject",
        fields: {},
        interfaces: [{ name: "TestInterface" }],
      }),
    },
  ];

  t.afterEach(() => {
    sandbox.restore();
  });

  types.forEach(({ name, type }) => {
    t.test(
      `returns a Markdown formatted Docusaurus content for type ${name}`,
      async () => {
        sandbox
          .stub(printerInstance, "printHeader")
          .callsFake((header) => `header-${header.toLowerCase()}`);
        sandbox
          .stub(printerInstance, "printDescription")
          .callsFake(() => `Test ${name}`);
        sandbox.stub(printerInstance, "printRelations").callsFake(() => "");

        const printedType = printerInstance.printType(name, type);

        t.matchSnapshot(
          printedType,
          `returns a Markdown formatted Docusaurus content for type ${name}`
        );
      }
    );
  });

  typesWithInterface.forEach(({ name, type }) => {
    t.test(
      `returns a Markdown formatted Docusaurus content for ${name} implementing interface`,
      async () => {
        sandbox
          .stub(printerInstance, "printHeader")
          .callsFake((header) => `header-${header.toLowerCase()}`);
        sandbox
          .stub(printerInstance, "printDescription")
          .callsFake((t) => `Test ${t.name}`);
        sandbox.stub(printerInstance, "printRelations").callsFake(() => "");

        const printedType = printerInstance.printType(name, type);

        t.matchSnapshot(
          printedType,
          `returns a Markdown formatted Docusaurus content for ${name} implementing interface`
        );
      }
    );
  });

  t.test("returns an empty string if no type", async () => {
    const printedType = printerInstance.printType("any", null);

    t.equal(printedType, "");
  });

  t.test(
    "prints a specification section if scalar as directive @specifiedBy",
    async () => {
      const scalarType = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
        specifiedByURL: "https://lorem.ipsum",
      });

      sandbox
        .stub(printerInstance, "printHeader")
        .callsFake((header) => `header-${header.toLowerCase()}`);
      sandbox.stub(printerInstance, "printRelations").callsFake(() => "");

      const printedType = printerInstance.printType("scalar", scalarType);

      t.matchSnapshot(
        printedType,
        "prints a specification section if scalar as directive @specifiedBy"
      );
    }
  );
});
