// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */

import config from "@graphql-markdown/tooling-config/stryker";

export default {
  ...config,
  thresholds: { high: 80, low: 65, break: 60 },
};
