import { EVENT_CALLBACK_MAP } from "../../src/event-map";
import { ConfigBuildEvents } from "../../src/events/config-build-events";
import { DiffEvents } from "../../src/events/diff-events";
import { GenerateIndexMetafileEvents } from "../../src/events/generate-index-metafile-events";
import { PrintTypeEvents } from "../../src/events/print-type-events";
import { RenderFilesEvents } from "../../src/events/render-files-events";
import { RenderHomepageEvents } from "../../src/events/render-homepage-events";
import { RenderRootTypesEvents } from "../../src/events/render-root-types-events";
import { RenderTypeEntitiesEvents } from "../../src/events/render-type-entities-events";
import { SchemaEvents } from "../../src/events/schema-events";

describe("EVENT_CALLBACK_MAP", () => {
  test("only maps keys that are real event enum values", () => {
    const events = [
      ConfigBuildEvents,
      SchemaEvents,
      DiffEvents,
      RenderRootTypesEvents,
      RenderHomepageEvents,
      RenderTypeEntitiesEvents,
      GenerateIndexMetafileEvents,
      RenderFilesEvents,
      PrintTypeEvents,
    ].flatMap((enumObject) => {
      return Object.values(enumObject) as string[];
    });

    for (const key of Object.keys(EVENT_CALLBACK_MAP)) {
      expect(events).toContain(key);
    }
  });
});
