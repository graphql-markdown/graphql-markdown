import tap from 'tap';

import { u } from "unist-builder";
import { visit } from "unist-util-visit";

const tree = u("tree", [
  u("leaf", "1"),
  u("node", [u("leaf", "2")]),
  u("void"),
  u("leaf", "3"),
]);

tap.test("visit ast", t => {
  visit(tree, "leaf", (node) => {
    console.log(node);
  });
  t.end();
});
