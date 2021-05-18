import { parseSchema, loadSchema, renderNode } from "../src/lib/generator";
import fs from "fs";

test("visit ast", async () => {
const schema = await loadSchema();
const ast = parseSchema(schema);
fs.writeFileSync(`${__dirname}/../ast.json`, JSON.stringify(ast, null, 2));
  ast.forEach(async (element) => {
      console.log(await renderNode(element, `${__dirname}/../__layouts__`));
  });

});
