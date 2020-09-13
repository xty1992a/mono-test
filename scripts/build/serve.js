const express = require("express");
const webpack = require("webpack");
const {merge} = require("webpack-merge");
const portfinder = require("portfinder");
const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const ejs = require("ejs");

const alias = require("../alias");
const {handlePackages} = require("./entries");
const base = require("../webpack.base.js");
const utils = require("../utils");

portfinder.basePort = 3000;

const now = Date.now();
const entryFlagMap = {
  [now]: true,
};
const setUpEntry = {
  [now]: utils.root("scripts/build/useless.js"),
};

// 启动webpack
const compiler = webpack(merge(base, {
  entry: setUpEntry,
  output: {
    path: utils.root("output"),
    chunkFilename: "chunks/[id].js"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}));
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

// todo 调整publicPath，最终去掉该中间件
// 将module-2/0.js转为/0.js的中间件
function chunkRedirectMiddleware(list) {
  console.log(list);
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

// 首页返回可访问的页面汇总
function serverIndexPage(list) {
  return function (req, res) {
    // 应用单入口插件
    res.send(
      list
        .map(
          ({name}) =>
            `<a href="/${name.replace(/\/index/, "")}">${name.replace(
              /\/index/,
              ""
            )}</a>`
        )
        .join("<br>")
    );
  };
}

// 启动服务器
const app = express();
app.use(devMiddleware);
app.use(hotMiddleware);

app.set("views", utils.root("output/view"));
app.set("view engine", "ejs");
app.use(express.static(utils.root("output")));
app.engine("html", ejs.renderFile);

// 添加路由并将对应的入口加入webpack编译
function handleEntry({name, entryJs, template, options}) {
  app.get(`/${name}`, function (req, res) {
    if (!entryFlagMap[name]) {
      const entry = [
        `webpack-hot-middleware/client?noInfo=true&reload=true&name=${name}`,
        entryJs,
      ];
      console.log("新增编译入口: ", name);
      const context = utils.root(".");
      new MultiEntryPlugin(context, entry, name).apply(compiler);
      // 强制重新构建一次，不用调用多次，后续的触发由 webpack 自己 hot reload
      devMiddleware.invalidate();
      entryFlagMap[name] = true;
    }

    res.render(template, {
      htmlWebpackPlugin: {options}
    });

//     res.send(
//       template.replace(
//         "</body>",
//         `<script src="/dist/${name}.js"></script>
// </body>`
//       )
//     );
  });
}

module.exports = async function (packages) {
  const configs = await handlePackages(packages);
  if (!configs.success) return;
  const entries = compose(configs.data);
  // console.log(JSON.stringify(entries, null, 4));

  app.use(chunkRedirectMiddleware(configs.data.map(it => it.module)));

  const port = await portfinder.getPortPromise();

  entries.forEach(handleEntry);

  app.listen(port, function () {
    console.log(`server listen on http://localhost:${port}`);
  });

  // 主页入口
  app.get("/", serverIndexPage(entries));

};


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
          scripts: [...detail.scripts, {body: true, link: `/dist/${module}/${page}.js`}],
        }
      };
    });

    return [
      ...list,
      ...pages
    ];
  }, []);
}