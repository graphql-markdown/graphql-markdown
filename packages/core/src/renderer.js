const path = require("path");

const {
  object: { hasProperty },
  string: { toSlug, startCase },
  url: { pathUrl },
  prettier: { prettifyJavascript, prettifyMarkdown },
  fs: { saveFile, ensureDir, copyFile, readFile, fileExists },
  graphql: { isDeprecated },
} = require("@graphql-markdown/utils");

const { ASSETS_LOCATION } = require("./config");
const { schemaSidebar } = require(`${ASSETS_LOCATION}/sidebar.json`);

const SIDEBAR = "sidebar-schema.js";
const HOMEPAGE_ID = "schema";
const CATEGORY_YAML = "_category_.yml";
const SIDEBAR_POSITION = {
  FIRST: 1,
  LAST: 999,
};

module.exports = class Renderer {
  constructor(printer, outputDir, baseURL, group, prettify, docOptions) {
    this.group = group;
    this.outputDir = outputDir;
    this.baseURL = baseURL;
    this.printer = printer;
    this.prettify = prettify;
    this.options = docOptions;
  }

  async generateCategoryMetafile(
    category,
    dirPath,
    sidebarPosition = SIDEBAR_POSITION.FIRST,
    styleClass,
  ) {
    const filePath = path.join(dirPath, CATEGORY_YAML);

    if (await fileExists(filePath)) {
      return;
    }

    await ensureDir(dirPath);

    const label = startCase(category);
    const link =
      typeof this.options === "undefined" || !this.options.index
        ? "null"
        : `\n  type: generated-index\n  title: '${label} overview'`;
    const className =
      typeof styleClass === "string" ? `className: ${styleClass}\n` : "";
    await saveFile(
      filePath,
      `label: ${label}\nposition: ${sidebarPosition}\n${className}link: ${link}\n`,
    );
  }

  async generateCategoryMetafileType(type, name, rootTypeName) {
    let dirPath = this.outputDir;

    if (
      hasProperty(this.options, "deprecated") &&
      this.options.deprecated === "group" &&
      isDeprecated(type)
    ) {
      dirPath = path.join(dirPath, toSlug("deprecated"));
      await this.generateCategoryMetafile(
        "deprecated",
        dirPath,
        SIDEBAR_POSITION.LAST,
        "deprecated",
      );
    }

    if (hasProperty(this.group, name)) {
      dirPath = path.join(dirPath, toSlug(this.group[name]));
      await this.generateCategoryMetafile(this.group[name], dirPath);
    }

    dirPath = path.join(dirPath, toSlug(rootTypeName));
    await this.generateCategoryMetafile(rootTypeName, dirPath);

    return dirPath;
  }

  async renderRootTypes(rootTypeName, type) {
    if (typeof type !== "object" || type === null) {
      return undefined;
    }

    return Promise.all(
      Object.keys(type)
        .map(async (name) => {
          const dirPath = await this.generateCategoryMetafileType(
            type[name],
            name,
            rootTypeName,
          );

          return this.renderTypeEntities(dirPath, name, type[name]);
        })
        .filter((res) => typeof res !== "undefined"),
    );
  }

  async renderTypeEntities(dirPath, name, type) {
    const fileName = toSlug(name);
    const filePath = path.join(path.normalize(dirPath), `${fileName}.mdx`);

    let content;
    try {
      content = this.printer.printType(fileName, type, this.options);
      if (typeof content === "undefined") {
        return undefined;
      }
    } catch (error) {
      console.log(`An error occurred while processing "${type}"`);
      return undefined;
    }

    await saveFile(
      filePath,
      this.prettify ? prettifyMarkdown(content) : content,
    );

    const pagePath = path.relative(this.outputDir, filePath);
    const page = pagePath.match(
      /(?<category>[A-Za-z0-9-]+)[\\/]+(?<pageId>[A-Za-z0-9-]+).mdx?$/,
    );
    const slug = pathUrl.join(page.groups.category, page.groups.pageId);

    return { category: startCase(page.groups.category), slug: slug };
  }

  async renderSidebar() {
    const sidebar = {
      schemaSidebar: schemaSidebar.map((entry) => {
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
      }),
    };

    const jsonSidebar = `
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

module.exports = ${JSON.stringify(sidebar, null, 2)};
`;

    const filePath = path.join(this.outputDir, SIDEBAR);
    await saveFile(
      filePath,
      this.prettify ? prettifyJavascript(jsonSidebar) : jsonSidebar,
    );

    return path.relative("./", filePath);
  }

  async renderHomepage(homepageLocation) {
    const homePage = path.basename(homepageLocation);
    const destLocation = path.join(this.outputDir, homePage);
    const slug = pathUrl.resolve("/", this.baseURL);

    await copyFile(homepageLocation, destLocation);

    const template = await readFile(destLocation);

    const data = template
      .toString()
      .replace(/##baseURL##/gm, slug)
      .replace(/##generated-date-time##/gm, new Date().toLocaleString());
    await saveFile(destLocation, data);
  }
};
