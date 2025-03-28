import { GraphQLSchema } from "graphql/type";

import type { PackageName } from "@graphql-markdown/types";

import { getPrinter } from "../../src/printer";

import { Printer } from "@graphql-markdown/printer-legacy";
jest.mock("@graphql-markdown/printer-legacy");

describe("generator", () => {
  describe("getPrinter()", () => {
    test("returns Printer object for @graphql-markdown/printer-legacy", async () => {
      expect.assertions(4);

      const spy = jest.spyOn(Printer, "init");

      const printerConfig = {
        schema: new GraphQLSchema({}),
        baseURL: "/",
        linkRoot: "root",
      };
      const printerOptions = {
        groups: {},
        printTypeOptions: {},
      };
      const printer = await getPrinter(
        "@graphql-markdown/printer-legacy" as PackageName,
        printerConfig,
        printerOptions,
        undefined,
      );

      expect(printer).toBeDefined();
      expect(printer).toHaveProperty("init");
      expect(printer).toHaveProperty("printType");
      expect(spy).toHaveBeenCalledWith(
        printerConfig.schema,
        printerConfig.baseURL,
        printerConfig.linkRoot,
        printerOptions,
        undefined,
      );
    });

    test.each([[undefined], [null]])(
      "throws exception if printer module is %s",
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
        ).rejects.toThrow("Invalid printer module name.");
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
      ).rejects.toThrow("Invalid printer config.");
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
      ).rejects.toThrow("Cannot find module 'foobar'.");
    });

    test("throws error if printer module initialization fails", async () => {
      expect.assertions(1);

      jest
        .spyOn(Printer, "init")
        .mockRejectedValueOnce(new Error("Init error"));

      await expect(
        getPrinter(
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
        ),
      ).rejects.toThrow(
        "Cannot find module '@graphql-markdown/printer-legacy'",
      );
    });

    test("passes mdxModule to printer initialization", async () => {
      expect.assertions(1);

      const spy = jest.spyOn(Printer, "init");
      const mdxModule = { test: true };

      await getPrinter(
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
        mdxModule,
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(GraphQLSchema),
        "/",
        "root",
        expect.any(Object),
        mdxModule,
      );
    });
  });
});
