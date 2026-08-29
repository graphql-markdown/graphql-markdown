// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */

import config from "@graphql-markdown/tooling-config/stryker";

export default {
  ...config,
  // The shared config keeps `assets` out of the sandbox, but the homepage
  // test reads `assets/generated.md` to assert the inlined template has not
  // drifted from it. Re-include that one file so the sandbox can serve it.
  ignorePatterns: [...(config.ignorePatterns ?? []), "!assets/generated.md"],
};
