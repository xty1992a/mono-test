const {merge} = require("webpack-merge");
const webpack = require("webpack");
const dayjs = require("dayjs");
const utils = require("../utils");
const alias = require("../alias");
const base = require("../webpack.base");

const today = dayjs().format("YYYY_MM_DD");

// 编译dll
function runWebpack() {
  return new Promise(resolve => {
    const config = merge(base, {
      entry: {
        SITE_DLL: utils.packages("dll/build.js")
      },
      output: {
        path: alias.alias["@output"]("dll"),
        filename: `[name]_${today}.js`,
        libraryTarget: "var", // 打包后直接声明为全局变量
        library: "SITE_DLL",  // 变量名为此
        libraryExport: "default", // 直接暴露default，不要包裹
      },
      devtool: "none",
    });
    webpack(config, (error, stats) => {
      if (error || stats.hasErrors()) {
        error = error || stats.toJson().errors;
        console.log("编译失败", error);
        resolve({success: false, error});
      } else {
        console.log("编译成功");
        resolve({success: true, data: stats.toJson()});
      }
    });
  });
}

// 生成清单
function makeDllManifest(stats) {
  const manifest = {
    scripts: [
      `/dist/dll/${stats.assetsByChunkName.SITE_DLL}`
    ],
    styles: [],
    namespace: "SITE_DLL"
  };
  utils.writeFile(utils.root("scripts/dll/manifest.json"), JSON.stringify(manifest), "utf-8");
}


module.exports = {
  runWebpack,
  makeDllManifest
};