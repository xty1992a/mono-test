/*
 * 该脚本用于打包dll依赖
 * 公共依赖将挂载在全局变量[]
 * */

const { merge } = require("webpack-merge");
const webpack = require("webpack");
const dayjs = require("dayjs");
const utils = require("../utils");
const alias = require("../alias");
const base = require("../webpack.base");

const today = dayjs().format("YYYY_MM_DD");
const GLOBAL_LIBRARY_NAME = "SITE_DLL";

// 编译dll
function runWebpack() {
  return new Promise((resolve) => {
    const config = merge(base, {
      entry: {
        [GLOBAL_LIBRARY_NAME]: utils.packages("dll/index.js"),
      },
      output: {
        path: alias.alias["@output"]("dll"),
        filename: `[name]_${today}.js`,
        libraryTarget: "var", // 打包后直接声明为全局变量
        library: GLOBAL_LIBRARY_NAME, // 变量名为此
        libraryExport: "default", // 直接暴露default，不要包裹
      },
      devtool: "none",
    });
    webpack(config, (error, stats) => {
      if (error || stats.hasErrors()) {
        error = error || stats.toJson().errors;
        console.log("编译失败", error);
        resolve({ success: false, error });
      } else {
        console.log("编译成功");
        resolve({ success: true, data: stats.toJson() });
      }
    });
  });
}

// 生成清单
function makeDllManifest(stats) {
  const manifest = {
    scripts: [`/dist/dll/${stats.assetsByChunkName[GLOBAL_LIBRARY_NAME]}`],
    styles: [],
    namespace: GLOBAL_LIBRARY_NAME,
  };
  utils.writeFile(
    utils.root("scripts/dll/manifest.json"),
    JSON.stringify(manifest),
    "utf-8"
  );
}
// 获取清单
function getDllManifest() {
  return require("./manifest.json");
}

module.exports = {
  getDllManifest,
  runWebpack,
  makeDllManifest,
};
