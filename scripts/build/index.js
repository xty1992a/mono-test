const base = require("../webpack.base");
const {merge} = require("webpack-merge");
const alias = require("../alias");
const utils = require("../utils");
const path = require("path");
const {handlePackages} = require("./entries");
const production = process.env.NODE_ENV === "production";
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = async function (packages) {
  console.time("编译完成");
  const configs = await handlePackages(packages);
  if (!configs.success) return;

  const taskConfigs = configs.data.map(c => createWebpackConfig(c));

  while (taskConfigs.length) {
    const config = taskConfigs.shift();
    const result = await runWebpack(config);
    if (result.success) {
      console.log("编译成功");
    } else {
      console.error("编译失败");
    }
  }
  console.timeEnd("编译完成");
};

// 生成webpack配置
function createWebpackConfig(mono) {
  const moduleDir = utils.packages(mono.module);
  const entry = {};

  const plugins = [];

  Object.keys(mono.entries)
    .forEach((page) => {
      entry[page] = ["core-js", path.join(moduleDir, `pages/${page}/index.js`)];
      plugins.push(createHtmlPlugin({
        config: mono.entries[page],
        module: mono.module,
        name: page,
      }));
    });

  const config = merge(base, {
    entry,
    output: {
      path: alias.alias["@output"](mono.module),
      filename: "[name].js",
      chunkFilename: "chunks/[name]_[chunkhash:8].js",
      publicPath: `/dist/${mono.module}/`
    },
    plugins: [
      ...plugins,
      new CleanWebpackPlugin()
    ]
  });

  return config;
}

// 运行webpack任务
const webpack = require("webpack");

function runWebpack(config) {
  return new Promise(resolve => {
    // console.log(JSON.stringify(config, null, 4));
    webpack(config, function (error, stats) {
      if (error || stats.hasErrors()) {
        if (!error) {
          error = stats.toJson().errors;
        }
        console.error(error);
        return resolve({success: false, error});
      }
      resolve({success: true, data: stats});
    });
  });
}

const HtmlPlugin = require("html-webpack-plugin");

function createHtmlPlugin({config, module, name}) {
  const fmt = p => alias.format({pathString: p, module, name});
  return new HtmlPlugin({
    chunks: [name],
    title: name || config.title,
    template: fmt(config.template),
    filename: fmt(config.html),
    styles: config.styles,
    scripts: config.scripts
  });
}