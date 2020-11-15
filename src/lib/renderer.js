const fs = require("fs-extra");
const path = require("path");
const { pull } = require("lodash");
const moment = require("moment");
const { toSlug, startCase, hasProperty } = require("./utils");
const { prettifyJavascript } = require("./prettier");

const SIDEBAR = "sidebar-schema.js";
const HOMEPAGE_ID = "schema";

module.exports = class Renderer {
  constructor(printer, outputDir, baseURL) {
    this.outputDir = outputDir;
    this.baseURL = baseURL;
    this.p = printer;
    this.emptyOutputDir();
  }

  emptyOutputDir() {
    fs.emptyDirSync(this.outputDir);
  }

  async renderRootTypes(name, type) {
    let pages = [];
    if (type) {
      const slug = toSlug(name);
      const dirPath = path.join(this.outputDir, slug);
      if (Array.isArray(type)) {
        type = type.reduce(function (r, o) {
          if (o && o.name) r[o.name] = o;
          return r;
        }, {});
      }

      fs.ensureDir(dirPath);

      await Promise.all(
        Object.keys(type).map((name) =>
          this.renderTypeEntities(dirPath, name, type[name]),
        ),
      ).then((p) => {
        pages = [...p];
      });
    }
    return pages;
  }

  async renderTypeEntities(dirPath, name, type) {
    if (type) {
      const fileName = toSlug(name);
      const filePath = path.join(dirPath, `${fileName}.mdx`);
      const content = this.p.printType(fileName, type);
      await fs.outputFile(filePath, content, "utf8");
      const page = path
        .relative(this.outputDir, filePath)
        .match(
          /(?<category>[A-z][A-z0-9-]*)\/(?<pageId>[A-z][A-z0-9-]*).mdx?$/,
        );
      const slug = path.join(page.groups.category, page.groups.pageId);
      return { category: startCase(page.groups.category), slug: slug };
    }
  }

  async renderSidebar(pages) {
    const filePath = path.join(this.outputDir, SIDEBAR);
    const content = prettifyJavascript(`module.exports = {
          schemaSidebar:
          ${JSON.stringify(this.generateSidebar(pages))}
        };`);
    fs.outputFileSync(filePath, content, "utf8");
    return path.relative("./", filePath);
  }

  generateSidebar(pages) {
    let graphqlSidebar = [
      { type: "doc", id: path.join(this.baseURL, HOMEPAGE_ID) },
    ];
    pages.map((page) => {
      const category = graphqlSidebar.find(
        (entry) => "label" in entry && page.category == entry.label,
      );
      const items = hasProperty(category, "items") ? category.items : [];
      const slug = path.join(this.baseURL, page.slug);
      graphqlSidebar = [
        ...pull(graphqlSidebar, category),
        {
          type: "category",
          label: page.category,
          items: [...items, slug].sort(),
        },
      ];
    });
    return graphqlSidebar;
  }

  async renderHomepage(homepageLocation) {
    const homePage = path.basename(homepageLocation);
    const destLocation = path.join(this.outputDir, homePage);
    fs.copySync(homepageLocation, destLocation);
    const data = fs
      .readFileSync(destLocation, "utf8")
      .replace(
        /##generated-date-time##/gm,
        moment().format("MMMM DD, YYYY [at] h:mm:ss A"),
      );
    await fs.outputFile(destLocation, data, "utf8");
  }
};
