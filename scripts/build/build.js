const base = require("../webpack.base");
const {merge} = require("webpack-merge");
const alias = require("../alias");
const utils = require("../utils");
const path = require("path");
const {handlePackages} = require("./entries");
const production = process.env.NODE_ENV === "production";
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

/*
输入模块名数组，依次使用webpack打包模块
模块入口由模块下的mono.config.js指定
默认是模块下的pages下的各目录
* */

module.exports = async function (packages) {
  console.time("编译完成");
  // 生成模块入口等配置
  const configs = await handlePackages(packages);
  if (!configs.success) return {success: false};

  // 将配置转为webpack配置
  const taskConfigs = configs.data.map(createWebpackConfig);

  // 模块依次串行打包，后续可考虑改为同时打包若干个模块
  while (taskConfigs.length) {
    const {config, module} = taskConfigs.shift();
    const result = await runWebpack(config);
    if (result.success) {
      console.log(module, "编译成功");
    } else {
      console.error(module, "编译失败");
    }
  }
  console.timeEnd("编译完成");

  return {success: true};
};

// region webpack相关
// 生成webpack配置
function createWebpackConfig({module, entries}) {
  const moduleDir = utils.packages(module);
  const entry = {};

  const plugins = [];

  Object.keys(entries).forEach((page) => {
    entry[page] = [path.join(moduleDir, `pages/${page}/index.js`)];
    plugins.push(
      createHtmlPlugin({
        config: entries[page],
        module: module,
        name: page,
      })
    );
  });

  const config = merge(base, {
    entry,
    output: {
      // 模块依次打包，每次的输出基础路径均不同
      path: alias.alias["@output"](module),
      filename: "[name]_[contenthash:8].js",
      chunkFilename: "chunks/[name]_[contenthash:8].js",
      publicPath: `/dist/${module}/`,
    },
    plugins: [...plugins, new CleanWebpackPlugin()],
  });

  return {config, module: module};
}

// 为每个入口生成html插件
const HtmlPlugin = require("html-webpack-plugin");

function createHtmlPlugin({config, module, name}) {
  const fmt = (p) => alias.format({pathString: p, module, name});

  const options = {
    chunks: [name],
    title: name || config.title,
    template: fmt(config.template),
    filename: fmt(config.html),
    styles: config.styles,
    scripts: config.scripts,
  };
  return new HtmlPlugin(options);
}


// 运行webpack任务
const webpack = require("webpack");

function runWebpack(config) {
  return new Promise((resolve) => {
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

// endregion