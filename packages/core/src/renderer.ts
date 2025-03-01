import type {
  ApiGroupOverrideType,
  Category,
  Maybe,
  MDXString,
  Printer,
  RendererDocOptions,
  SchemaEntitiesGroupMap,
  SchemaEntity,
  TypeHierarchyObjectType,
  TypeHierarchyValueType,
} from "@graphql-markdown/types";

import { basename, join, relative, normalize } from "node:path";

import { isApiType, isDeprecated } from "@graphql-markdown/graphql";

import {
  copyFile,
  ensureDir,
  fileExists,
  pathUrl,
  prettifyMarkdown,
  readFile,
  saveFile,
  startCase,
  slugify,
} from "@graphql-markdown/utils";

import { log, LogLevel } from "@graphql-markdown/logger";
import { TypeHierarchy } from "./config";

const DEPRECATED = "deprecated" as const;
const CATEGORY_YAML = "_category_.yml" as const;
const CATEGORY_STYLE_CLASS = "graphql-markdown-api-section" as const;

enum SidebarPosition {
  FIRST = 1,
  LAST = 999,
}

export const API_GROUPS: Required<ApiGroupOverrideType> = {
  operations: "operations",
  types: "types",
} as const;

export const getApiGroupFolder = (
  type: unknown,
  groups?: Maybe<ApiGroupOverrideType | boolean>,
): string => {
  let folderNames = API_GROUPS;
  if (groups && typeof groups === "object") {
    folderNames = { ...API_GROUPS, ...groups };
  }
  return isApiType(type) ? folderNames.operations : folderNames.types;
};

const isHierarchy = (
  options: Maybe<RendererDocOptions>,
  hierarchy: TypeHierarchyValueType,
): options is RendererDocOptions & { hierarchy: TypeHierarchyObjectType } => {
  return (options?.hierarchy?.[hierarchy] && true) as boolean;
};

export class Renderer {
  group: Maybe<SchemaEntitiesGroupMap>;
  outputDir: string;
  baseURL: string;
  prettify: boolean;
  options: Maybe<RendererDocOptions>;
  hasMDXSupport: boolean;

  private readonly printer: Printer;

  constructor(
    printer: Printer,
    outputDir: string,
    baseURL: string,
    group: Maybe<SchemaEntitiesGroupMap>,
    prettify: boolean,
    docOptions: Maybe<RendererDocOptions>,
    mdx: boolean = false,
  ) {
    this.printer = printer;
    this.group = group;
    this.outputDir = outputDir;
    this.baseURL = baseURL;
    this.prettify = prettify;
    this.options = docOptions;
    this.hasMDXSupport = mdx;
  }

  async generateCategoryMetafile(
    category: string,
    dirPath: string,
    sidebarPosition?: number,
    styleClass?: string,
    options: { collapsible: boolean; collapsed: boolean } = {
      collapsible: true,
      collapsed: true,
    },
  ): Promise<void> {
    const filePath = join(dirPath, CATEGORY_YAML);

    if (await fileExists(filePath)) {
      return;
    }

    await ensureDir(dirPath);

    const label = startCase(category);
    const link =
      this.options && this.options.index !== true
        ? "null"
        : `\n  type: generated-index\n  title: '${label} overview'`;
    const className =
      typeof styleClass === "string" ? `className: ${styleClass}\n` : "";
    const position =
      typeof sidebarPosition === "number"
        ? sidebarPosition
        : SidebarPosition.FIRST;
    await saveFile(
      filePath,
      `label: ${label}\nposition: ${position}\n${className}link: ${link}\ncollapsible: ${options.collapsible}\ncollapsed: ${options.collapsed}\n`,
    );
  }

  async generateCategoryMetafileType(
    type: unknown,
    name: string,
    rootTypeName: SchemaEntity,
  ): Promise<string> {
    let dirPath = this.outputDir;

    if (isHierarchy(this.options, TypeHierarchy.FLAT)) {
      return dirPath;
    }

    const useApiGroup = isHierarchy(this.options, TypeHierarchy.API)
      ? this.options.hierarchy[TypeHierarchy.API]
      : (!this.options?.hierarchy as boolean);

    if (useApiGroup) {
      const typeCat = getApiGroupFolder(type, useApiGroup);
      dirPath = join(dirPath, slugify(typeCat));
      await this.generateCategoryMetafile(
        typeCat,
        dirPath,
        undefined,
        CATEGORY_STYLE_CLASS,
        { collapsible: false, collapsed: false },
      );
    }

    if (this.options?.deprecated === "group" && isDeprecated(type)) {
      dirPath = join(dirPath, slugify(DEPRECATED));
      await this.generateCategoryMetafile(
        DEPRECATED,
        dirPath,
        SidebarPosition.LAST,
        DEPRECATED,
      );
    }

    if (
      this.group &&
      rootTypeName in this.group &&
      name in this.group[rootTypeName]!
    ) {
      dirPath = join(dirPath, slugify(this.group[rootTypeName]![name] ?? ""));
      await this.generateCategoryMetafile(
        this.group[rootTypeName]![name] ?? "",
        dirPath,
      );
    }

    dirPath = join(dirPath, slugify(rootTypeName));
    await this.generateCategoryMetafile(rootTypeName, dirPath);

    return dirPath;
  }

  async renderRootTypes(
    rootTypeName: SchemaEntity,
    type: unknown,
  ): Promise<Maybe<Maybe<Category>[]>> {
    if (typeof type !== "object" || type === null) {
      return undefined;
    }

    const isFlat = isHierarchy(this.options, TypeHierarchy.FLAT);
    return Promise.all(
      Object.keys(type)
        .map(async (name) => {
          let dirPath = this.outputDir;

          if (!isFlat) {
            dirPath = await this.generateCategoryMetafileType(
              (type as Record<string, unknown>)[name],
              name,
              rootTypeName,
            );
          }

          return this.renderTypeEntities(
            dirPath,
            name,
            (type as Record<string, unknown>)[name],
          );
        })
        .filter((res) => {
          return typeof res !== "undefined";
        }),
    );
  }

  async renderTypeEntities(
    dirPath: string,
    name: string,
    type: unknown,
  ): Promise<Maybe<Category>> {
    const PageRegex =
      /(?<category>[A-Za-z0-9-]+)[\\/]+(?<pageId>[A-Za-z0-9-]+).mdx$/;
    const PageRegexFlat = /(?<pageId>[A-Za-z0-9-]+).mdx$/;

    const extension = this.hasMDXSupport ? "mdx" : "md";
    const fileName = slugify(name);
    const filePath = join(normalize(dirPath), `${fileName}.${extension}`);

    let content: MDXString;
    try {
      content = this.printer.printType(fileName, type, this.options);
      if (typeof content !== "string") {
        return undefined;
      }
    } catch {
      log(`An error occurred while processing "${type}"`, LogLevel.warn);
      return undefined;
    }

    await saveFile(
      filePath,
      content,
      this.prettify ? prettifyMarkdown : undefined,
    );

    const pagePath = relative(this.outputDir, filePath);

    const isFlat = isHierarchy(this.options, TypeHierarchy.FLAT);

    const page = isFlat
      ? PageRegexFlat.exec(pagePath)
      : PageRegex.exec(pagePath);

    if (!page?.groups) {
      log(
        `An error occurred while processing file ${filePath} for type "${type}"`,
        LogLevel.warn,
      );
      return undefined;
    }

    const slug = isFlat
      ? page.groups.pageId
      : pathUrl.join(page.groups.category, page.groups.pageId);
    const category = isFlat ? "schema" : startCase(page.groups.category);

    return {
      category,
      slug,
    } as Category;
  }

  async renderHomepage(homepageLocation: string): Promise<void> {
    const homePage = basename(homepageLocation);
    const destLocation = join(this.outputDir, homePage);
    const slug = pathUrl.resolve("/", this.baseURL);

    await copyFile(homepageLocation, destLocation);

    const template = await readFile(destLocation);

    const data = template
      .toString()
      .replace(/##baseURL##/gm, slug)
      .replace(/##generated-date-time##/gm, new Date().toLocaleString());

    await saveFile(destLocation, data);
  }
}

export const getRenderer = async (
  printer: Printer,
  outputDir: string,
  baseURL: string,
  group: Maybe<SchemaEntitiesGroupMap>,
  prettify: boolean,
  docOptions: Maybe<RendererDocOptions>,
  mdx: boolean = false,
): Promise<InstanceType<typeof Renderer>> => {
  await ensureDir(outputDir, { forceEmpty: docOptions?.force });
  return new Renderer(
    printer,
    outputDir,
    baseURL,
    group,
    prettify,
    docOptions,
    mdx,
  );
};
