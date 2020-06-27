const chalk = require('chalk');
const { getSchemaMap, loadSchema, GraphQLFileLoader, UrlLoader, JsonFileLoader } = require('./graphql');
const Renderer = require('./renderer');
const Printer = require('./printer');
const { round } = require('./utils');
const { checkSchemaChanges, saveSchemaHash, saveSchemaFile } = require('./diff');
const path = require('path');

const time = process.hrtime();

module.exports = async function generateDocFromSchema(
    baseURL,
    schemaLocation,
    outputDir,
    homepageLocation,
    diffMethod,
) {
    return Promise.resolve(
        loadSchema(schemaLocation, {
            loaders: [new GraphQLFileLoader(), new UrlLoader(), new JsonFileLoader()],
        }),
    ).then(async (schema) => {
        if (await checkSchemaChanges(schema, outputDir, diffMethod)) {
            let pages = [];
            const r = new Renderer(new Printer(schema, baseURL), outputDir, baseURL);
            const rootTypes = getSchemaMap(schema);
            Promise.all(Object.keys(rootTypes).map((typeName) => r.renderRootTypes(typeName, rootTypes[typeName])))
                .then((p) => {
                    pages = p.reduce((r, i) => [].concat(r, i), []);
                })
                .then(async () => await r.renderHomepage(homepageLocation))
                .then(async () => await r.renderSidebar(pages))
                .then((sidebarPath) => {
                    const [sec, msec] = process.hrtime(time);
                    const duration = round(sec + msec / 1000000000, 3);
                    console.info(
                        chalk.green(
                            `Documentation succesfully generated in "${outputDir}" with base URL "${baseURL}".`,
                        ),
                    );
                    console.log(
                        chalk.blue(`${pages.length} pages generated in ${duration}s from schema "${schemaLocation}".`),
                    );
                    console.info(
                        chalk.blue.bold(`Remember to update your Docusaurus site's sidebars with "${sidebarPath}".`),
                    );
                });
        } else {
            console.info(chalk.blue(`No changes detected in schema "${schemaLocation}".`));
        }
        // create references for checkSchemaChanges
        await saveSchemaHash(schema, outputDir);
        await saveSchemaFile(schema, outputDir);
    });
};
