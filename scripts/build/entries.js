/*
 * 查询指定路径下的子路径,返回其中package.json中包含 isBusinessModule 为true的目录
 * */
const utils = require("../utils");
const fs = require("fs");
const path = require("path");

// region 为指定的packages生成配置
// 每个package目录，如果包含mono.config.js，则用mono.config覆盖默认配置
// 否则基于目录下的pages中的子目录作为
const dftEntry = require("../alias").entry;

function handlePackages(modules) {
  return new Promise(async (resolve) => {
    const data = [];
    while (modules.length) {
      const module = modules.pop();
      const config = await createConfig(module);
      data.push(config);
    }
    resolve({ success: true, data });
  });
}

async function createConfig(module) {
  const localCfg = utils.packages(module + "/mono.config.js");
  const existConfig = await utils.access(localCfg);
  let config = null;
  if (existConfig.success) {
    const local = await createLocalConfig(localCfg);
    config = fmtConfig({ module, ...local });
  } else {
    config = createDftConfig(module);
  }
  return config;
}

// 未指定mono.config.js的，根据目录自动生成
function createDftConfig(module) {
  const dir = utils.packages(module);

  return new Promise(async (resolve) => {
    const pages = await utils.readdir(path.resolve(dir, "pages"));
    if (!pages.success) {
      console.error(`读取${dir}失败，请检查`, pages.error);
      return resolve(null);
    }
    const entries = pages.data.reduce((map, page) => {
      return { ...map, [page]: utils.copy(dftEntry) };
    }, {});
    resolve({ module, entries });
  });
}

function createLocalConfig(file) {
  try {
    const config = require(file);
    if (typeof config === "function") return config();
    return config;
  } catch (e) {
    console.error(file, "加载失败，请检查！", e);
    return {};
  }
}

// 整理config，补充默认值
function fmtConfig(config) {
  const old = config.entries;
  const entries = Object.keys(old).reduce((map, page) => {
    return {
      ...map,
      [page]: {
        ...dftEntry,
        ...old[page],
      },
    };
  }, {});
  return { ...config, entries };
}

// endregion

// region 在指定目录下搜寻packages
// 即package.json中包含 isBusinessModule 字段的目录
function findPackages(directory) {
  return new Promise(async (resolve) => {
    const dirs = await utils.readdir(directory);
    if (!dirs.success) return resolve({ success: false, data: [] });
    try {
      const data = [];

      while (dirs.data.length) {
        const dir = dirs.data.pop();
        const pkgDir = path.join(directory, dir, "package.json");
        const access = await utils.access(pkgDir);
        if (!access.success) continue;
        const pkg = require(pkgDir);
        if (!pkg["isBusinessModule"]) continue;
        data.push(dir);
      }
      resolve({ success: true, data });
    } catch (error) {
      resolve({ success: false, error });
    }
  });
}

// endregion
module.exports = {
  handlePackages,
  findPackages,
};
