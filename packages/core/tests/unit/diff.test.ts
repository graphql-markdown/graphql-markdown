import { GraphQLSchema } from "graphql/type";

import type { DiffMethodName } from "@graphql-markdown/types";

import { hasChanges } from "../../src/diff";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("@graphql-markdown/diff");
import * as diff from "@graphql-markdown/diff";

describe("diff", () => {
  describe("hasChanges()", () => {
    beforeEach(() => {
      // silent console
      jest.spyOn(global.console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });

    test.each([[undefined], [null]])(
      "returns true if diffMethod is %s",
      async (value: unknown) => {
        expect.assertions(2);

        const logSpy = jest.spyOn(console, "warn");

        await expect(
          hasChanges(new GraphQLSchema({}), "", value as DiffMethodName),
        ).resolves.toBeTruthy();
        expect(logSpy).not.toHaveBeenCalled();
      },
    );

    test.each([[undefined], [null]])(
      "returns true if diffModule is %s",
      async (value) => {
        expect.assertions(2);

        const logSpy = jest.spyOn(console, "warn");

        jest.spyOn(diff, "checkSchemaChanges").mockResolvedValueOnce(true);

        await expect(
          hasChanges(
            new GraphQLSchema({}),
            "",
            "NONE" as DiffMethodName,
            value,
          ),
        ).resolves.toBeTruthy();
        expect(logSpy).not.toHaveBeenCalled();
      },
    );

    test("returns true if diff module package not resolved", async () => {
      expect.assertions(2);

      const logSpy = jest.spyOn(console, "warn");

      jest.spyOn(diff, "checkSchemaChanges").mockResolvedValueOnce(true);

      await expect(
        hasChanges(
          new GraphQLSchema({}),
          "",
          "NONE" as DiffMethodName,
          "foobar",
        ),
      ).resolves.toBeTruthy();
      expect(logSpy).toHaveBeenCalledWith(
        "Cannot find module 'foobar' from @graphql-markdown/core!",
      );
    });

    test("returns boolean if diff module package resolved", async () => {
      expect.assertions(2);

      const logSpy = jest.spyOn(console, "warn");

      jest.spyOn(diff, "checkSchemaChanges").mockResolvedValueOnce(true);

      const result = await hasChanges(
        new GraphQLSchema({}),
        "",
        "FORCE" as DiffMethodName,
      );

      expect(typeof result === "boolean").toBeTruthy();
      expect(logSpy).not.toHaveBeenCalled();
    });

    test("returns true if checkSchemaChanges throws error", async () => {
      expect.assertions(2);

      const logSpy = jest.spyOn(console, "warn");
      jest
        .spyOn(diff, "checkSchemaChanges")
        .mockRejectedValueOnce(new Error("Test error"));

      const result = await hasChanges(
        new GraphQLSchema({}),
        "",
        "breaking" as DiffMethodName,
      );

      expect(result).toBeTruthy();
      expect(logSpy).toHaveBeenCalledWith(
        "Cannot find module '@graphql-markdown/diff' from @graphql-markdown/core!",
      );
    });

    test("returns value from checkSchemaChanges if successful", async () => {
      expect.assertions(2);

      const logSpy = jest.spyOn(console, "warn");
      jest.spyOn(diff, "checkSchemaChanges").mockResolvedValueOnce(false);

      const result = await hasChanges(
        new GraphQLSchema({}),
        "",
        "breaking" as DiffMethodName,
      );

      expect(result).toBeFalsy();
      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
