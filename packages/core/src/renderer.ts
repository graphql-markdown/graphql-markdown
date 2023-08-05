import type {
  Category,
  ConfigDocOptions,
  Printer,
  PrintTypeOptions,
  SchemaEntitiesGroupMap,
  SchemaEntity,
  SidebarsConfig,
  TypeDeprecatedOption,
} from "@graphql-markdown/types";

import { basename, join, relative, normalize } from "node:path";

import {
  copyFile,
  ensureDir,
  fileExists,
  isDeprecated,
  Logger,
  pathUrl,
  prettifyJavascript,
  prettifyMarkdown,
  readFile,
  saveFile,
  startCase,
  toSlug,
} from "@graphql-markdown/utils";

import { ASSETS_LOCATION } from "./config";
const logger = Logger.getInstance();

const SIDEBAR = "sidebar-schema.js" as const;
const HOMEPAGE_ID = "schema" as const;
const CATEGORY_YAML = "_category_.yml" as const;

enum SIDEBAR_POSITION {
  FIRST = 1,
  LAST = 999,
}

export class Renderer {
  private printer: Printer;
  group: SchemaEntitiesGroupMap | undefined;
  outputDir: string;
  baseURL: string;
  prettify: boolean;
  options: ConfigDocOptions & { deprecated: TypeDeprecatedOption };

  constructor(
    printer: Printer,
    outputDir: string,
    baseURL: string,
    group: SchemaEntitiesGroupMap | undefined,
    prettify: boolean,
    docOptions: ConfigDocOptions & { deprecated: TypeDeprecatedOption },
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
    sidebarPosition: number = SIDEBAR_POSITION.FIRST,
    styleClass?: string,
  ) {
    const filePath = join(dirPath, CATEGORY_YAML);

    if (await fileExists(filePath)) {
      return;
    }

    await ensureDir(dirPath);

    const label = startCase(category);
    const link =
      this.options.index !== true
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

    if (this.options.deprecated === "group" && isDeprecated(type)) {
      dirPath = join(dirPath, toSlug("deprecated"));
      await this.generateCategoryMetafile(
        "deprecated",
        dirPath,
        SIDEBAR_POSITION.LAST,
        "deprecated",
      );
    }

    if (
      typeof this.group !== "undefined" &&
      rootTypeName in this.group &&
      name in this.group[rootTypeName]!
    ) {
      dirPath = join(dirPath, toSlug(this.group[rootTypeName]![name] ?? ""));
      await this.generateCategoryMetafile(
        this.group[rootTypeName]![name] ?? "",
        dirPath,
      );
    }

    dirPath = join(dirPath, toSlug(rootTypeName));
    await this.generateCategoryMetafile(rootTypeName, dirPath);

    return dirPath;
  }

  async renderRootTypes(rootTypeName: SchemaEntity, type: unknown) {
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
        .filter((res) => typeof res !== "undefined"),
    );
  }

  async renderTypeEntities(
    dirPath: string,
    name: string,
    type: unknown,
  ): Promise<Category | undefined> {
    const PageRegex =
      /(?<category>[A-Za-z0-9-]+)[\\/]+(?<pageId>[A-Za-z0-9-]+).mdx?$/;

    const fileName = toSlug(name);
    const filePath = join(normalize(dirPath), `${fileName}.mdx`);

    let content;
    try {
      content = this.printer.printType(
        fileName,
        type,
        this.options as unknown as PrintTypeOptions,
      );
      if (typeof content === "undefined") {
        return undefined;
      }
    } catch (error) {
      logger.warn(`An error occurred while processing "${type}"`);
      return undefined;
    }

    await saveFile(
      filePath,
      content,
      this.prettify ? prettifyMarkdown : undefined,
    );

    const pagePath = relative(this.outputDir, filePath);

    const page = PageRegex.exec(pagePath);

    if (typeof page === "undefined" || typeof page?.groups === "undefined") {
      logger.warn(
        `An error occurred while processing file $filePath for type "${type}"`,
      );
      return undefined;
    }

    const slug = pathUrl.join(page.groups.category ?? "", page.groups.pageId);

    return {
      category: startCase(page.groups.category),
      slug: slug,
    } as Category;
  }

  async renderSidebar(): Promise<string> {
    const { schemaSidebar }: SidebarsConfig = await import(
      `${ASSETS_LOCATION}/sidebar.json`
    );

    type SidebarItem = { type: string; id: string; dirName: string };

    const sidebar = {
      schemaSidebar: (schemaSidebar as unknown as SidebarItem[]).map(
        (entry) => {
          switch (entry.type) {
            case "doc":
              entry.id = pathUrl.join(this.baseURL, HOMEPAGE_ID);
              break;
            case "autogenerated":
              entry.dirName = this.baseURL;
              break;
            default: //do nothing
          }
          return entry;
        },
      ),
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

    return relative("./", filePath);
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
