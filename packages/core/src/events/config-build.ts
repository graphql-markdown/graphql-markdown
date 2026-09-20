/**
 * Config build event class.
 *
 * @packageDocumentation
 */

import type { Options } from "@graphql-markdown/types";
import type { CancellableEventOptions } from "@graphql-markdown/utils";
import { DataEvent } from "@graphql-markdown/utils";

/**
 * Event emitted after the final configuration has been resolved.
 *
 * @category Events
 */
export class ConfigBuildEvent extends DataEvent<{
  config: Options;
}> {
  constructor(
    data: {
      config: Options;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
