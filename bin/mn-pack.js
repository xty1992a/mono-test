#!/usr/bin/env node
const program = require("commander");
const inquirer = require("inquirer");

program
  .option("-d, --dev", "pack mode development")
  .option("-b, --build", "pack mode production")
  .parse(process.argv);

if (program.build) {
  process.env.NODE_ENV = "production";
} else if (program.dev) {
  process.env.NODE_ENV = "development";
}
// 以下模块可能依赖上面的设置，故而放下来
const entries = require("../scripts/build/entries");
const build = require("../scripts/build/index");
const utils = require("../scripts/utils");

run();

async function run() {
  const packages = await entries.findPackages(utils.packages("."));
  if (!packages.success) return;
  const result = await askPackage(packages.data);
  if (!result.success) return;
  build(result.data);
}

async function askPackage(packages) {
  try {
    const answers = await inquirer.prompt([
      {
        name: "packages",
        message: "请选择需要编译的模块",
        type: "checkbox",
        choices: packages,
        default: [],
      },
    ]);
    console.log(answers);
    return { success: true, data: answers.packages };
  } catch (e) {
    return { success: false, error: e };
  }
}
