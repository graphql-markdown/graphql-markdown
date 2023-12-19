import type {
  Category,
  ConfigDocOptions,
  Maybe,
  MDXString,
  Printer,
  SchemaEntitiesGroupMap,
  SchemaEntity,
  TypeDeprecatedOption,
} from "@graphql-markdown/types";

import { basename, join, relative, normalize } from "node:path";

import { isDeprecated } from "@graphql-markdown/graphql";

import {
  copyFile,
  ensureDir,
  fileExists,
  pathUrl,
  prettifyJavascript,
  prettifyMarkdown,
  readFile,
  saveFile,
  startCase,
  slugify,
} from "@graphql-markdown/utils";

import { log, LogLevel } from "@graphql-markdown/logger";

const SIDEBAR = "sidebar-schema.js" as const;
const CATEGORY_YAML = "_category_.yml" as const;

enum SidebarPosition {
  FIRST = 1,
  LAST = 999,
}

export class Renderer {
  group: Maybe<SchemaEntitiesGroupMap>;
  outputDir: string;
  baseURL: string;
  prettify: boolean;
  options: Maybe<ConfigDocOptions & { deprecated: TypeDeprecatedOption }>;

  private readonly printer: Printer;

  constructor(
    printer: Printer,
    outputDir: string,
    baseURL: string,
    group: Maybe<SchemaEntitiesGroupMap>,
    prettify: boolean,
    docOptions: Maybe<ConfigDocOptions & { deprecated: TypeDeprecatedOption }>,
  ) {
    this.printer = printer;
    this.group = group;
    this.outputDir = outputDir;
    this.baseURL = baseURL;
    this.prettify = prettify;
    this.options = docOptions;
  }

  async generateCategoryMetafile(
    category: string,
    dirPath: string,
    sidebarPosition: number = SidebarPosition.FIRST,
    styleClass?: string,
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
    await saveFile(
      filePath,
      `label: ${label}\nposition: ${sidebarPosition}\n${className}link: ${link}\n`,
    );
  }

  async generateCategoryMetafileType(
    type: unknown,
    name: string,
    rootTypeName: SchemaEntity,
  ): Promise<string> {
    let dirPath = this.outputDir;

    if (
      this.options &&
      this.options.deprecated === "group" &&
      isDeprecated(type)
    ) {
      dirPath = join(dirPath, slugify("deprecated"));
      await this.generateCategoryMetafile(
        "deprecated",
        dirPath,
        SidebarPosition.LAST,
        "deprecated",
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

    return Promise.all(
      Object.keys(type)
        .map(async (name) => {
          const dirPath = await this.generateCategoryMetafileType(
            (type as Record<string, unknown>)[name],
            name,
            rootTypeName,
          );

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

    const fileName = slugify(name);
    const filePath = join(normalize(dirPath), `${fileName}.mdx`);

    let content: MDXString;
    try {
      content = this.printer.printType(fileName, type, this.options);
      if (typeof content !== "string") {
        return undefined;
      }
    } catch (error) {
      log(`An error occurred while processing "${type}"`, LogLevel.warn);
      return undefined;
    }

    await saveFile(
      filePath,
      content,
      this.prettify ? prettifyMarkdown : undefined,
    );

    const pagePath = relative(this.outputDir, filePath);

    const page = PageRegex.exec(pagePath);

    if (!page?.groups) {
      log(
        `An error occurred while processing file ${filePath} for type "${type}"`,
        LogLevel.warn,
      );
      return undefined;
    }

    const slug = pathUrl.join(page.groups.category, page.groups.pageId);

    return {
      category: startCase(page.groups.category),
      slug: slug,
    } as Category;
  }

  async renderSidebar(): Promise<string> {
    const sidebar = {
      schemaSidebar: [
        {
          type: "autogenerated",
          dirName: this.baseURL,
        },
      ],
    };

    const jsonSidebar = `
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

module.exports = ${JSON.stringify(sidebar, null, 2)};
`;

    const filePath = join(this.outputDir, SIDEBAR);
    await saveFile(
      filePath,
      jsonSidebar,
      this.prettify ? prettifyJavascript : undefined,
    );

    return filePath;
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
