import { printDisclaimer } from "../../src/disclaimer";

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
