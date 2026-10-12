import {
  FULL_NOTICE,
  isNoticeDue,
  printDisclaimer,
} from "../../src/disclaimer";

describe("printDisclaimer", () => {
  let write: ReturnType<typeof vi.spyOn>;
  const state = { enabled: true, noticeVersion: 1, lastSentConfigs: [] };

  beforeEach(() => {
    write = vi.spyOn(process.stderr, "write").mockImplementation(() => {
      return true;
    });
  });
  afterEach(() => {
    return write.mockRestore();
  });

  test("full notice without state", () => {
    expect(printDisclaimer(undefined, { ci: false })).toBe(true);
    expect(String(write.mock.calls[0][0])).toContain(
      "collects anonymous usage data",
    );
  });

  test("full notice when noticeVersion is behind", () => {
    expect(printDisclaimer({ ...state, noticeVersion: 0 }, { ci: false })).toBe(
      true,
    );
  });

  test("one-line reminder otherwise", () => {
    expect(printDisclaimer(state, { ci: false })).toBe(false);
    expect(write).toHaveBeenCalledTimes(1);
    expect(String(write.mock.calls[0][0])).toMatch(
      /^ℹ Anonymous telemetry enabled\./,
    );
  });

  test("CI prints the one-line reminder", () => {
    expect(printDisclaimer(undefined, { ci: true, ciProvider: "other" })).toBe(
      false,
    );
    expect(String(write.mock.calls[0][0])).toContain("Opt out");
  });
});

describe("isNoticeDue", () => {
  const state = { enabled: true, noticeVersion: 1, lastSentConfigs: [] };

  test("due without state or with an old version", () => {
    expect(isNoticeDue(undefined)).toBe(true);
    expect(isNoticeDue({ ...state, noticeVersion: 0 })).toBe(true);
  });

  test("not due once recorded, nor in CI", () => {
    expect(isNoticeDue(state)).toBe(false);
    expect(isNoticeDue(undefined, { ci: true })).toBe(false);
  });
});

describe("printDisclaimer with onFullNotice", () => {
  let write: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    write = vi.spyOn(process.stderr, "write").mockImplementation(() => {
      return true;
    });
  });
  afterEach(() => {
    return write.mockRestore();
  });

  test("hands the full notice to the callback, not stderr", () => {
    const cb = vi.fn();
    expect(printDisclaimer(undefined, { ci: false }, cb)).toBe(true);
    expect(cb).toHaveBeenCalledWith(FULL_NOTICE);
    expect(write).not.toHaveBeenCalled();
  });

  test("the reminder still goes to stderr when not due", () => {
    const cb = vi.fn();
    const state = { enabled: true, noticeVersion: 1, lastSentConfigs: [] };
    expect(printDisclaimer(state, { ci: false }, cb)).toBe(false);
    expect(cb).not.toHaveBeenCalled();
    expect(write).toHaveBeenCalledTimes(1);
  });
});
