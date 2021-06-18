const chalk = require("chalk");
const { getSchemaMap } = require("./graphql");
const Renderer = require("./renderer");
const { round } = require("./utils");
const {
  checkSchemaChanges,
  saveSchemaHash,
  saveSchemaFile,
} = require("./diff");

const time = process.hrtime();

module.exports = async function generateDocFromSchema(
  baseURL,
  schemaLocation,
  outputDir,
  linkRoot,
  homepageLocation,
  diffMethod,
  tmpDir
) {
  if (await checkSchemaChanges(schema, tmpDir, diffMethod)) {
    let pages = [];
    const r = new Renderer(
      new Printer(schema, baseURL, linkRoot),
      outputDir,
      baseURL
    );
    const rootTypes = getSchemaMap(schema);
    Promise.all(
      Object.keys(rootTypes).map(async (typeName) => {
        return r.renderRootTypes(typeName, rootTypes[typeName]);
      })
    )
      .then((p) => {
        pages = p.reduce((r, i) => {
          return [].concat(r, i);
        }, []);
      })
      .then(async () => {
        return await r.renderHomepage(homepageLocation);
      })
      .then(async () => {
        return await r.renderSidebar(pages);
      })
      .then((sidebarPath) => {
        const [sec, msec] = process.hrtime(time);
        const duration = round(sec + msec / 1e9, 3);
        console.info(
          chalk.green(
            `Documentation successfully generated in "${outputDir}" with base URL "${baseURL}".`
          )
        );
        console.log(
          chalk.blue(
            `${pages.length} pages generated in ${duration}s from schema "${schemaLocation}".`
          )
        );
        console.info(
          chalk.blue.bold(
            `Remember to update your Docusaurus site's sidebars with "${sidebarPath}".`
          )
        );
      });
  } else {
    console.info(
      chalk.blue(`No changes detected in schema "${schemaLocation}".`)
    );
  }
  // create references for checkSchemaChanges
  await saveSchemaHash(schema, tmpDir);
  await saveSchemaFile(schema, tmpDir);
};
