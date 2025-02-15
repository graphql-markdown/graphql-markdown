import { Command } from "commander";
import GraphQLDocCLI from "./cli";

void (async (): Promise<void> => {
  const program = await GraphQLDocCLI(new Command());
  program.parse();
})();
