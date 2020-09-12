#!/usr/bin/env node

const program = require("commander");

program
  .version("1.0.0")
  .usage("<command> [项目名称]")
  .command("pack <mode> [pages]", "构建")
  .command("dll", "打包packages/dll下的依赖")
  .parse(process.argv);
