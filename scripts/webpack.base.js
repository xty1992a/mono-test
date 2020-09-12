const utils = require("./utils");
const VueLoader = require("vue-loader/lib/plugin-webpack4");
const PRODUCTION = process.env.NODE_ENV === "production";

module.exports = {
  mode: process.env.NODE_ENV,
  context: utils.root("."),
  entry: {},
  output: {
    path: utils.root("dist")
  },
  devtool: "source-map",
  resolve: {
    alias: {},
    // modules: PRODUCTION ? ["node_modules"] : ["nodule_modules", utils.packages("dll")]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: {
          loader: "url-loader",
          // 开发环境一律base64,发布则转移
          options: {
            esModule: false,
            limit: PRODUCTION ? 8192 : undefined,
            name: "[name].[ext]",
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
        ]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      },
    ]
  },
  externals: PRODUCTION ? {
    vue: "SITE_DLL.Vue"
  } : {},
  plugins: [
    new VueLoader()
  ]
};
