const express = require("express");
const webpack = require("webpack");
const {merge} = require("webpack-merge");
const portfinder = require("portfinder");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const LazyCompiler = require("./lazy-compiler");
const ejs = require("ejs");

const alias = require("../alias");
const {handlePackages} = require("./entries");
const base = require("../webpack.base.js");
const utils = require("../utils");
const lazyCompiler = new LazyCompiler();

portfinder.basePort = 3000;

const devWebpackConfig = {
  entry: {
    [Date.now()]: utils.root("scripts/build/useless.js")
  },
  output: {
    path: utils.root("output"),
    chunkFilename: "chunks/[id].js"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
// 启动webpack
const compiler = webpack(merge(base, devWebpackConfig));

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

const lazyMiddleware = lazyCompiler.middleware(compiler, devMiddleware, {
  coverIndex: true, // 将入口展示到首页
});
// endregion

// 启动服务器
const app = express();
app.use(devMiddleware);
app.use(hotMiddleware);
app.use(lazyMiddleware);

app.set("views", utils.root("output/view"));
app.set("view engine", "ejs");
app.use(express.static(utils.root("output")));
app.engine("html", ejs.renderFile);

module.exports = async function (packages) {
  const configs = await handlePackages(packages);
  if (!configs.success) return;
  const port = await portfinder.getPortPromise();
  const entries = compose(configs.data);

  // 将入口存入懒编译器
  entries.forEach(entry => lazyCompiler.addEntryItem(entry));
  // 暂时处理分包导致的路径不正确的问题，待修复
  const redirectMiddleware = chunkRedirectMiddleware(configs.data.map(it => it.module));
  app.use(redirectMiddleware);

  app.listen(port, function () {
    console.log(`server listen on http://localhost:${port}`);
  });

  // 主页入口
  app.get("/", lazyCompiler.indexMiddleware);

};


// todo 调整publicPath，最终去掉该中间件
// 将module-2/0.js转为/0.js的中间件
function chunkRedirectMiddleware(list) {
  const regs = list.map(key => new RegExp(`/${key}(.*)`));
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
  return configs.reduce((list, {module, entries}) => {
    const pages = Object.keys(entries).map(page => {
      const detail = entries[page];
      return {
        name: `${module}/${page}`,
        entryJs: utils.packages(`${module}/pages/${page}/index.js`),
        template: alias.format({
          pathString: detail.template,
          module,
          name: page
        }),
        options: {
          styles: detail.styles,
          scripts: [...detail.scripts, {body: true, link: `/${module}/${page}.js`}],
        }
      };
    });

    return [
      ...list,
      ...pages
    ];
  }, []);
}