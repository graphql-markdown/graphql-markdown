/**
 * Object functions
 */

function hasProperty(obj, prop) {
  return (
    !!(obj && obj[prop]) ||
    (obj instanceof Object && Object.prototype.hasOwnProperty.call(obj, prop))
  );
}

function hasMethod(obj, prop) {
  return hasProperty(obj, prop) && typeof obj[prop] === "function";
}

function isEmpty(obj) {
  return typeof obj !== "object" || Object.keys(obj).length === 0;
}

module.exports = { hasMethod, hasProperty, isEmpty };
