import { describe, it, expect, vi, beforeEach } from "vitest";

// Create minimal mock implementations for Vue's ref and computed
// These don't need to be fully functional - just need to track values
const createRef = (value: unknown) => {
  return {
    value,
  };
};

const createComputed = (getter: () => unknown) => {
  return {
    value: getter(),
  };
};

// Mock Nuxt globals that are not available in plain vitest environment
const mockUseAsyncData = vi.fn();
const mockUseAppConfig = vi.fn();
const mockQueryCollection = vi.fn();

// Setup global mocks before importing the composable
globalThis.useAsyncData = mockUseAsyncData;
globalThis.useAppConfig = mockUseAppConfig;
globalThis.queryCollection = mockQueryCollection;
globalThis.computed = createComputed;

// Now import the composable after globals are set up
const { useHierarchyMode } =
  await import("../../app/composables/useHierarchyMode");

describe("useHierarchyMode", () => {
  beforeEach(() => {
    mockUseAsyncData.mockClear();
    mockUseAppConfig.mockClear();
    mockQueryCollection.mockClear();
  });

  it("resolves isFlat: true when every non-landing page has exactly one path segment past baseURL", async () => {
    const mockPages = [
      { path: "/api-reference/user" },
      { path: "/api-reference/id" },
      { path: "/api-reference/get-user" },
    ];

    mockQueryCollection.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useHierarchyMode();

    expect(result.isFlat.value).toBe(true);
  });

  it("resolves isFlat: false when any page is nested under a folder", async () => {
    const mockPages = [
      { path: "/api-reference/user" },
      { path: "/api-reference/types/objects/profile" },
    ];

    mockQueryCollection.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useHierarchyMode();

    expect(result.isFlat.value).toBe(false);
  });

  it("resolves isFlat: false when there are no non-landing pages", async () => {
    const mockPages = [{ path: "/api-reference/generated" }];

    mockQueryCollection.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useHierarchyMode();

    expect(result.isFlat.value).toBe(false);
  });

  it("ignores the landing doc itself when judging flatness", async () => {
    const mockPages = [
      { path: "/api-reference/generated" },
      { path: "/api-reference/user" },
    ];

    mockQueryCollection.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      all: vi.fn().mockResolvedValue(mockPages),
    });

    mockUseAsyncData.mockImplementation((key, callback) => {
      return callback().then((data) => {
        return { data: createRef(data) };
      });
    });

    mockUseAppConfig.mockReturnValue({
      gqlmd: { baseURL: "api-reference" },
    });

    const result = await useHierarchyMode();

    expect(result.isFlat.value).toBe(true);
  });
});
