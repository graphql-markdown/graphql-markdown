import { vol } from "memfs";

// For Jest 30+, directly use memfs vol's promises
// This ensures the same vol instance is used that's populated in tests
export = vol.promises;
