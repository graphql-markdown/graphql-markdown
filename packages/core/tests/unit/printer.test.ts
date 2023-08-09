import { GraphQLSchema } from "graphql";

import type { PackageName } from "@graphql-markdown/types";

import { getPrinter } from "../../src/printer";

jest.mock("@graphql-markdown/printer-legacy");

describe("generator", () => {
  describe("getPrinter()", () => {
    test("returns Printer object for @graphql-markdown/printer-legacy", async () => {
      expect.assertions(3);

      const printer = await getPrinter(
        "@graphql-markdown/printer-legacy" as PackageName,
        {
          schema: new GraphQLSchema({}),
          baseURL: "/",
          linkRoot: "root",
        },
        {
          groups: {},
          printTypeOptions: {},
        },
      );

      expect(printer).toBeDefined();
      expect(printer).toHaveProperty("init");
      expect(printer).toHaveProperty("printType");
    });

    test.each([[undefined], [null]])(
      "throws exception if no printer module is %s",
      async (value) => {
        expect.assertions(1);

        await expect(
          getPrinter(
            value,
            {
              schema: new GraphQLSchema({}),
              baseURL: "/",
              linkRoot: "root",
            },
            {
              groups: {},
              printTypeOptions: {},
            },
          ),
        ).rejects.toThrow(
          `Invalid printer module name in "printTypeOptions" settings.`,
        );
      },
    );

    test("throws exception if no printer config set", async () => {
      expect.assertions(1);

      await expect(
        getPrinter(
          "@graphql-markdown/printer-legacy" as PackageName,
          undefined,
          {
            groups: {},
            printTypeOptions: {},
          },
        ),
      ).rejects.toThrow(
        `Invalid printer config in "printTypeOptions" settings.`,
      );
    });

    test("throws exception if no printer module not found", async () => {
      expect.assertions(1);

      await expect(
        getPrinter(
          "foobar" as PackageName,
          {
            schema: new GraphQLSchema({}),
            baseURL: "/",
            linkRoot: "root",
          },
          {
            groups: {},
            printTypeOptions: {},
          },
        ),
      ).rejects.toThrow(
        `Cannot find module 'foobar' defined in "printTypeOptions" settings.`,
      );
    });
  });
});
