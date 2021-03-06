/*
基于express与webpack-xx-middleware.
启动时将所有入口缓存,首次访问时再加入编译.
可能存在未知问题
* */

const express = require("express");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const { createProxyMiddleware } = require("http-proxy-middleware");
const LazyCompiler = require("./lazy-compiler");
const ejs = require("ejs");
const { mapAlias } = require("../webpack-helper/useAlias");
const NamedModulesPlugin = require("webpack/lib/NamedModulesPlugin");

const base = require("../webpack.base.js");
const utils = require("../utils");
const lazyCompiler = new LazyCompiler();

function setupServe() {
  const app = express();

  app.set("views", utils.root("output/view"));
  app.set("view engine", "ejs");
  app.use(express.static(utils.root("output")));
  app.use(express.static(utils.packages("common/public")));
  app.engine("html", ejs.renderFile);

  return app;
}

function setupMiddleware(compiler) {
  // region 中间件
  // 开发服务器中间件
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: "/",
    noInfo: false,
    quiet: true,
    logLevel: "warn",

    stats: {
      chunks: false,
      colors: true,
      child: true,
    },
  });
  // hmr中间件
  const hotMiddleware = webpackHotMiddleware(compiler, {
    log: (info) => {
      process.stdout.write("\033[2J");
      console.log(info);
    },
    heartbeat: 2000,
    quiet: true,
    reload: false,
  });

  const lazyMiddleware = lazyCompiler.middleware(compiler, devMiddleware);
  // endregion

  return [devMiddleware, hotMiddleware, lazyMiddleware];
}

function setupWebpack(alias) {
  const devWebpackConfig = {
    entry: {
      [Date.now()]: utils.root("scripts/build/useless.js"),
    },
    output: {
      path: utils.root("output"),
      chunkFilename: "chunks/[id].js",
      publicPath: "/",
    },
    devtool: "cheap-module-eval-source-map",
    resolve: {
      alias,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NamedModulesPlugin(),
    ],
  };

  return webpack(merge(base, devWebpackConfig));
}

function useProxyMiddleware(app, proxy) {
  Object.keys(proxy).forEach((key) => {
    const config = proxy[key];
    app.use(key, createProxyMiddleware(config));
  });
}

// 将module-2/0.js转为/0.js的中间件
// 已修复,不需要了
// 但这种场景可能还存在,暂留
function chunkRedirectMiddleware(list, devMiddleware) {
  const regs = list.map((key) => new RegExp(`/${key}(.*)`));
  return function (req, res, next) {
    let path = req.originalUrl.split("?")[0];
    if (!/\.js$/.test(path)) return next();

    for (let i = 0; i < regs.length; i++) {
      const reg = regs[i];
      if (reg.test(path)) {
        const truename = RegExp.$1;
        const fs = devMiddleware.fileSystem;
        const filename = utils.root(`output/${truename}`);
        const content = fs.readFileSync(filename);
        res.send(content);
        return;
      }
    }
    next();
  };
}

function run(options) {
  const { entries, port, packages, proxy } = options;

  const alias = mapAlias(packages);
  const app = setupServe();
  const compiler = setupWebpack(alias);
  const middleware = setupMiddleware(compiler);
  useProxyMiddleware(app, proxy);

  middleware.forEach((m) => app.use(m));

  // 将入口存入懒编译器
  entries.forEach((entry) => lazyCompiler.addEntryItem(entry));

  app.listen(port, function () {
    console.log(`server listen on http://localhost:${port}`);
  });
  // 主页入口
  app.get("/", lazyCompiler.indexMiddleware);
}

module.exports = {
  run,
};
