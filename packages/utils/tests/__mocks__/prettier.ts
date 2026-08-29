// Manual mock for `prettier`.
// Vitest does not auto-load `__mocks__`, so consuming tests must call
// `vi.mock("prettier", ...)`/`vi.doMock("prettier", ...)` explicitly and
// delegate to this module.
export const resolveConfigFile = async (): Promise<string | null> => {
  return null;
};

export const resolveConfig = async (): Promise<Record<string, unknown>> => {
  return {};
};

export const format = vi.fn(async (content: string): Promise<string> => {
  return `prettified:${content}`;
});

export default { resolveConfigFile, resolveConfig, format };
