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
  });
  server.listen(port, function () {
    console.log("server start ");
  });
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
