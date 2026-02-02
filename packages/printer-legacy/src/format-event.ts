import { FormatEvent, getEvents } from "@graphql-markdown/core";

/**
 * Generic format event emitter.
 *
 * @param eventName - The format event name to emit
 * @param data - The data object for the event
 * @param formatter - The formatter function that processes the data
 * @returns The formatted result
 */

export const emitFormatEvent = async <U extends Record<string, unknown>, V>(
  eventName: string,
  data: U,
  formatter: (data: U) => V,
): Promise<V> => {
  const event = new FormatEvent<U, V>(data, {
    defaultAction: async (): Promise<void> => {
      // Only run default formatter if no handler set a result
      event.result ??= formatter(data);
    },
  });
  await getEvents().emitAsync(eventName, event);
  return event.result as V;
};
