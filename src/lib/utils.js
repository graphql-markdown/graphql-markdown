const slugify = require('slugify');
const { kebabCase } = require('lodash');

const { startCase } = require('lodash');

function toSlug(str) {
    return slugify(kebabCase(str));
}

function toArray(param) {
    if (param) return Object.keys(param).map((key) => param[key]);
    return undefined;
}

module.exports = { startCase, toSlug, toArray };
