import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

import { resolveConfigDir } from "./config-dir";
import { MAX_SENT_CONFIGS } from "./constants";

export interface TelemetryState {
  enabled: boolean;
  noticeVersion: number;
  lastSentConfigs: string[];
  reason?: string;
}

export const getStatePath = (dir: string = resolveConfigDir()): string => {
  return join(dir, "telemetry.json");
};

const isState = (value: unknown): value is TelemetryState => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.enabled === "boolean" &&
    typeof v.noticeVersion === "number" &&
    Array.isArray(v.lastSentConfigs) &&
    v.lastSentConfigs.every((s) => {
      return typeof s === "string";
    }) &&
    (v.reason === undefined || typeof v.reason === "string")
  );
};

/**
 * Reads the state file.
 *
 * @returns the state, `undefined` when the file does not exist, or `null` when
 * it is unreadable or corrupt (telemetry is then disabled for this run).
 */
export const readState = (
  path: string = getStatePath(),
): TelemetryState | null | undefined => {
  if (!existsSync(path)) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
    return isState(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

let counter = 0;

/**
 * Atomically writes the state (temp file + rename). Re-reads the current file
 * and merges `lastSentConfigs` first so parallel runs do not lose entries.
 *
 * @returns the state that was written.
 */
export const writeState = (
  next: Partial<TelemetryState>,
  path: string = getStatePath(),
): TelemetryState => {
  const current = readState(path);
  const base: TelemetryState = current ?? {
    enabled: true,
    noticeVersion: 0,
    lastSentConfigs: [],
  };
  const merged = [
    ...new Set([...base.lastSentConfigs, ...(next.lastSentConfigs ?? [])]),
  ].slice(-MAX_SENT_CONFIGS);
  const state: TelemetryState = { ...base, ...next, lastSentConfigs: merged };
  if (state.reason === undefined) {
    delete state.reason;
  }
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.${process.pid}.${counter++}.tmp`;
  try {
    writeFileSync(tmp, JSON.stringify(state, null, 2) + "\n");
    renameSync(tmp, path);
  } catch (error) {
    rmSync(tmp, { force: true });
    throw error;
  }
  return state;
};
