/*
 * 该脚本用于打包dll依赖
 * 公共依赖将挂载在全局变量[GLOBAL_LIBRARY_NAME]中.
 * 再通过 webpack 的 externals 排除依赖
 * */

/*
 * todo 优化dll命令
 * 执行命令后应更新webpack.base.js
 * 或提供一个方法给webpack.base.js,供其查询最新的 externals
 * */

const { merge } = require("webpack-merge");
const webpack = require("webpack");
const dayjs = require("dayjs");
process.env.NODE_ENV = "production";
process.env.BUILD_TYPE = "dll";

const utils = require("../utils");
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
        path: require("../mono").alias["@output"]("dll"),
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
  let output = stats.assetsByChunkName[GLOBAL_LIBRARY_NAME];
  if (typeof output === "string") {
    output = [output];
  }

  const js = output.filter((it) => /\.js$/.test(it));
  const css = output.filter((it) => /\.css$/.test(it));

  const manifest = {
    scripts: js.map((k) => `/dist/dll/${k}`),
    styles: css.map((k) => `/dist/dll/${k}`),
    namespace: GLOBAL_LIBRARY_NAME,
  };
  utils.writeFile(
    utils.root("scripts/dll/manifest.json"),
    JSON.stringify(manifest),
    "utf-8"
  );
}

// build时,检查哪些依赖无需打包,可以排除
function getExternals() {
  try {
    const pkg = require(utils.packages("dll/package.json"));
    const { exportLibrary } = pkg;
    return Object.keys(exportLibrary).reduce((map, key) => {
      return {
        ...map,
        [key]: `${GLOBAL_LIBRARY_NAME}.${exportLibrary[key]}`,
      };
    }, {});
  } catch (e) {
    console.log("未找到");
    return {};
  }
}

module.exports = {
  makeDllManifest,
  runWebpack,
  getExternals,
};
