#!/usr/bin/env node
const program = require("commander");
const inquirer = require("inquirer");
const entries = require("../scripts/build/entries");
const create = require("../scripts/create");
const utils = require("../scripts/utils");

run();

async function run() {
  await ask();
}

async function ask() {
  const packages = await entries.findPackages(utils.packages("."));
  if (!packages.success) return;
  const pkgMap = await findPages([...packages.data]);
  let pkgName = "";

  try {
    const result = await inquirer.prompt([
      {
        name: "packageName",
        message: "请输入包名",
        validate(string) {
          const valid = nameValidator(string);
          if (valid === true) {
            pkgName = string;
          }
          return valid;
        },
      },
      {
        name: "pageName",
        message: "请输入页面名称",
        validate(string) {
          const valid = nameValidator(string);
          if (!valid || typeof valid === "string") return valid;
          console.log(pkgMap, pkgName);
          if (pkgMap[pkgName] && pkgMap[pkgName].includes(string)) {
            return `${pkgName}/${string}已存在,请重新命名`;
          }
          return true;
        },
      },
    ]);

    await create.createPackage(result);
  } catch (e) {
    console.log("失败", e);
  }
}

function nameValidator(string) {
  if (!/^[A-z][A-z\-_0-9]{0,9}$/.test(string)) {
    return "包名仅允许字母、数字、-、_,且开头应为字母,最多10位";
  }
  return true;
}

async function findPages(packages) {
  const map = {};
  try {
    while (packages.length) {
      const pkg = packages.shift();
      const result = await entries.findPages(pkg);
      if (!result.success) continue;
      map[pkg] = result.data;
    }
  } catch (e) {
    console.log(e);
  }
  return map;
}
