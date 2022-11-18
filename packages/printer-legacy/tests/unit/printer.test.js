const t = require("tap");
const sinon = require("sinon");

const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLDirective,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  DirectiveLocation,
} = require("graphql");

const graphqlLib = require("@graphql-markdown/utils/graphql");

const Printer = require("../../src/index");

t.formatSnapshot = (object) => JSON.stringify(object, null, 2);

t.test("class Printer", async () => {
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

  t.test("printSection()", async () => {
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

  t.test("printSectionItems()", async () => {
    t.test("returns Markdown one line per item", async () => {
      const spy = sandbox.spy(printerInstance, "printSectionItems");
      const stub = sandbox
        .stub(printerInstance, "printSectionItems")
        .callsFake((sectionItems) => sectionItems);

      const itemList = ["one", "two", "three"];

      const section = printerInstance.printSectionItems(itemList);

      t.equal(spy.callCount, 3);
      t.ok(
        spy.lastCall.calledWith(itemList.pop(), {
          level: "####",
        }),
      );
      t.matchSnapshot(section, "returns Markdown one line per item");

      stub.restore();
      spy.restore();
    });

    t.test("returns empty text if not a list", async () => {
      const itemList = "list";

      const section = printerInstance.printSectionItems(itemList);

      t.equal(section, "");
    });
  });

  t.test("printSectionItem()", async () => {
    t.test("returns Markdown #### link section with description", async () => {
      const type = new GraphQLObjectType({
        name: "EntityTypeName",
        description: "Lorem ipsum",
      });

      const section = printerInstance.printSectionItem(type);

      t.matchSnapshot(
        section,
        "returns Markdown #### link section with description",
      );
    });

    t.test(
      "returns Markdown #### link section with sub type is non-nullable",
      async () => {
        const type = {
          name: "EntityTypeName",
          type: new GraphQLNonNull(
            new GraphQLObjectType({
              name: "NonNullableObjectType",
            }),
          ),
        };

        const section = printerInstance.printSectionItem(type);

        t.matchSnapshot(
          section,
          "returns Markdown #### link section with sub type is non-nullable",
        );
      },
    );

    t.test(
      "returns Markdown #### link section with sub type list and non-nullable",
      async () => {
        const type = {
          name: "EntityTypeName",
          type: new GraphQLNonNull(
            new GraphQLList(
              new GraphQLObjectType({
                name: "NonNullableObjectType",
              }),
            ),
          ),
        };

        const section = printerInstance.printSectionItem(type);

        t.matchSnapshot(
          section,
          "returns Markdown #### link section with sub type list and non-nullable",
        );
      },
    );

    t.test(
      "returns Markdown #### link section with field parameters",
      async () => {
        const type = {
          name: "EntityTypeName",
          args: [
            {
              name: "ParameterTypeName",
              type: GraphQLString,
            },
          ],
        };

        const spy = sandbox.spy(printerInstance, "printSectionItems");

        const section = printerInstance.printSectionItem(type);

        t.ok(
          spy.calledWith(type.args, {
            level: "#####",
            parentType: undefined,
          }),
        );
        t.matchSnapshot(
          section,
          "returns Markdown #### link section with field parameters",
        );

        spy.restore();
      },
    );

    t.test(
      "returns Markdown #### link section with non empty nullable list [!]",
      async () => {
        const type = {
          name: "EntityTypeNameList",
          type: new GraphQLList(new GraphQLNonNull(GraphQLInt)),
        };

        const section = printerInstance.printSectionItem(type);

        t.matchSnapshot(
          section,
          "returns Markdown #### link section with non empty nullable list [!]",
        );
      },
    );

    t.test(
      "returns Markdown #### link section with non empty no nullable list [!]!",
      async () => {
        const type = {
          name: "EntityTypeNameList",
          type: new GraphQLNonNull(
            new GraphQLList(new GraphQLNonNull(GraphQLInt)),
          ),
        };

        const section = printerInstance.printSectionItem(type);

        t.matchSnapshot(
          section,
          "returns Markdown #### link section with non empty no nullable list [!]!",
        );
      },
    );
  });

  t.test("printCodeEnum()", async () => {
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
      const type = new GraphQLScalarType({
        name: "ScalarTypeName",
        type: GraphQLInt,
      });

      const code = printerInstance.printCodeEnum(type);

      t.equal(code, "");
    });
  });

  t.test("printCodeUnion()", async () => {
    t.test("returns union code structure", async () => {
      const type = new GraphQLUnionType({
        name: "UnionTypeName",
        types: [{ name: "one" }, { name: "two" }],
      });

      const code = printerInstance.printCodeUnion(type);

      t.matchSnapshot(code, "returns union code structure");
    });

    t.test("returns empty string if not union type", async () => {
      const type = new GraphQLScalarType({
        name: "ScalarTypeName",
        type: GraphQLInt,
      });

      const code = printerInstance.printCodeUnion(type);

      t.equal(code, "");
    });
  });

  t.test("printCodeScalar()", async () => {
    const type = new GraphQLScalarType({
      name: "ScalarTypeName",
      type: GraphQLInt,
    });

    t.test("returns scalar code structure", async () => {
      const code = printerInstance.printCodeScalar(type);

      t.matchSnapshot(code, "returns scalar code structure");
    });
  });

  t.test("printCodeArguments()", async () => {
    t.test(
      "returns a Markdown one line per formatted argument with default value surrounded by ()",
      async () => {
        const type = new GraphQLDirective({
          name: "OperationName",
          locations: [],
          args: {
            ParamWithDefault: {
              type: "string",
              defaultValue: "defaultValue",
            },
            ParamNoDefault: { type: "any" },
            ParamIntZero: { type: "int", defaultValue: 0 },
            ParamIntNoDefault: { type: "int" },
          },
        });

        const code = printerInstance.printCodeArguments(type);

        t.matchSnapshot(
          code,
          "returns a Markdown one line per formatted argument with default value surrounded by ()",
        );
      },
    );

    t.test("returns an empty string if args list empty", async () => {
      const type = {
        name: "OperationName",
        args: [],
      };

      const code = printerInstance.printCodeArguments(type);

      t.equal(code, "");
    });

    t.test("returns an empty string if no args", async () => {
      const type = {
        name: "OperationName",
      };

      const code = printerInstance.printCodeArguments(type);

      t.equal(code, "");
    });
  });

  t.test("printCodeField()", async () => {
    t.test("returns a field with its type", async () => {
      const type = { name: "FooBar", type: "string" };

      const code = printerInstance.printCodeField(type);

      t.matchSnapshot(code, "returns a field with its type");
    });

    t.test("returns a field with its type and arguments", async () => {
      const type = {
        name: "TypeFooBar",
        type: GraphQLString,
        args: [
          {
            name: "ArgFooBar",
            type: GraphQLString,
          },
        ],
      };

      const code = printerInstance.printCodeField(type);

      t.matchSnapshot(code, "returns a field with its type and arguments");
    });
  });

  t.test("printCodeDirective()", async () => {
    t.test("returns a directive", async () => {
      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
        locations: [],
      });

      const code = printerInstance.printCodeDirective(type);

      t.matchSnapshot(code, "returns a directive");
    });

    t.test("returns a directive with its arguments", async () => {
      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
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
    ].map(({ testCase, locations }) => {
      t.test(`returns a directive with ${testCase}`, async () => {
        const type = new GraphQLDirective({
          name: "FooBar",
          type: GraphQLString,
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

    t.test("printCodeType()", async () => {
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
            new GraphQLInterfaceType({ name: "TestInterfaceName" }),
          ],
        });

        const code = printerInstance.printCodeType(type);

        t.matchSnapshot(
          code,
          "returns an object with its fields and interfaces",
        );
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

    t.test("printHeader()", async () => {
      t.test("returns a Docusaurus document header", async () => {
        const header = printerInstance.printHeader(
          "an-object-type-name",
          "An Object Type Name",
        );

        t.matchSnapshot(header, "returns a Docusaurus document header");
      });

      t.test(
        "returns a Docusaurus document header with ToC disabled",
        async () => {
          const header = printerInstance.printHeader(
            "an-object-type-name",
            "An Object Type Name",
            { toc: false },
          );

          t.matchSnapshot(
            header,
            "returns a Docusaurus document header with ToC disabled",
          );
        },
      );

      t.test(
        "returns a Docusaurus document header with pagination disabled",
        async () => {
          const header = printerInstance.printHeader(
            "an-object-type-name",
            "An Object Type Name",
            { pagination: false },
          );

          t.matchSnapshot(
            header,
            "returns a Docusaurus document header with pagination disabled",
          );
        },
      );
    });

    t.test("printDescription()", async () => {
      t.test("returns the type description text", async () => {
        const type = { description: "Lorem ipsum" };
        const description = printerInstance.printDescription(type);

        t.matchSnapshot(description, "returns the type description text");
      });

      t.test("returns the default text if no description", async () => {
        const type = {};
        const description = printerInstance.printDescription(type);

        t.matchSnapshot(
          description,
          "returns the default text if no description",
        );
      });

      t.test("return DEPRECATED tag if deprecated", async () => {
        const type = {
          description: "Lorem ipsum",
          isDeprecated: true,
          deprecationReason: "Foobar",
        };
        const description = printerInstance.printDescription(type);

        t.matchSnapshot(description, "return DEPRECATED tag if deprecated");
      });
    });

    t.test("printCode()", async () => {
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

            spy.restore();
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

    t.test("printType()", async () => {
      types.map(({ name, type }) => {
        t.test(
          `returns a Markdown formatted Docusaurus content for type ${name}`,
          async () => {
            const stubs = [
              sandbox
                .stub(printerInstance, "printHeader")
                .callsFake((header) => `header-${header.toLowerCase()}`),
              sandbox
                .stub(printerInstance, "printDescription")
                .callsFake(() => `Test ${name}`),
              sandbox
                .stub(printerInstance, "printRelations")
                .callsFake(() => ""),
            ];

            const printedType = printerInstance.printType(name, type);

            t.matchSnapshot(
              printedType,
              `returns a Markdown formatted Docusaurus content for type ${name}`,
            );

            stubs.map((stub) => stub.restore());
          },
        );
      });

      typesWithInterface.map(({ name, type }) => {
        t.test(
          `returns a Markdown formatted Docusaurus content for ${name} implementing interface`,
          async () => {
            const stubs = [
              sandbox
                .stub(printerInstance, "printHeader")
                .callsFake((header) => `header-${header.toLowerCase()}`),
              sandbox
                .stub(printerInstance, "printDescription")
                .callsFake((t) => `Test ${t.name}`),
              sandbox
                .stub(printerInstance, "printRelations")
                .callsFake(() => ""),
            ];

            const printedType = printerInstance.printType(name, type);

            t.matchSnapshot(
              printedType,
              `returns a Markdown formatted Docusaurus content for ${name} implementing interface`,
            );

            stubs.map((stub) => stub.restore());
          },
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

          const stubs = [
            sandbox
              .stub(printerInstance, "printHeader")
              .callsFake((header) => `header-${header.toLowerCase()}`),
            sandbox.stub(printerInstance, "printRelations").callsFake(() => ""),
          ];

          const printedType = printerInstance.printType("scalar", scalarType);

          t.matchSnapshot(
            printedType,
            "prints a specification section if scalar as directive @specifiedBy",
          );

          stubs((stub) => stub.restore());
        },
      );
    });

    t.test("printDeprecation()", async () => {
      t.test("prints deprecated badge if type is deprecated", async () => {
        const type = {
          name: "EntityTypeName",
          isDeprecated: true,
        };
        const deprecation = printerInstance.printDeprecation(type);

        t.matchSnapshot(
          deprecation,
          "prints deprecated badge if type is deprecated",
        );
      });

      t.test(
        "prints deprecation reason if type is deprecated with reason",
        async () => {
          const type = {
            name: "EntityTypeName",
            isDeprecated: true,
            deprecationReason: "foobar",
          };
          const deprecation = printerInstance.printDeprecation(type);

          t.matchSnapshot(
            deprecation,
            "prints deprecation reason if type is deprecated with reason",
          );
        },
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
        },
      );
    });

    t.test("printSpecification()", async () => {
      t.test(
        "prints specification link if directive specified by is present",
        async () => {
          const type = new GraphQLScalarType({
            name: "LoremScalar",
            description: "Lorem Ipsum",
            specifiedByURL: "https://lorem.ipsum",
          });

          const deprecation = printerInstance.printSpecification(type);

          t.matchSnapshot(
            deprecation,
            "prints specification link if directive specified by is present",
          );
        },
      );

      t.test(
        "does not print specification link if directive specified by is not present",
        async () => {
          const type = new GraphQLScalarType({
            name: "LoremScalar",
            description: "Lorem Ipsum",
          });

          const deprecation = printerInstance.printSpecification(type);

          t.equal(deprecation, "");
        },
      );
    });

    t.test("printRelationOf()", async () => {
      t.test("prints type relations", async () => {
        const type = new GraphQLScalarType({
          name: "String",
          description: "Lorem Ipsum",
        });

        const stub = sandbox
          .stub(graphqlLib, "getRelationOfReturn")
          .callsFake(() => ({
            queries: [{ name: "Foo" }],
            interfaces: [{ name: "Bar" }],
            subscriptions: [{ name: "Baz" }],
          }));

        const deprecation = printerInstance.printRelationOf(
          type,
          "RelationOf",
          graphqlLib.getRelationOfReturn,
        );

        t.matchSnapshot(deprecation, "prints type relations");

        stub.restore();
      });
    });

    t.test("getRootTypeLocaleFromString()", async () => {
      t.test(
        "returns object of local strings from root type string",
        async () => {
          const deprecation =
            printerInstance.getRootTypeLocaleFromString("queries");

          t.matchSnapshot(
            deprecation,
            "returns object of local strings from root type string",
          );
        },
      );
    });
  });
});
