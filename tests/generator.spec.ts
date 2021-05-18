import { parseSchema, readSchema, renderASTSchema } from "../src/lib/generator";
import fs from "fs";
import { parse } from "graphql";

test("visit ast", async () => {
const schema = await readSchema("tests/__data__/tweet.graphql");
fs.writeFileSync(`${__dirname}/../schema.json`, JSON.stringify(parse(schema, {noLocation: true}), null, 2));
const ast = parseSchema(schema);
fs.writeFileSync(`${__dirname}/../ast.json`, JSON.stringify(ast, null, 2));
  ast.forEach(element => {
      console.log(renderASTSchema(element));
  });

});
