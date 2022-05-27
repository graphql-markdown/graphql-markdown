/**
 * Array functions
 */

function toArray(param) {
  if (param && typeof param === "object")
    return Object.keys(param).map((key) => param[key]);
  return undefined;
}

function convertArrayToObject(typeArray) {
  return typeArray.reduce(function (r, o) {
    if (o && o.name) r[o.name] = o;
    return r;
  }, {});
}

module.exports = { toArray, convertArrayToObject };
