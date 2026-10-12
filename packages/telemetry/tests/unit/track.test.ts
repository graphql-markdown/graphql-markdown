import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

import { DEFAULT_ENDPOINT } from "../../src/constants";
import { readState, writeState } from "../../src/state";
import { encodeBody, track } from "../../src/track";

const ENV = { GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT: "https://t.test/v1/event" };

describe("track", () => {
  let dir: string;
  let statePath: string;
  let fetchMock: ReturnType<typeof vi.fn>;
  let stderr: ReturnType<typeof vi.spyOn>;
  const input = () => {
    return {
      trigger: "cli" as const,
      pkg: "x",
      pkgVersion: "1.0.0",
      env: ENV,
      statePath,
      config: { force: true },
    };
  };

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "gqlmd-track-"));
    statePath = join(dir, "telemetry.json");
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    stderr = vi.spyOn(process.stderr, "write").mockImplementation(() => {
      return true;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    stderr.mockRestore();
    rmSync(dir, { recursive: true, force: true });
  });

  test("202 records the fingerprint and the notice", async () => {
    fetchMock.mockResolvedValue({ status: 202 });
    await track(input());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const init = fetchMock.mock.calls[0][1];
    expect(init.method).toBe("POST");
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(init.body).firstRun).toBe(true);
    const state = readState(statePath);
    expect(state).toMatchObject({ enabled: true, noticeVersion: 1 });
    expect(state?.lastSentConfigs).toHaveLength(1);
  });

  test("the same config is not sent twice", async () => {
    fetchMock.mockResolvedValue({ status: 202 });
    await track(input());
    await track(input());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("204 records no fingerprint", async () => {
    fetchMock.mockResolvedValue({ status: 204 });
    await track(input());
    expect(readState(statePath)?.lastSentConfigs).toEqual([]);
    await track(input());
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("410 stores sunset and stops sending", async () => {
    fetchMock.mockResolvedValue({ status: 410 });
    await track(input());
    expect(readState(statePath)).toMatchObject({
      enabled: false,
      reason: "sunset",
    });
    await track(input());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("timeout or network error never throws", async () => {
    fetchMock.mockRejectedValue(new DOMException("timeout", "TimeoutError"));
    await expect(track(input())).resolves.toBeUndefined();
    expect(readState(statePath)?.lastSentConfigs).toEqual([]);
  });

  test("uses the default endpoint when no override is set", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    await track({ ...input(), env: {} });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(DEFAULT_ENDPOINT);
  });

  test("sends nothing with an empty endpoint override", async () => {
    await track({
      ...input(),
      env: { GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT: "" },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("sends nothing for a corrupt state", async () => {
    writeState({ enabled: true, noticeVersion: 1 }, statePath);
    const { writeFileSync } = await import("node:fs");
    writeFileSync(statePath, "garbage");
    await track(input());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("sends nothing when disabled in state", async () => {
    writeState({ enabled: false, noticeVersion: 1 }, statePath);
    await track(input());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("DEBUG prints the payload and sends nothing", async () => {
    await track({
      ...input(),
      env: { GRAPHQL_MARKDOWN_TELEMETRY_DEBUG: "1" },
    });
    expect(fetchMock).not.toHaveBeenCalled();
    const out = stderr.mock.calls
      .map((c: unknown[]) => {
        return String(c[0]);
      })
      .join("");
    expect(out).toContain('"v": 1');
  });

  test("prints the full notice once, then the reminder", async () => {
    fetchMock.mockResolvedValue({ status: 202 });
    await track(input());
    await track({ ...input(), config: { force: false } });
    const lines = stderr.mock.calls.map((c: unknown[]) => {
      return String(c[0]);
    });
    expect(lines[0]).toContain("collects anonymous usage data");
    expect(lines[1]).toContain("Anonymous telemetry enabled");
  });
});

describe("encodeBody", () => {
  test("plain JSON at or below 1 KB", () => {
    const json = "x".repeat(1024);
    const r = encodeBody(json);
    expect(r.body).toBe(json);
    expect(r.headers["Content-Encoding"]).toBeUndefined();
  });

  test("gzip above 1 KB", () => {
    const json = "x".repeat(1025);
    const r = encodeBody(json);
    expect(r.headers["Content-Encoding"]).toBe("gzip");
    expect(gunzipSync(r.body as Buffer).toString()).toBe(json);
  });
});
