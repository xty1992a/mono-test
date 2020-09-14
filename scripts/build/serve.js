const express = require("express");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const portfinder = require("portfinder");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const { createProxyMiddleware } = require("http-proxy-middleware");
const LazyCompiler = require("./lazy-compiler");
const ejs = require("ejs");

const base = require("../webpack.base.js");
const alias = require("../alias");
const { handlePackages } = require("./entries");
const utils = require("../utils");
const lazyCompiler = new LazyCompiler();

const proxy = require("../proxy");

portfinder.basePort = 8080;

module.exports = async function (packages) {
  // 分析package,获取入口信息
  const configs = await handlePackages(packages);
  if (!configs.success) return;
  // 将每个package的入口展平(1维化)
  const entries = compose(configs.data);

  const app = setupServe();
  const compiler = setupWebpack(configs.data);
  const middleware = setupMiddleware(compiler);
  useProxyMiddleware(app, proxy);

  middleware.forEach((m) => app.use(m));

  // 将入口存入懒编译器
  entries.forEach((entry) => lazyCompiler.addEntryItem(entry));

  // todo 修复分包问题
  // 暂时处理分包导致的路径不正确的问题，待修复
  const redirectMiddleware = chunkRedirectMiddleware(
    configs.data.map((it) => it.module),
    middleware[0]
  );
  app.use(redirectMiddleware);

  const port = await portfinder.getPortPromise();
  app.listen(port, function () {
    console.log(`server listen on http://localhost:${port}`);
  });
  // 主页入口
  app.get("/", lazyCompiler.indexMiddleware);
};

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
    publicPath: "",
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
    log: false,
    heartbeat: 2000,
    quiet: true,
  });

  const lazyMiddleware = lazyCompiler.middleware(compiler, devMiddleware);
  // endregion

  return [devMiddleware, hotMiddleware, lazyMiddleware];
}

function setupWebpack(packages) {
  const alias = packages.reduce((map, p) => {
    return { ...map, [p.module]: utils.packages(p.module) };
  }, {});

  const devWebpackConfig = {
    entry: {
      [Date.now()]: utils.root("scripts/build/useless.js"),
    },
    output: {
      path: utils.root("output"),
      chunkFilename: "chunks/[id].js",
    },
    resolve: {
      alias,
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
  };

  return webpack(merge(base, devWebpackConfig));
}

function useProxyMiddleware(app, proxy) {
  Object.keys(proxy).forEach((key) => {
    const config = proxy[key];
    app.use(key, createProxyMiddleware(config));
  });
}

// todo 调整publicPath，最终去掉该中间件
// 将module-2/0.js转为/0.js的中间件
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

// 将packages格式化为一维的入口数组
function compose(configs) {
  return configs.reduce((list, { module, entries }) => {
    const pages = Object.keys(entries).map((page) => {
      const detail = entries[page];
      return {
        name: `${module}/${page}`,
        entryJs: utils.packages(`${module}/pages/${page}/index.js`),
        template: alias.format({
          pathString: detail.template,
          module,
          name: page,
        }),
        options: {
          styles: detail.styles,
          scripts: [
            ...detail.scripts,
            { body: true, link: `/${module}/${page}.js` },
          ],
        },
      };
    });

    return [...list, ...pages];
  }, []);
}
