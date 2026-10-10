const BARE_KEY = /^[A-Za-z_][\w-]*$/;

const INDENT = "  ";

const quoteSingle = (text) => `'${text.replace(/'/g, "''")}'`;

const isPlainObject = (value) => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const describeType = (value) => {
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
};

const formatKey = (key) => (BARE_KEY.test(key) ? key : quoteSingle(key));

const formatScalar = (value, path) => {
  if (value === null) {
    return "null";
  }
  switch (typeof value) {
    case "string":
      return quoteSingle(value);
    case "boolean":
      return String(value);
    case "number":
      if (!Number.isFinite(value)) {
        throw new TypeError(
          `Unsupported value at ${path}: non-finite number ${value}`,
        );
      }
      return String(value);
    default:
      throw new TypeError(
        `Unsupported value at ${path}: ${describeType(value)}`,
      );
  }
};

const serializeObject = (object, depth, parentPath, lines) => {
  const pad = INDENT.repeat(depth);
  for (const key of Object.keys(object)) {
    const value = object[key];
    if (value === undefined) {
      continue;
    }
    const path = parentPath ? `${parentPath}.${key}` : key;
    const head = `${pad}${formatKey(key)}`;
    if (isPlainObject(value)) {
      if (Object.keys(value).length === 0) {
        lines.push(`${head}: {}`);
      } else {
        lines.push(`${head}:`);
        serializeObject(value, depth + 1, path, lines);
      }
    } else {
      lines.push(`${head}: ${formatScalar(value, path)}`);
    }
  }
};

/**
 * Minimal YAML serializer for `.graphqlrc` files.
 *
 * Exists so that `npm create` does not need a YAML dependency: the generated
 * config only uses plain objects, strings, booleans, finite numbers and null.
 * Strings are always single-quoted, `undefined` values are omitted, and arrays
 * or other unsupported types throw a TypeError naming the offending key path.
 *
 * @param {Record<string, unknown>} value Plain object to serialize.
 * @returns {string} YAML text with 2-space indentation and a single trailing newline.
 * @throws {TypeError} When the top level is not an object or a nested value is unsupported.
 */
export const toYaml = (value) => {
  if (!isPlainObject(value)) {
    throw new TypeError(
      `toYaml expects a plain object at the top level, received ${describeType(value)}`,
    );
  }
  const lines = [];
  serializeObject(value, 0, "", lines);
  if (lines.length === 0) {
    return "{}\n";
  }
  return `${lines.join("\n")}\n`;
};
