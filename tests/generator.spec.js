import tap from 'tap';
import { readFileSync } from "fs";
import { parse, print } from "graphql";

const typeDefs = readFileSync("tests/__data__/tweet.graphql", "UTF8");
const ast = parse(typeDefs);

tap.test("visit ast", t => {
  console.log(print(ast));
  t.end();
});
