const utils = require("../utils");
const config = require("../mono.config");

// 将配置中设置的路径转为路径方法
const alias = Object.keys(config.alias).reduce((map, key) => {
  return {
    ...map,
    [key]: (path) => require("path").join(config.alias[key], path),
  };
}, {});

// 将一个模板路径转为真实路径
// @output/[module]/[name].js -> /output/module-1/detail.js
function format({ pathString, module, name }) {
  pathString = pathString.replace("[module]", module).replace("[name]", name);
  const keys = Object.keys(alias);
  while (keys.length) {
    const key = keys.pop();
    const reg = new RegExp(`^${key}/(.*)`);
    if (reg.test(pathString)) {
      return alias[key](RegExp.$1);
    }
  }
  return pathString;
}

function getDftEntry() {
  let styles = [];
  let scripts = [];

  try {
    const dllManifest = require("../dll").getDllManifest();
    styles = [...(dllManifest.styles || [])];
    scripts = [...(dllManifest.scripts || [])];
  } catch (e) {
    console.warn("若使用了dll中的依赖请先执行 npm run dll 命令");
  }

  return {
    output: "@output/[name]/build.js", // js输出路径
    html: "@view/[module]/[name].html", // html输出路径
    template: "@packages/common/template/template.html", // html模版
    styles, // 加到head中的link标签资源路径 ， 指定template时无效
    scripts, // 加到head中的script标签资源路径
  };
}
module.exports = {
  alias,
  format,
  entry: getDftEntry,
};
