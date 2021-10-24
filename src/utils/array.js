/**
 * Array functions
 */
function toArray(param) {
  if (param && typeof param === "object")
    return Object.keys(param).map((key) => param[key]);
  return undefined;
}

module.exports = { toArray };
