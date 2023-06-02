/**
 * Object functions
 */

function hasProperty(obj, prop) {
  return (
    typeof obj === "object" &&
    (!!(obj && obj[prop]) ||
      (obj instanceof Object &&
        Object.prototype.hasOwnProperty.call(obj, prop)))
  );
}

function hasMethod(obj, prop) {
  return hasProperty(obj, prop) && typeof obj[prop] === "function";
}

function isEmpty(obj) {
  return typeof obj !== "object" || !Object.keys(obj).length;
}

// get the specified property or nested property of an object
function getObjPath(path, obj, fallback = "") {
  if (typeof obj !== "object" || typeof path !== "string") {
    return fallback;
  }

  return path.split(".").reduce((res, key) => res[key] || fallback, obj);
}

module.exports = {
  getObjPath,
  hasMethod,
  hasProperty,
  isEmpty,
};
