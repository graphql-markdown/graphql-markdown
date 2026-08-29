import type * as FsPromises from "node:fs/promises";

import { vol } from "memfs";

// Manual mock for `node:fs/promises` backed by memfs.
// Vitest does not auto-load `__mocks__`, so consuming tests must call
// `vi.mock("node:fs/promises", ...)` explicitly and delegate to this module.
//
// The cast pins the exported type to the mocked module's shape: memfs' own
// promises API type is not nameable from here (TS2883), and consumers only
// rely on the `fs/promises` surface.
const promises = vol.promises as unknown as typeof FsPromises;

export default promises;
