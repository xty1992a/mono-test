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
const build = require("../scripts/build/build");
const entries = require("../scripts/build/entries");
const serve = require("../scripts/build/serve");
const utils = require("../scripts/utils");

run();

async function run() {
  const packages = await entries.findPackages(utils.packages("."));
  if (!packages.success) return;

  if (program.dev) {
    await serve(packages.data);
    return;
  }

  const result = await askPackage(packages.data);
  if (!result.success) return;
  if (program.build) {
    const { packages, report } = result.data;
    await build(packages, {
      report,
    });
  }
}

async function askPackage(packages) {
  try {
    const answers = {};
    const result = await inquirer.prompt([
      {
        name: "packages",
        message: "请选择需要编译的包",
        type: "checkbox",
        choices: ["all(全部)", ...packages],
        default: [],
      },
    ]);

    if (result.packages.includes("all(全部)")) {
      result.packages = packages;
    }

    answers.packages = result.packages;

    if (answers.packages.length === 1) {
      const { report } = await inquirer.prompt([
        {
          name: "report",
          message: "是否需要依赖分析报告?",
          type: "confirm",
          default: false,
        },
      ]);
      answers.report = report;
    }

    return { success: true, data: answers };
  } catch (e) {
    return { success: false, error: e };
  }
}
