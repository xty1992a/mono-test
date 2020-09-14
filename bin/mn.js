#!/usr/bin/env node

const program = require("commander");

program
  .version("1.0.0")
  .usage("<command>")
  .command("pack", "构建")
  .command("dll", "打包packages/dll下的依赖")
  .command("create", "创建新包及新页面")
  .parse(process.argv);
