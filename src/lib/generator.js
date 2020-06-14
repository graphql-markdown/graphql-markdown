const { getSchemaMap, loadSchema, GraphQLFileLoader, UrlLoader, JsonFileLoader } = require('./graphql');
const Renderer = require('./renderer');
const Printer = require('./printer');
const chalk = require('chalk');
const { round } = require('lodash');

const time = process.hrtime();

module.exports = async function generateDocFromSchema(baseURL, schemaLocation, outputDir, homepageLocation) {
    let r = undefined;
    let pages = [];
    let schema = undefined;
    let rootTypes = [];
    return Promise.resolve(
        loadSchema(schemaLocation, {
            loaders: [new GraphQLFileLoader(), new UrlLoader(), new JsonFileLoader()],
        }),
    )
        .then((s) => (schema = s))
        .then(() => (r = new Renderer(new Printer(schema, baseURL), outputDir, baseURL)))
        .then(() => (rootTypes = getSchemaMap(schema)))
        .then(() =>
            Promise.all(Object.keys(rootTypes).map((typeName) => r.renderRootTypes(typeName, rootTypes[typeName]))),
        )
        .then((p) => {
            pages = p.reduce((r, i) => [].concat(r, i), []);
        })
        .then(() => r.renderHomepage(homepageLocation))
        .then(() => r.renderSidebar(pages))
        .then((sidebarPath) => {
            const [sec, msec] = process.hrtime(time);
            const duration = round(sec + msec / 1000000000, 3);
            console.info(
                chalk.green(`Documentation succesfully generated in "${outputDir}" with base URL "${baseURL}"`),
            );
            console.log(chalk.blue(`${pages.length} pages generated in ${duration}s from schema "${schemaLocation}"`));
            console.info(chalk.blue.bold(`Remember to update your Docusaurus site's sidebars with "${sidebarPath}"`));
        });
};
