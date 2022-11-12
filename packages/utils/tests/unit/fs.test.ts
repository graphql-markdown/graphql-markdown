import t from "tap";

import { ensureDir, fileExists, saveFile } from "../../src/fs";

import { vol } from "memfs";

t.beforeEach(() => {
  vol.fromJSON({
    "/testFolder": "",
    "/testFolder/testFile": "just a t.test",
  });
});

t.afterEach(() => {
  vol.reset();
});

t.test("fileExists()", async () => {
  const data: {
    type: string;
    path: string;
    expected: boolean;
    desc: string;
  }[] = [
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
  ];

  data.forEach(async ({ type, path, expected, desc }) =>
    t.test(
      `return $expected if ${type} '${path}' ${desc}`,
      async ({ resolveMatch }) => {
        resolveMatch(fileExists(path), expected);
      }
    )
  );
});

t.test("ensureDir()", async () => {
  const data: { path: string; exists: boolean; desc: string }[] = [
    { path: "/testFolder", exists: true, desc: "not created if present" },
    {
      path: "/testNewFolder",
      exists: false,
      desc: "created if not present",
    },
  ];

  data.forEach(async ({ path, exists, desc }) =>
    t.test(`folder is ${desc}`, async ({ resolveMatch }) => {
      resolveMatch(fileExists(path), exists);

      await ensureDir(path);

      resolveMatch(fileExists(path), true);
    })
  );
});

t.test("saveFile()", async () => {
  t.test("create file and folders", async ({ same }) => {
    await saveFile("/foo/bar/test/foobar.test", "foobar file for t.test");

    same(vol.toJSON("/foo/bar/test/foobar.test"), {
      "/foo/bar/test/foobar.test": "foobar file for t.test",
    });
  });
});
