import t from "tap";
import esmock from "esmock";

import { fs, vol } from "memfs";

t.test("fs", async () => {
  const { ensureDir, fileExists, saveFile } = await esmock(
    "../../src/fs",
    import.meta.url,
    {
      "node:fs/promises": fs.promises,
    }
  );

  t.beforeEach(() => {
    vol.fromJSON(
      {
        testFile: "just a test",
      },
      "/testFolder"
    );
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
      t.test(`return $expected if ${type} '${path}' ${desc}`, async () => {
        const res = await fileExists(path);
        t.equal(res, expected);
      })
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
      t.test(`folder is ${desc}`, async () => {
        const before = await fileExists(path);
        t.equal(before, exists);

        await ensureDir(path);

        const after = await fileExists(path);
        t.ok(after);
      })
    );
  });

  t.test("saveFile()", async () => {
    t.test("create file and folders", async () => {
      await saveFile("/foo/bar/test/foobar.test", "foobar file for t.test");

      t.same(vol.toJSON("/foo/bar/test/foobar.test"), {
        "/foo/bar/test/foobar.test": "foobar file for t.test",
      });
    });
  });
});
