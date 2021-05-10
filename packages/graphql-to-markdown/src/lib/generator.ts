import * as chalk from "chalk";

import {
  Renderer,
  Printer,
  getSchemaMap,
  loadSchema,
  GraphQLFileLoader,
  UrlLoader,
  JsonFileLoader,
  checkSchemaChanges,
  saveSchemaHash,
  saveSchemaFile,
  round,
} from ".";

const time = process.hrtime();

export async function generateDocFromSchema(
  baseURL: string,
  schemaLocation: string,
  outputDir: string,
  linkRoot: string,
  diffMethod: string,
  tmpDir: string,
) {
  return Promise.resolve(
    loadSchema(schemaLocation, {
      loaders: [new GraphQLFileLoader(), new UrlLoader(), new JsonFileLoader()],
    }),
  ).then(async (schema) => {
    if (await checkSchemaChanges(schema, tmpDir, diffMethod)) {
      let pages: any[] = [];
      const r: any = new Renderer(
        new Printer(schema, baseURL, linkRoot),
        outputDir,
        baseURL,
      );
      const rootTypes: any = getSchemaMap(schema);
      Promise.all(
        Object.keys(rootTypes).map((typeName) =>
          r.renderRootTypes(typeName, rootTypes[typeName]),
        ),
      )
        .then((p) => {
          pages = p.reduce((r, i) => [].concat(r, i), []);
        })
        .then(async () => await r.renderSidebar(pages))
        .then((sidebarPath) => {
          const [sec, msec] = process.hrtime(time);
          const duration = round(sec + msec / 1000000000, 3);
          console.info(
            chalk.green(
              `Documentation successfully generated in "${outputDir}" with base URL "${baseURL}".`,
            ),
          );
          console.log(
            chalk.blue(
              `${pages.length} pages generated in ${duration}s from schema "${schemaLocation}".`,
            ),
          );
          console.info(
            chalk.blue.bold(
              `Remember to update your Docusaurus site's sidebars with "${sidebarPath}".`,
            ),
          );
        });
    } else {
      console.info(
        chalk.blue(`No changes detected in schema "${schemaLocation}".`),
      );
    }
    // create references for checkSchemaChanges
    await saveSchemaHash(schema, tmpDir);
    await saveSchemaFile(schema, tmpDir);
  });
}
