#!/usr/bin/env node
const program = require("commander");
const dll = require("../scripts/dll");

program.parse(process.argv);

run();

async function run() {
  const result = await dll.runWebpack();
  if (!result.success) return;
  dll.makeDllManifest(result.data);
}
