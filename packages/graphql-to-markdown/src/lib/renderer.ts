import * as path from "path";
import * as fs from "fs-extra";
import { pull } from "lodash";

import { toSlug, startCase, hasOwnProperty } from "./utils";
import { prettifyJavascript } from "./prettier";
import { Printer } from "./printer";

const SIDEBAR = "sidebar-schema.js";
const HOMEPAGE_ID = "schema";

export class Renderer {
  constructor(readonly printer: Printer, readonly outputDir: string, readonly baseURL: string) {
    this.emptyOutputDir();
  }

  emptyOutputDir() {
    fs.emptyDirSync(this.outputDir);
  }

  async renderRootTypes(name: string, type: any) {
    let pages: ({ category: string; slug: string } | undefined)[] = [];
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
        Object.keys(type).map((name: string) =>
          this.renderTypeEntities(dirPath, name, type[name]),
        ),
      ).then((p) => {
        pages = [...p];
      });
    }
    return pages;
  }

  async renderTypeEntities(dirPath: string, name: string, type: any) {
    if (type) {
      const fileName = toSlug(name);
      const filePath = path.join(dirPath, `${fileName}.mdx`);
      const content = this.printer.printType(fileName, type);
      await fs.outputFile(filePath, content, "utf8");
      const page: any = path
        .relative(this.outputDir, filePath)
        .match(
          /(?<category>[A-z][A-z0-9-]*)\/(?<pageId>[A-z][A-z0-9-]*).mdx?$/,
        );
      const slug = path.join(page.groups.category, page.groups.pageId);
      return { category: startCase(page.groups.category), slug: slug };
    }
  }

  async renderSidebar(pages: any[]) {
    const filePath = path.join(this.outputDir, SIDEBAR);
    const content = prettifyJavascript(`module.exports = {
          schemaSidebar:
          ${JSON.stringify(this.generateSidebar(pages))}
        };`);
    fs.outputFileSync(filePath, content, "utf8");
    return path.relative("./", filePath);
  }

  generateSidebar(pages: any[]) {
    let graphqlSidebar = [
      { type: "doc", id: path.join(this.baseURL, HOMEPAGE_ID) },
    ];
    pages.map((page: { category: any; slug: any }) => {
      const category: any = graphqlSidebar.find(
        (entry: any) => "label" in entry && page.category == entry.label,
      );
      const items = hasOwnProperty(category, "items") ? category?.items : [];
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
}
