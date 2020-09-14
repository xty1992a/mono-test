const utils = require("./utils");
const VueLoader = require("vue-loader/lib/plugin-webpack4");
const PRODUCTION = process.env.NODE_ENV === "production";

module.exports = {
  mode: process.env.NODE_ENV,
  context: utils.root("."),
  entry: {},
  output: {},
  devtool: "source-map",
  resolve: {
    alias: {
      components: utils.packages("common/components"),
    },
    extensions: [".js", ".vue", ".json"],
    // modules: PRODUCTION ? ["node_modules"] : ["nodule_modules", utils.packages("dll")]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: {
          loader: "url-loader",
          // 开发环境一律base64,发布则转移
          options: {
            esModule: false,
            // dev模式下一律直接base64化
            limit: PRODUCTION ? 8192 : undefined,
            // 搬运到每个package下的该目录
            name: "assets/images/[name].[ext]",
            fallback: "file-loader",
          },
        },
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader",
        options: {
          symbolId: "icon-[name]",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader",
          {
            loader: "sass-resources-loader",
            options: {
              resources: utils.packages("common/styles/variable.less"),
            },
          },
        ],
      },
    ],
  },
  externals: PRODUCTION
    ? {
        vue: "SITE_DLL.Vue",
      }
    : {},
  plugins: [new VueLoader()],
};
