import path from "node:path";

/**
 * Normalize an output folder: forward slashes, no leading "./", no trailing "/".
 * @param {string} output
 * @returns {string}
 */
export function normalizeOutput(output) {
  const normalized = output.replaceAll("\\", "/").replace(/^\.\//, "");
  let end = normalized.length;
  while (end > 0 && normalized[end - 1] === "/") {
    end--;
  }
  return normalized.slice(0, end);
}

/**
 * Join URL segments into a route with a leading "/" and no trailing "/" (except "/").
 * @param {...string} parts
 * @returns {string}
 */
export function joinRoute(...parts) {
  const joined = `/${parts.join("/")}`.replace(/\/+/g, "/");
  return joined.length > 1 ? joined.replace(/\/$/, "") : joined;
}

/**
 * Split an output folder into the content root path and the base URL segment.
 * When the output IS the content root, the baseURL is "." because a non-"."
 * value would add an extra URL segment.
 * @param {{ contentRoot?: string }} descriptor
 * @param {string} output
 * @returns {{ rootPath: string, baseURL: string }}
 */
function splitOutput(descriptor, output) {
  const out = normalizeOutput(output);
  if (descriptor.contentRoot && out === descriptor.contentRoot) {
    return { rootPath: out, baseURL: "." };
  }
  return {
    rootPath: path.posix.dirname(out),
    baseURL: path.posix.basename(out),
  };
}

function getOutputRest(root, output) {
  if (root === ".") {
    return `/${output}`;
  }
  if (output === root) {
    return "";
  }
  if (!output.startsWith(`${root}/`)) {
    return undefined;
  }
  return output.slice(root.length);
}

function getOutputRoute(outputRoute, baseURL) {
  return baseURL === "."
    ? outputRoute
    : joinRoute(path.posix.dirname(outputRoute));
}

/**
 * Suggest a link root for router/absolute link frameworks, or undefined.
 * @param {{ links?: string, contentRoot?: string, contentRoute?: string }} descriptor
 * @param {string} output
 * @param {{ siteBase?: string }} [options]
 * @returns {string | undefined}
 */
function suggestLinkRoot(descriptor, output, { siteBase = "/" } = {}) {
  if (descriptor.links !== "router" && descriptor.links !== "absolute") {
    return undefined;
  }
  if (!descriptor.contentRoot) {
    return undefined;
  }
  const out = normalizeOutput(output);
  const rest = getOutputRest(descriptor.contentRoot, out);
  if (rest === undefined) {
    return undefined;
  }
  const outputRoute = joinRoute(descriptor.contentRoute ?? "/", rest);
  const { baseURL } = splitOutput(descriptor, out);
  const route = getOutputRoute(outputRoute, baseURL);
  return descriptor.links === "absolute" ? joinRoute(siteBase, route) : route;
}

/**
 * Resolve rootPath, baseURL and linkRoot for an output folder in one call.
 * @param {object} descriptor
 * @param {string} output
 * @param {{ siteBase?: string }} [options]
 * @returns {{ rootPath: string, baseURL: string, linkRoot: string | undefined }}
 */
export function resolveLinkWiring(descriptor, output, options) {
  return {
    ...splitOutput(descriptor, output),
    linkRoot: suggestLinkRoot(descriptor, output, options),
  };
}
