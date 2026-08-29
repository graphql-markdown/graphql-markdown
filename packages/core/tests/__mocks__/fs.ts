import { createFsFromVolume, vol } from "memfs";
import { ufs } from "unionfs";

import type { IFS } from "unionfs";

/**
 * Union file system: reads fall through to the real file system (test fixtures
 * under `tests/__data__`, the package `assets` folder), while everything the
 * generator writes lands in the in-memory `vol` volume the tests inspect.
 */
const actualFs = await vi.importActual<typeof import("node:fs")>("node:fs");

const memoryFs = createFsFromVolume(vol);

const unionFs = ufs
  .use(actualFs as unknown as IFS)
  .use(memoryFs as unknown as IFS);

export default unionFs;
