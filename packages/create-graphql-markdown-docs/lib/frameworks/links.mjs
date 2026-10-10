import path from "node:path";

/**
 * Normalize an output folder: forward slashes, no leading "./", no trailing "/".
 * @param {string} output
 * @returns {string}
 */
export function normalizeOutput(output) {
  return output.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "");
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
export function splitOutput(descriptor, output) {
  const out = normalizeOutput(output);
  if (descriptor.contentRoot && out === descriptor.contentRoot) {
    return { rootPath: out, baseURL: "." };
  }
  return {
    rootPath: path.posix.dirname(out),
    baseURL: path.posix.basename(out),
  };
}

/**
 * Suggest a link root for router/absolute link frameworks, or undefined.
 * @param {{ links?: string, contentRoot?: string, contentRoute?: string }} descriptor
 * @param {string} output
 * @param {{ siteBase?: string }} [options]
 * @returns {string | undefined}
 */
export function suggestLinkRoot(descriptor, output, { siteBase = "/" } = {}) {
  if (descriptor.links !== "router" && descriptor.links !== "absolute") {
    return undefined;
  }
  if (!descriptor.contentRoot) {
    return undefined;
  }
  const out = normalizeOutput(output);
  const root = descriptor.contentRoot;
  let rest;
  if (root === ".") {
    rest = `/${out}`;
  } else if (out === root) {
    rest = "";
  } else if (out.startsWith(`${root}/`)) {
    rest = out.slice(root.length);
  } else {
    return undefined;
  }
  const outputRoute = joinRoute(descriptor.contentRoute ?? "/", rest);
  const { baseURL } = splitOutput(descriptor, out);
  const route =
    baseURL === "." ? outputRoute : joinRoute(path.posix.dirname(outputRoute));
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
