const utils = require("./utils");
const VueLoader = require("vue-loader/lib/plugin-webpack4");
const PRODUCTION = process.env.NODE_ENV === "production";
const dll = require("./dll");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const plugins = [new VueLoader()];

if (PRODUCTION) {
  console.log("add css extract plugin");
  plugins.push(
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
      chunkFilename: "chunks/[name]_[contenthash:8].css",
    })
  );
}

const styleLoader = PRODUCTION ? MiniCssExtractPlugin.loader : "style-loader";

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
        options: {
          loaders: {
            css: [styleLoader, "css-loader"],
            less: [
              styleLoader,
              "css-loader",
              "postcss-loader",
              "less-loader",
              useGlobalVariable(),
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [styleLoader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          styleLoader,
          "css-loader",
          "postcss-loader",
          "less-loader",
          useGlobalVariable(),
        ],
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
    ],
  },
  externals: PRODUCTION ? dll.getExternals() : {},
  plugins,
};

function useGlobalVariable() {
  return {
    loader: "sass-resources-loader",
    options: {
      resources: utils.packages("common/styles/variable.less"),
    },
  };
}
