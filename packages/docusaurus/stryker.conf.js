// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */

const config = require("@graphql-markdown/tools-config").stryker;

module.exports = { ...config, dashboard: { module: "docusaurus" } };
