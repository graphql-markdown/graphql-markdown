import { vol } from "memfs";

// `vi.mock` is hoisted above the imports below, so `node:fs/promises` is
// already replaced by the memfs-backed manual mock by the time
// `../../src/fs` is evaluated.
// The factory runs in an ESM context: it cannot close over outer bindings
// (hence no reference to `vol` above) and cannot use CJS `require`, so the
// manual mock is pulled in with a dynamic `import()`. `memfs` exports a single
// shared `vol`, so the instance seeded in `beforeEach` is the one the mock
// serves.
vi.mock("node:fs/promises", async () => {
  const memfsPromises = (await import("../__mocks__/node:fs/promises")).default;
  return { ...memfsPromises, default: memfsPromises };
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
