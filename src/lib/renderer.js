const path = require("path");

const { toSlug, startCase } = require("../utils/string");
const { pathUrl } = require("../utils/url");
const {
  saveFile,
  emptyDir,
  ensureDir,
  copyFile,
  readFile,
} = require("../utils/fs");

const { prettifyJavascript } = require("./prettier");

const SIDEBAR = "sidebar-schema.js";
const HOMEPAGE_ID = "schema";

module.exports = class Renderer {
  constructor(printer, outputDir, baseURL, categoryInfo) {
    this.categoryInfo = categoryInfo;
    this.outputDir = outputDir;
    this.baseURL = baseURL;
    this.printer = printer;
  }

  async emptyOutputDir() {
    await emptyDir(this.outputDir);
  }

  async renderRootTypes(typeName, type) {
    if (typeof type === "undefined" || type === null) {
      return undefined;
    }

    const slug = toSlug(typeName);
    const dirPath = path.join(this.outputDir, slug);
    if (Array.isArray(type)) {
      type = type.reduce(function (r, o) {
        if (o && o.name) r[o.name] = o;
        return r;
      }, {});
    }

    await ensureDir(dirPath);

    const filePath = path.join(dirPath, "_category_.yml");
    await saveFile(filePath, `label: '${startCase(typeName)}'\n`);

    return Promise.all(
      Object.keys(type).map(async (name) => {
        return this.renderTypeEntities(
          path.join(
            this.outputDir,
            this.categoryInfo && this.categoryInfo.groupByDirective
              ? this.categoryInfo.group[name]
              : "",
            slug,
          ),
          name,
          type[name],
        );
      }),
    );
  }

  async renderTypeEntities(dirPath, name, type) {
    if (typeof type === "undefined" || type === null) {
      return undefined;
    }

    const fileName = toSlug(name);
    const filePath = path.join(path.normalize(dirPath), `${fileName}.mdx`);

    const content = this.printer.printType(fileName, type);
    await saveFile(filePath, content);

    const pagePath = path.relative(this.outputDir, filePath);
    const page = pagePath.match(
      /(?<category>[A-z0-9-_]+)[\\/]+(?<pageId>[A-z0-9-_]+).mdx?$/,
    );
    const slug = pathUrl.join(page.groups.category, page.groups.pageId);

    return { category: startCase(page.groups.category), slug: slug };
  }

  async renderSidebar() {
    const { schemaSidebar } = require("../../assets/sidebar.json");
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

    const jsonSidebar = JSON.stringify(sidebar, null, 2);
    const content = prettifyJavascript(`module.exports = ${jsonSidebar};`);

    const filePath = path.join(this.outputDir, SIDEBAR);
    await saveFile(filePath, content);

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
