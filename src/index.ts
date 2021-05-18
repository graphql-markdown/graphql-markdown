import { Command, flags } from "@oclif/command";

import * as path from "path";
import * as os from "os";

import { generateMarkdownFromSchema } from "./lib/generator";

function getTempDir() {
  return path.join(os.tmpdir(), "@edno/docusaurus2-graphql-doc-generator");
}

class GraphQLToMarkdown extends Command {
  public static description = "describe the command here";

  public static flags = {
    base: flags.string({
      char: "s",
      description: "base URL for links",
      default: "schema",
    }),
    diff: flags.enum({
      char: "d",
      description: "set diff method",
      options: ["NONE", "SCHEMA", "HASH"],
    }),
    force: flags.boolean({
      char: "f",
      description: "force document generation",
    }),
    help: flags.help({ char: "h" }),
    link: flags.string({
      char: "s",
      description: "root for links in documentation",
      default: "/",
    }),
    root: flags.string({
      char: "s",
      description: "root folder for doc generation",
      default: "./docs",
    }),
    schema: flags.string({
      char: "s",
      description: "schema location",
      default: "./schema.graphql",
    }),
    tmp: flags.string({
      char: "t",
      description: "set temp dir for schema diff",
      default: getTempDir(),
    }),
    version: flags.version({ char: "v" }),
  };

  public async run(): Promise<void> {
    const { flags } = this.parse(GraphQLToMarkdown);

    await generateMarkdownFromSchema();
  }
}

export default GraphQLToMarkdown;
