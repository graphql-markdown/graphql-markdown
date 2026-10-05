export interface SwizzleEntry {
  id: string;
  description: string;
  sourcePath: string;
  targetPath: string;
}

// Re-exports the single source of truth in `swizzle.manifest.mjs` — do not
// redeclare the array here, it would silently drift from what the CLI (which
// loads the .mjs directly) actually uses.
export { swizzleManifest } from "./swizzle.manifest.mjs";
