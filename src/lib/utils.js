const slugify = require('slugify');
const { kebabCase, startCase, round } = require('lodash');

function toSlug(str) {
    return slugify(kebabCase(str));
}

function toArray(param) {
    if (param) return Object.keys(param).map((key) => param[key]);
    return undefined;
}

module.exports = { round, startCase, toSlug, toArray };
