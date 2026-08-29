import * as CoreGraphQLConfig from "../../src/graphql-config";

// Simulates graphql-config being installed but unreachable from
// @graphql-markdown/core, which is what a peer dependency conflict produces.
// Isolated in its own file: the throwing factory replaces the module for the
// whole registry, so it cannot share a file with the tests that need a working
// graphql-config.
jest.mock(
  "graphql-config",
  () => {
    throw new Error("Cannot find package 'graphql-config'");
  },
  { virtual: true },
);

describe("graphql-config", () => {
  describe("loadConfiguration()", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("reports the fallback to defaults when graphql-config cannot be resolved", async () => {
      expect.hasAssertions();

      const infoSpy = jest
        .spyOn(globalThis.console, "info")
        .mockImplementation(() => {});

      await expect(
        CoreGraphQLConfig.loadConfiguration("baz"),
      ).resolves.toBeUndefined();

      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Cannot find module 'graphql-config'. Any "graphql-markdown" configuration it provides is ignored`,
        ),
      );
    });
  });
});
