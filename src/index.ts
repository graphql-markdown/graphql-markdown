import * as os from "os";
import * as path from "path";

import { Command, flags } from "@oclif/command";

import { generateMarkdownFromSchema } from "./lib/generator";

function getTempDir() {
  return path.join(os.tmpdir(), "@edno/docusaurus2-graphql-doc-generator");
}

class GraphQLToMarkdown extends Command {
  public static description = "describe the command here";

  public static flags = {
    base: flags.string({
      char: "s",
      default: "schema",
      description: "base URL for links",
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
      default: "/",
      description: "root for links in documentation",
    }),
    root: flags.string({
      char: "s",
      default: "./docs",
      description: "root folder for doc generation",
    }),
    schema: flags.string({
      char: "s",
      default: "./schema.graphql",
      description: "schema location",
    }),
    tmp: flags.string({
      char: "t",
      default: getTempDir(),
      description: "set temp dir for schema diff",
    }),
    version: flags.version({ char: "v" }),
  };

  public async run(): Promise<void> {
    const { flags } = this.parse(GraphQLToMarkdown);

    await generateMarkdownFromSchema();
  }
}

export default GraphQLToMarkdown;
