const path = require("path");
const utils = require("./utils");

const alias = {
  "@output": (f) => path.join(utils.root("output/dist"), f),
  "@view": (f) => path.join(utils.root("output/view"), f),
  "@packages": (f) => path.join(utils.root("packages"), f),
};

function format({pathString, module, name}) {
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


module.exports = {
  alias,
  format,
  entry: () => {
    const dllManifest = require("./dll/manifest.json");

    return {
      output: "@output/[name]/build.js", // js输出路径
      html: "@view/[module]/[name].html", // html输出路径
      template: "@packages/common/template.html", // html模版
      styles: [
        ...dllManifest.styles
      ], // 加到head中的link标签资源路径 ， 指定template时无效
      scripts: [
        ...dllManifest.scripts
      ], // 加到head中的script标签资源路径
    };
  },
};
