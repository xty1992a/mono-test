// TODO 测试用,待删

const { merge } = require("webpack-merge");
const base = require("./webpack.base");
const utils = require("./utils");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = merge(base, {
  mode: "production",
  entry: {
    detail: utils.packages("module-2/pages/detail/build.js"),
  },
  output: {
    path: utils.root("output/dist/module-2"),
    filename: "[name].js",
  },
  plugins: [
    new HtmlPlugin({
      filename: utils.root("output/view/Pay/list.html"),
      template: utils.packages("common/template.html"),
      chunks: ["detail"],
    }),
  ],
});
