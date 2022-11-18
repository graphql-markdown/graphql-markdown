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

  t.test("printSection()", async () => {
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


    t.test("returns Markdown ### section by default", () => {
      const title = "section title";
      const content = "section content";

      const spy = sandbox.spy(printerInstance, "printSectionItems");
      const stub = sandbox
        .stub(printerInstance, "printSectionItems")
        .callsFake((sectionItems) => sectionItems);

      const section = printerInstance.printSection(content, title);

      t.ok(
        spy.calledWith(content, {
          parentType: undefined,
        }),
      );

      t.matchSnapshot(section, "returns Markdown ### section by default");

      stub.restore();
      spy.restore();
    });

    t.test("returns Markdown custom section level", async () => {
      const title = "section title";
      const content = "section content";

      const stub = sandbox
        .stub(printerInstance, "printSectionItems")
        .callsFake((sectionItems) => sectionItems);

      const section = printerInstance.printSection(content, title, {
        level: "#",
      });

      t.matchSnapshot(section, "returns Markdown custom section level");

      stub.restore();
    });

    t.test("returns empty string if content is empty", async () => {
      const title = "section title";
      const content = "";

      const section = printerInstance.printSection(content, title);

      t.equal(section, "");
    });
  });
