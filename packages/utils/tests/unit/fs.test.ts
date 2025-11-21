import { vol } from "memfs";

// Jest.mock must be called before importing the module that uses the mocked dependency
// In Jest 30+, we need to ensure the mock is properly set up before the fs module is loaded
jest.mock("node:fs/promises", () => {
  // Return the memfs vol promises directly
  const { vol: fsVol } = require("memfs");
  return fsVol.promises;
});

import { ensureDir, fileExists, saveFile } from "../../src/fs";

describe("fs", () => {
  beforeEach(() => {
    vol.fromJSON({
      "/testFolder": null,
      "/testFolder/testFile": "just a test",
      "/testFolder2": null,
      "/testFolder2/testFile": "just a test",
    });
  });

  afterEach(() => {
    vol.reset();
  });

  describe("fileExists()", () => {
    test.each([
      {
        type: "file",
        path: "/testFolder/testFile",
        expected: true,
        desc: "exists",
      },
      { type: "folder", path: "/testFolder", expected: true, desc: "exists" },
      {
        type: "file",
        path: "/testFolder/missingFile",
        expected: false,
        desc: "not exists",
      },
      {
        type: "folder",
        path: "/missingFolder",
        expected: false,
        desc: "not exists",
      },
    ])(
      "return $expected if $type '$path' $desc",
      async ({ path, expected }) => {
        expect.assertions(1);

        await expect(fileExists(path)).resolves.toBe(expected);
      },
    );
  });

  describe("ensureDir()", () => {
    test.each([
      { path: "/testFolder", exists: true, desc: "not created if present" },
      {
        path: "/testNewFolder",
        exists: false,
        desc: "created if not present",
      },
    ])("folder is $desc", async ({ path, exists }) => {
      expect.assertions(2);

      await expect(fileExists(path)).resolves.toBe(exists);

      await ensureDir(path);

      await expect(fileExists(path)).resolves.toBeTruthy();
    });

    test("folder is always empty if forceEmpty is true", async () => {
      expect.assertions(4);

      const folder = "/testFolder2";
      const file = `${folder}/testFile`;
      await expect(fileExists(file)).resolves.toBeTruthy();

      await ensureDir(folder, { forceEmpty: true });

      await expect(fileExists(folder)).resolves.toBeTruthy(); // folder should exist
      await expect(fileExists(file)).resolves.toBeFalsy(); // folder should be empty
      await expect(fileExists("/testFolder/testFile")).resolves.toBeTruthy(); // other folders should be untouched
    });

    test.each([[undefined], [null], [{ forceEmpty: false }], [{}]])(
      "folder is left unchanged if forceEmpty is %s",
      async (options) => {
        expect.assertions(2);

        const folder = "/testFolder2";
        const file = `${folder}/testFile`;
        await expect(fileExists(file)).resolves.toBeTruthy();

        await ensureDir(folder, options);

        await expect(fileExists(file)).resolves.toBeTruthy();
      },
    );
  });

  describe("saveFile()", () => {
    test("create file and folders", async () => {
      expect.assertions(1);

      await saveFile("/foo/bar/test/foobar.test", "foobar file for test");

      expect(vol.toJSON("/foo/bar/test/foobar.test")).toMatchInlineSnapshot(`
        {
          "/foo/bar/test/foobar.test": "foobar file for test",
        }
      `);
    });

    test("run prettify function if valid", async () => {
      expect.assertions(1);

      await saveFile(
        "/foo/bar/test/prettify.test",
        "foobar file for test",
        async () => {
          return "prettify hello";
        },
      );

      expect(vol.toJSON("/foo/bar/test/prettify.test")).toMatchInlineSnapshot(`
        {
          "/foo/bar/test/prettify.test": "prettify hello",
        }
      `);
    });
  });
});
