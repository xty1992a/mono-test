process.env.NODE_ENV = "development";
const path = require("path");
const express = require("express");
const app = express();
const webpack = require("webpack");
const portfinder = require("portfinder");
const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const config = require("./webpack.config.js");

portfinder.basePort = 3000;

// webpack启动必须指定一个入口
const setUpEntry = {
  Index: "./src/views/Index/index.js",
};
config.plugins.push(new webpack.HotModuleReplacementPlugin());
const compiler = webpack({ ...config, entry: setUpEntry });
const entryFinder = require("./entryFinder");

const context = path.resolve(__dirname, "..");

// 开发服务器中间件
const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: "/dist",
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

app.use(devMiddleware);
app.use(hotMiddleware);

entryFinder()
  .then(async (entries) => {
    const port = await portfinder.getPortPromise();
    entries.forEach(handleEntry);

    app.listen(port, function () {
      console.log(`server listen on http://localhost:${port}`);
    });

    // 主页入口
    app.get("/", function (req, res) {
      // 应用单入口插件
      res.send(
        entries
          .map(
            ({ name }) =>
              `<a href="/${name.replace(/\/index/, "")}">${name.replace(
                /\/index/,
                ""
              )}</a>`
          )
          .join("<br>")
      );
    });
  })
  .catch((e) => {
    console.log(e);
  });

const entryFlagMap = {
  Index: true,
};

// 添加路由并将对应的入口加入webpack编译
function handleEntry({ name, entryJs, template }) {
  const path = name.replace(/\/index/, "");
  app.get(`/${path}`, function (req, res) {
    if (!entryFlagMap[name]) {
      const entry = [
        `webpack-hot-middleware/client?noInfo=true&reload=true&name=${name}`,
        entryJs,
      ];
      console.log("新增编译入口: ", name);
      new MultiEntryPlugin(context, entry, name).apply(compiler);
      // 强制重新构建一次，不用调用多次，后续的触发由 webpack 自己 hot reload
      devMiddleware.invalidate();
      entryFlagMap[name] = true;
    }

    res.send(
      template.replace(
        "</body>",
        `<script src="/dist/${name}.js"></script>
</body>`
      )
    );
  });
}
