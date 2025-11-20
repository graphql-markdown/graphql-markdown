import type {
  IPrinter,
  RendererDocOptions,
  TypeDeprecatedOption,
} from "@graphql-markdown/types";

jest.mock("node:fs/promises");

jest.mock("node:path", (): unknown => {
  return {
    __esModule: true,
    ...jest.requireActual("node:path"),
  };
});

jest.mock("@graphql-markdown/printer-legacy");
import { Printer } from "@graphql-markdown/printer-legacy";

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

jest.mock("@graphql-markdown/graphql", (): unknown => {
  return {
    __esModule: true,
    ...jest.requireActual("@graphql-markdown/graphql"),
    isDeprecated: jest.fn(),
    isApiType: jest.fn(),
  };
});
import * as GraphQL from "@graphql-markdown/graphql";

import { getRenderer, API_GROUPS } from "../../src/renderer";
import {
  DEFAULT_OPTIONS,
  DEFAULT_HIERARCHY,
  TypeHierarchy,
} from "../../src/config";

const DEFAULT_RENDERER_OPTIONS: RendererDocOptions = {
  ...DEFAULT_OPTIONS.docOptions,
  deprecated: DEFAULT_OPTIONS.printTypeOptions!
    .deprecated! as TypeDeprecatedOption,
  hierarchy: DEFAULT_HIERARCHY,
};

describe("generateCategoryMetafileType - focused tests", () => {
  const baseURL = "graphql";

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  test("throws when outputDir is empty", async () => {
    expect.assertions(1);

    const renderer: any = await getRenderer(
      Printer as unknown as typeof IPrinter,
      "/output",
      baseURL,
      undefined,
      false,
      DEFAULT_RENDERER_OPTIONS,
    );
    jest.replaceProperty(renderer, "outputDir", "");

    await expect(
      renderer.generateCategoryMetafileType({}, "TestType", "objects"),
    ).rejects.toThrow("Output directory is empty or not specified");
  });

  test("flat hierarchy returns outputDir and does not call generateIndexMetafile", async () => {
    expect.assertions(2);

    const mockGenerateIndexMetafile = jest.fn();
    const renderer: any = await getRenderer(
      Printer as unknown as typeof IPrinter,
      "/output",
      baseURL,
      undefined,
      false,
      {
        ...DEFAULT_RENDERER_OPTIONS,
        hierarchy: { [TypeHierarchy.FLAT]: {} },
      },
      { generateIndexMetafile: mockGenerateIndexMetafile },
    );

    const dir = await renderer.generateCategoryMetafileType(
      {},
      "Foo",
      "objects",
    );

    expect(mockGenerateIndexMetafile).not.toHaveBeenCalled();
    expect(dir).toBe(renderer.outputDir);
  });

  test("forwards categoryPositionManager.getPosition as sidebarPosition", async () => {
    expect.assertions(3);

    const mockGenerateIndexMetafile = jest.fn();
    const renderer: any = await getRenderer(
      Printer as unknown as typeof IPrinter,
      "/output",
      baseURL,
      undefined,
      false,
      DEFAULT_RENDERER_OPTIONS,
      { generateIndexMetafile: mockGenerateIndexMetafile },
    );

    // enable MDX forwarding
    renderer.mdxModuleIndexFileSupport = true;
    renderer.mdxModule = { generateIndexMetafile: mockGenerateIndexMetafile };
    renderer.categoryPositionManager = {
      getPosition: jest.fn().mockReturnValue(42),
    };

    await renderer.generateCategoryMetafileType({}, "Foo", "objects");

    // With API hierarchy, there are 2 calls: one for API group, one for entity category
    // We want to check the second call (entity category) which uses defaults
    const calledOptions = mockGenerateIndexMetafile.mock.calls[1][2];
    expect(calledOptions.sidebarPosition).toBe(42);
    expect(calledOptions.collapsible).toBe(true);
    expect(calledOptions.collapsed).toBe(true);
  });

  test("deprecated group creates deprecated group index with special styleClass", async () => {
    expect.assertions(4);

    const mockGenerateIndexMetafile = jest.fn();
    const renderer: any = await getRenderer(
      Printer as unknown as typeof IPrinter,
      "/output",
      baseURL,
      undefined,
      false,
      {
        ...DEFAULT_RENDERER_OPTIONS,
        deprecated: "group",
        hierarchy: { [TypeHierarchy.ENTITY]: {} },
      },
      { generateIndexMetafile: mockGenerateIndexMetafile },
    );

    renderer.mdxModuleIndexFileSupport = true;
    renderer.mdxModule = { generateIndexMetafile: mockGenerateIndexMetafile };
    jest.spyOn(GraphQL, "isDeprecated").mockReturnValueOnce(true);

    await renderer.generateCategoryMetafileType({}, "Foo", "objects");

    const call0 = mockGenerateIndexMetafile.mock.calls[0];
    expect(call0[0]).toBe("/output/deprecated");
    expect(call0[1]).toBe("deprecated");
    expect(call0[2].styleClass).toBe("graphql-markdown-deprecated-section");
    expect(call0[2].sidebarPosition).toBe(999);
  });

  test("forwards explicit index option from renderer.options", async () => {
    expect.assertions(1);

    const mockGenerateIndexMetafile = jest.fn();
    const renderer: any = await getRenderer(
      Printer as unknown as typeof IPrinter,
      "/output",
      baseURL,
      undefined,
      false,
      {
        ...DEFAULT_RENDERER_OPTIONS,
        index: false,
        hierarchy: { [TypeHierarchy.ENTITY]: {} },
      },
      { generateIndexMetafile: mockGenerateIndexMetafile },
    );

    renderer.mdxModuleIndexFileSupport = true;
    renderer.mdxModule = { generateIndexMetafile: mockGenerateIndexMetafile };

    await renderer.generateCategoryMetafileType({}, "Test", "objects");

    const opts = mockGenerateIndexMetafile.mock.calls[0][2];
    expect(opts.index).toBe(false);
  });
});
