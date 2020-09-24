const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlPlugin = require("html-webpack-plugin");
const Server = require("webpack-dev-server");

const { mapPackageAlias } = require("../webpack-helper/useAlias");
const base = require("../webpack.base.js");
const utils = require("../utils");

function run(options) {
  const { packages, entries, proxy, port } = options;
  const alias = mapPackageAlias(packages);
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
      app.use(htmlRedirectMiddleware(entries, server.middleware));
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
      entries
        .map((it) => `<a href="/${it.name}.html">${it.name}</a>`)
        .join("<br>")
    );
  };
}

// 将 /module-1/home --> /module-1/home.html
function htmlRedirectMiddleware(entries, devMiddleware) {
  const regs = entries.map(({ name }) => new RegExp(`/(${name})$`));
  return function (req, res, next) {
    const [path, query] = req.originalUrl.split("?");
    if (/\.js/.test(path)) return next();
    for (let i = 0; i < regs.length; i++) {
      if (regs[i].test(path)) {
        return res.redirect(`/${RegExp.$1}.html${query ? "?" + query : ""}`);
      }
    }
    next();
  };
}

function createEntry(entries) {
  return entries.reduce((map, item) => {
    return {
      ...map,
      [item.name]: item.entryJs,
    };
  }, {});
}

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
