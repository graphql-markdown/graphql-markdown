import path from "node:path";

vi.mock("@graphql-markdown/utils", async (importOriginal): Promise<unknown> => {
  return {
    __esModule: true,
    ...(await importOriginal()),
    isDeprecated: vi.fn(),
    ensureDir: vi.fn(),
    fileExists: vi.fn(),
    saveFile: vi.fn(),
    copyFile: vi.fn(),
    readFile: vi.fn(),
    fsOutputAdapter: {
      writeFile: vi.fn(),
      ensureDir: vi.fn(),
      readFile: vi.fn(),
    },
  };
});
import * as Utils from "@graphql-markdown/utils";
import { beforeGenerateIndexMetafileHook } from "../../../src/mdx/category";

describe("beforeGenerateIndexMetafileHook()", () => {
  const CATEGORY_YAML = "_category_.yml";

  test("generate _category_.yml file", async () => {
    expect.assertions(1);

    const category = "foobar";
    const outputPath = path.join("/output/docs", category);
    const filePath = path.join(outputPath, CATEGORY_YAML);

    vi.mocked(Utils.fsOutputAdapter.readFile!).mockResolvedValue(undefined);
    const spy = vi.mocked(Utils.fsOutputAdapter.writeFile);

    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: outputPath,
        category,
      },
    });

    expect(spy).toHaveBeenCalledWith(
      filePath,
      `label: Foobar\nposition: 1\nlink: null\ncollapsible: true\ncollapsed: true\n`,
    );
  });

  test("generate _category_.yml file with options override", async () => {
    expect.assertions(1);

    const category = "foobar";
    const outputPath = path.join("/output/docs", category);
    const filePath = path.join(outputPath, CATEGORY_YAML);

    vi.mocked(Utils.fsOutputAdapter.readFile!).mockResolvedValue(undefined);
    const spy = vi.mocked(Utils.fsOutputAdapter.writeFile);

    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: outputPath,
        category,
        options: {
          collapsed: false,
          collapsible: false,
        },
      },
    });

    expect(spy).toHaveBeenCalledWith(
      filePath,
      `label: Foobar\nposition: 1\nlink: null\ncollapsible: false\ncollapsed: false\n`,
    );
  });

  test("generate _category_.yml file with generated index", async () => {
    expect.assertions(1);

    const category = "foobar";
    const outputPath = path.join("/output/docs", category);
    const filePath = path.join(outputPath, CATEGORY_YAML);

    vi.mocked(Utils.fsOutputAdapter.readFile!).mockResolvedValue(undefined);
    const spy = vi.mocked(Utils.fsOutputAdapter.writeFile);

    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: outputPath,
        category,
        options: { index: true },
      },
    });

    expect(spy).toHaveBeenCalledWith(
      filePath,
      `label: Foobar\nposition: 1\nlink: \n  type: generated-index\n  title: 'Foobar overview'\ncollapsible: true\ncollapsed: true\n`,
    );
  });

  test("do not generate _category_.yml file if it exists", async () => {
    expect.assertions(1);

    const category = "foobar";
    const outputPath = "/output/docs";
    const filePath = path.join(outputPath, CATEGORY_YAML);

    vi.mocked(Utils.fsOutputAdapter.readFile!).mockResolvedValue(
      "label: Existing\n",
    );
    const spy = vi.mocked(Utils.fsOutputAdapter.writeFile);

    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: outputPath,
        category,
      },
    });

    expect(spy).not.toHaveBeenCalledWith(
      filePath,
      `label: Foobar\nposition: 1\nlink: \n  type: generated-index\n  title: 'Foobar overview'\ncollapsible: true\ncollapsed: true\n`,
    );
  });

  test("generate _category_.yml file with sidebar position", async () => {
    expect.assertions(1);

    const category = "foobar";
    const outputPath = path.join("/output/docs", category);
    const filePath = path.join(outputPath, CATEGORY_YAML);

    vi.mocked(Utils.fsOutputAdapter.readFile!).mockResolvedValue(undefined);
    const spy = vi.mocked(Utils.fsOutputAdapter.writeFile);

    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: outputPath,
        category,
        options: { sidebarPosition: 42 },
      },
    });

    expect(spy).toHaveBeenCalledWith(
      filePath,
      `label: Foobar\nposition: 42\nlink: null\ncollapsible: true\ncollapsed: true\n`,
    );
  });

  test("generate _category_.yml file with classname", async () => {
    expect.assertions(1);

    const category = "foobar";
    const outputPath = path.join("/output/docs", category);
    const filePath = path.join(outputPath, CATEGORY_YAML);
    const styleClass = "foo-baz";

    vi.mocked(Utils.fsOutputAdapter.readFile!).mockResolvedValue(undefined);
    const spy = vi.mocked(Utils.fsOutputAdapter.writeFile);

    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: outputPath,
        category,
        options: {
          sidebarPosition: 42,
          styleClass,
        },
      },
    });

    expect(spy).toHaveBeenCalledWith(
      filePath,
      `label: Foobar\nposition: 42\nclassName: ${styleClass}\nlink: null\ncollapsible: true\ncollapsed: true\n`,
    );
  });

  test("generate _category_.yml file with numeric prefix in directory name", async () => {
    expect.assertions(1);

    const category = "common";
    const outputPath = path.join("/output/docs", "01-common");
    const filePath = path.join(outputPath, CATEGORY_YAML);

    vi.mocked(Utils.fsOutputAdapter.readFile!).mockResolvedValue(undefined);
    const spy = vi.mocked(Utils.fsOutputAdapter.writeFile);

    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: outputPath,
        category,
      },
    });

    expect(spy).toHaveBeenCalledWith(
      filePath,
      `label: Common\nposition: 1\nlink: null\ncollapsible: true\ncollapsed: true\n`,
    );
  });

  test("ensures directory exists before saving file", async () => {
    expect.assertions(2);

    const category = "foobar";
    const outputPath = "/output/docs";

    vi.mocked(Utils.fsOutputAdapter.readFile!).mockResolvedValue(undefined);
    const ensureDirSpy = vi.mocked(Utils.fsOutputAdapter.ensureDir!);
    const saveFileSpy = vi.mocked(Utils.fsOutputAdapter.writeFile);

    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: outputPath,
        category,
      },
    });

    expect(ensureDirSpy).toHaveBeenCalledWith(outputPath);
    expect(saveFileSpy).toHaveBeenCalled();
  });
});
