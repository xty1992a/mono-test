const utils = require("./utils");
const VueLoader = require("vue-loader/lib/plugin-webpack4");
const PRODUCTION = process.env.NODE_ENV === "production";
const IS_DLL = process.env.BUILD_TYPE === "dll";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { mapAlias } = require("./webpack-helper/useAlias");

const plugins = [new VueLoader()];

if (PRODUCTION) {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
      chunkFilename: "chunks/[name]_[contenthash:8].css",
    })
  );
}

const styleLoader = PRODUCTION ? MiniCssExtractPlugin.loader : "style-loader";
const cssLoaders = [styleLoader, "css-loader", "postcss-loader"];
// common中的别名
const commonAlias = () => {
  const common = (p) => utils.packages(`common/${p}`);
  return {
    common: common("."),
    ...mapAlias(["components", "scripts"], common),
  };
};

module.exports = {
  mode: process.env.NODE_ENV,
  context: utils.root("."),
  entry: {},
  output: {},
  devtool: "source-map",
  resolve: {
    alias: {
      ...commonAlias(),
    },
    extensions: [".js", ".vue", ".json"],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        exclude: /node_modules/,
        options: {
          loaders: {
            css: cssLoaders,
            less: [...cssLoaders, "less-loader", useGlobalVariable()],
          },
          hotReload: true,
        },
      },
      {
        test: /\.css$/,
        use: cssLoaders,
      },
      {
        test: /\.less$/,
        use: [...cssLoaders, "less-loader", useGlobalVariable()],
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
  externals: PRODUCTION && !IS_DLL ? require("./dll").getExternals() : {},
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
