import { GraphQLSchema } from "graphql/type";

import type { Formatter } from "@graphql-markdown/types";

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
        undefined,
        undefined,
      );
    });

    test("throws exception if no printer config set", async () => {
      expect.assertions(1);

      await expect(
        getPrinter(undefined, {
          groups: {},
          printTypeOptions: {},
        }),
      ).rejects.toThrow("Invalid printer config.");
    });

    test("throws error if printer initialization fails", async () => {
      expect.assertions(1);

      jest
        .spyOn(Printer, "init")
        .mockRejectedValueOnce(new Error("Init error"));

      await expect(
        getPrinter(
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
      ).rejects.toThrow("Init error");
    });

    test("passes mdxModule to printer initialization", async () => {
      expect.assertions(1);

      const spy = jest.spyOn(Printer, "init");
      const mdxModule = { test: true } as Partial<Formatter>;

      await getPrinter(
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
        undefined,
        undefined,
      );
    });

    test("passes mdxDeclaration to printer initialization", async () => {
      expect.assertions(1);

      const spy = jest.spyOn(Printer, "init");
      const mdxModule = { test: true } as Partial<Formatter>;

      await getPrinter(
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
        "mdx declaration string",
      );

      expect(spy).toHaveBeenCalledWith(
        expect.any(GraphQLSchema),
        "/",
        "root",
        expect.any(Object),
        mdxModule,
        "mdx declaration string",
        undefined,
      );
    });
  });
});
