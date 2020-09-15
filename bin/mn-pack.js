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
    const answers = await askServe(packages.data);
    if (!answers) return;
    if (!answers.packages) {
      answers.packages = packages.data;
    }
    await serve(answers);
  }

  if (program.build) {
    const answers = await askPackage(packages.data);
    if (!answers) return;
    await build(answers);
  }
}

// 询问服务类型
async function askServe(packages) {
  return inquirer.prompt([
    {
      name: "serverType",
      message: "请选择服务类型",
      type: "list",
      choices: [
        {
          name: "定向编译",
          value: "devServer",
        },
        {
          name: "全量懒编译",
          value: "myServer",
        },
      ],
    },
    {
      name: "packages",
      message: "请选择需要编译的包",
      type: "checkbox",
      choices: packages,
      default: [],
      when({ serverType }) {
        return serverType === "devServer";
      },
    },
  ]);
}

// 询问需要编译哪些包
async function askPackage(packages) {
  try {
    const answers = await inquirer.prompt([
      {
        name: "packages",
        message: "请选择需要编译的包",
        type: "checkbox",
        choices: ["all(全部)", ...packages],
        default: [],
      },
      {
        name: "report",
        message: "是否需要依赖分析报告?",
        type: "confirm",
        default: false,
        when({ packages }) {
          return !packages.includes("all(全部)") && packages.length === 1;
        },
      },
    ]);

    if (answers.packages.includes("all(全部)")) {
      answers.packages = packages;
    }

    return answers;
  } catch (e) {
    console.log(e);
    return null;
  }
}
