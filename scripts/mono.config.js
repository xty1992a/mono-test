/*
 * 该配置是编译时配置,请勿在此配置webpack
 * */
const utils = require("./utils");

module.exports = {
  // 这个alias是为编译时提供的模板路径,请勿添加webpack别名
  alias: {
    "@output": utils.root("output/dist"),
    "@view": utils.root("output/view"),
    "@packages": utils.root("packages"),
  },
  proxy: {
    "/users": {
      target: "http://localhost:3000",
      changeOrigin: true,
      secure: false,
    },
    ...mapProxy(["/Business", "/api"], "http://bkchina.m.yunhuiyuan.cn"),
  },
  // 默认entry
  entry() {
    let styles = [];
    let scripts = [];

    try {
      const dllManifest = require("./dll/utils").getDllManifest();
      styles = [...(dllManifest.styles || [])];
      scripts = [...(dllManifest.scripts || [])];
    } catch (e) {
      console.warn("若使用了dll中的依赖请先执行 npm run dll 命令");
    }

    return {
      html: "@view/[module]/[name].html", // html输出路径
      template: "@packages/common/template/template.ejs", // html模版
      styles, // 加到head中的link标签资源路径 ， 指定template时无效
      scripts, // 加到head中的script标签资源路径
    };
  },
};

function mapProxy(list, target) {
  return list.reduce((map, key) => {
    return {
      ...map,
      [key]:
        typeof target === "string"
          ? {
              target: target,
              changeOrigin: true,
              secure: false,
            }
          : target,
    };
  }, {});
}
