import path from "node:path";

jest.mock("fs");
jest.mock("node:fs/promises");

jest.mock("@graphql-markdown/utils", (): unknown => {
  return {
    __esModule: true,
    ...jest.requireActual("@graphql-markdown/utils"),
    isDeprecated: jest.fn(),
    ensureDir: jest.fn(),
    fileExists: jest.fn(),
    saveFile: jest.fn(),
    copyFile: jest.fn(),
    readFile: jest.fn(),
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

    jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
    const spy = jest.spyOn(Utils, "saveFile");

    await beforeGenerateIndexMetafileHook(outputPath, category);

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

    jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
    const spy = jest.spyOn(Utils, "saveFile");

    await beforeGenerateIndexMetafileHook(outputPath, category, {
      collapsed: false,
      collapsible: false,
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

    jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
    const spy = jest.spyOn(Utils, "saveFile");

    await beforeGenerateIndexMetafileHook(outputPath, category, {
      index: true,
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

    jest.spyOn(Utils, "fileExists").mockResolvedValue(true);
    const spy = jest.spyOn(Utils, "saveFile");

    await beforeGenerateIndexMetafileHook(outputPath, category);

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

    jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
    const spy = jest.spyOn(Utils, "saveFile");

    await beforeGenerateIndexMetafileHook(outputPath, category, {
      sidebarPosition: 42,
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

    jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
    const spy = jest.spyOn(Utils, "saveFile");

    await beforeGenerateIndexMetafileHook(outputPath, category, {
      sidebarPosition: 42,
      styleClass,
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

    jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
    const spy = jest.spyOn(Utils, "saveFile");

    await beforeGenerateIndexMetafileHook(outputPath, category);

    expect(spy).toHaveBeenCalledWith(
      filePath,
      `label: Common\nposition: 1\nlink: null\ncollapsible: true\ncollapsed: true\n`,
    );
  });

  test("ensures directory exists before saving file", async () => {
    expect.assertions(2);

    const category = "foobar";
    const outputPath = "/output/docs";

    jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
    const ensureDirSpy = jest.spyOn(Utils, "ensureDir");
    const saveFileSpy = jest.spyOn(Utils, "saveFile");

    await beforeGenerateIndexMetafileHook(outputPath, category);

    expect(ensureDirSpy).toHaveBeenCalledWith(outputPath);
    expect(saveFileSpy).toHaveBeenCalled();
  });
});
