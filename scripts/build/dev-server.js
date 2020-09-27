/*
基于webpack-dev-server,无法按访问懒编译.
因此启动之前需要询问需要编译的模块,减轻编译压力
但应该比较稳定.暂留
* */

const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlPlugin = require("html-webpack-plugin");
const Server = require("webpack-dev-server");
const { createReadStream } = require("fs");

const { mapAlias } = require("../webpack-helper/useAlias");
const base = require("../webpack.base.js");
const utils = require("../utils");

function run(options) {
  const { packages, entries, proxy, port } = options;
  const alias = mapAlias(packages);
  const entry = createEntry(entries);
  const plugins = createHtmlPlugin(entries);
  const config = merge(base, {
    entry,
    output: {
      path: utils.root("output"),
      chunkFilename: "chunks/[id].js",
      filename: "[name].js",
      publicPath: `/`,
    },
    resolve: {
      alias,
    },
    plugins,
  });

  // console.log(JSON.stringify(config, null, 4));

  const compiler = webpack(config);

  const server = new Server(compiler, {
    publicPath: "/",
    contentBase: [
      utils.packages("common/public"),
      utils.root("."),
      utils.root("output"),
    ],
    proxy,
    logLevel: "warn",
    before(app, server, compiler) {
      app.use("/", indexMiddleware(entries));
      app.use(magicHtmlMiddleware(server.middleware));
    },
    hot: true,
  });

  const hostname = "localhost";

  server.listen(port, hostname, function () {
    console.log(`server start on http://${hostname}:${port}`);
  });
}

function indexMiddleware(entries) {
  return function (req, res, next) {
    if (!["/", ""].includes(req.originalUrl)) return next();
    res.send(
      entries.map((it) => `<a href="/${it.name}">${it.name}</a>`).join("<br>")
    );
  };
}

// 访问入口 /module-1/home 返回 /module-1/home.html
// dev-server内置[magicHtml feature]但不支持配置,这里实现了它的作用
function magicHtmlMiddleware(devMiddleware) {
  const { fileSystem: fs, getFilenameFromUrl: getFileName } = devMiddleware;
  return function (req, res, next) {
    const _path = req.path;
    try {
      const stats = getFileStats(fs, getFileName(`${_path}.js`));
      if (!stats || !stats.isFile()) return next();
      fs.createReadStream(getFileName(`${_path}.html`)).pipe(res);
    } catch (e) {
      console.log(_path, e.message);
      next();
    }
  };
}

function getFileStats(fs, file) {
  try {
    return fs.statSync(file);
  } catch (e) {
    return null;
  }
}

function createEntry(entries) {
  return entries.reduce((map, item) => {
    return {
      ...map,
      [item.name]: item.entryJs,
    };
  }, {});
}

// 开发时也生成html
function createHtmlPlugin(entries) {
  return entries.map((item) => {
    return new HtmlPlugin({
      chunks: [item.name],
      inject: false,
      title: item.name,
      template: item.template,
      filename: utils.root("output/" + item.name + ".html"),
      styles: item.options.styles,
      scripts: item.options.scripts,
    });
  });
}

module.exports = {
  run,
};
