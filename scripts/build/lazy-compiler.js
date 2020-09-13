const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");
const utils = require("../utils");


/*
预先将入口存入懒编译器
当访问某个入口时，将入口加入webpack编译流程。
然后返回入口所带模版
* */

class LazyCompiler {
  constructor() {
    this.entryMap = {};// 入口字典
    this.entryRegList = [];
    this.indexMiddleware = this.indexMiddleware.bind(this);
  }

  // 添加一个待编译的入口配置
  addEntryItem(item) {
    const {name} = item;
    this.entryMap[name] = {
      config: item,
      hadCompile: false
    };
    this.entryRegList.push({test: new RegExp(name), name});
  }

  middleware(compiler, devMiddleware, options = {}) {
    return (req, res, next) => {
      let path = req.originalUrl.split("?")[0];
      if (/\.(js|html)$/.test(path)) return next();
      const list = [...this.entryRegList];
      let name = "";
      while (list.length) {
        const reg = list.shift();
        if (reg.test.test(path)) {
          name = reg.name;
          break;
        }
      }
      if (!name) return next();

      const {template, options} = this.addEntryToWebpack(name, compiler, devMiddleware);

      res.render(template, {
        htmlWebpackPlugin: {options}
      });

    };
  }

  indexMiddleware(req, res, next) {
    res.send(
      this.entryRegList
        .map(
          ({name}) =>
            `<a href="/${name}">${name}</a>`
        )
        .join("<br>")
    );
  }

  // 将一个入口加入webpack编译流程
  addEntryToWebpack(name, compiler, devMiddleware) {
    const entry = this.entryMap[name];
    const config = entry.config;
    if (entry.hadCompile) return config;
    const webpackEntry = [
      `webpack-hot-middleware/client?noInfo=true&reload=true&name=${name}`,
      config.entryJs,
    ];
    console.log("新增编译入口: ", name);
    const context = utils.root(".");
    new MultiEntryPlugin(context, webpackEntry, name).apply(compiler);
    // 强制重新构建一次，不用调用多次，后续的触发由 webpack 自己 hot reload
    devMiddleware.invalidate();
    entry.hadCompile = true;
    return config;
  }
}

module.exports = LazyCompiler;

/*
entry item
    {
        "name": "module-2/detail",
        "entryJs": "/Users/redbuck/code/redbuck/mono-test/packages/module-2/pages/detail/index.js",
        "template": "/Users/redbuck/code/redbuck/mono-test/packages/common/template.html",
        "options": {
            "styles": [],
            "scripts": [
                "/dist/dll/SITE_DLL_2020_09_12.js",
                "https://unpkg.com/eruda@2.3.3/eruda.js",
                {
                    "body": true,
                    "link": "/module-2/detail.js"
                }
            ]
        }
    },
*/