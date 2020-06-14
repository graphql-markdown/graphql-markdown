const generateDocFromSchema = require('./lib/generator');
const path = require('path');

const DEFAULT_OPTIONS = {
    schema: './schema.graphl',
    rootPath: './docs',
    baseURL: 'schema',
    homepage: path.join(__dirname, '../assets/', 'generated.md'),
};

module.exports = function pluginGraphQLDocGenerator(context, opts) {
    // Merge defaults with user-defined options.
    const options = { ...DEFAULT_OPTIONS, ...opts };
    return {
        name: 'docusaurus-graphql-doc-generator',

        extendCli(cli) {
            cli.command('graphql-to-doc')
                .arguments('[schema] [rootPath] [baseURL] [homepage]')
                .description('Generate GraphQL Schema Documentation')
                .action(async (schema, rootPath, baseURL, homepage) => {
                    baseURL = baseURL || options.baseURL;
                    schema = schema || options.schema;
                    rootPath = path.join(rootPath || options.rootPath, baseURL);
                    homepage = homepage || options.homepage;
                    await generateDocFromSchema(baseURL, schema, rootPath, homepage);
                });
        },
    };
};
