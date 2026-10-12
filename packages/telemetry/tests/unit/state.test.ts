import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { readState, writeState } from "../../src/state";

describe("state", () => {
  let dir: string;
  let file: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "gqlmd-state-"));
    file = join(dir, "sub", "telemetry.json");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  test("returns undefined when absent", () => {
    expect(readState(file)).toBeUndefined();
  });

  test("round-trips and leaves no temp file", () => {
    writeState({ enabled: true, noticeVersion: 1 }, file);
    expect(readState(file)).toEqual({
      enabled: true,
      noticeVersion: 1,
      lastSentConfigs: [],
    });
    expect(readdirSync(join(dir, "sub"))).toEqual(["telemetry.json"]);
  });

  test("corrupt JSON returns null", () => {
    writeState({ enabled: true, noticeVersion: 1 }, file);
    writeFileSync(file, "{not json");
    expect(readState(file)).toBeNull();
  });

  test("wrong shape returns null", () => {
    writeState({ enabled: true, noticeVersion: 1 }, file);
    writeFileSync(file, JSON.stringify({ enabled: "yes" }));
    expect(readState(file)).toBeNull();
  });

  test("parallel writes merge lastSentConfigs", () => {
    writeState({ enabled: true, noticeVersion: 1 }, file);
    // two runs that both read the same initial state, then write
    writeState({ lastSentConfigs: ["a"] }, file);
    writeState({ lastSentConfigs: ["b"] }, file);
    expect(readState(file)?.lastSentConfigs).toEqual(["a", "b"]);
  });

  test("keeps the last 20 fingerprints", () => {
    for (let i = 0; i < 25; i++) {
      writeState({ lastSentConfigs: [`fp${i}`] }, file);
    }
    const list = readState(file)?.lastSentConfigs ?? [];
    expect(list).toHaveLength(20);
    expect(list[19]).toBe("fp24");
    expect(list[0]).toBe("fp5");
  });

  test("stores the sunset reason", () => {
    writeState({ enabled: false, reason: "sunset" }, file);
    expect(readState(file)).toMatchObject({ enabled: false, reason: "sunset" });
  });
});
