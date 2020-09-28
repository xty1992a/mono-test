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

module.exports = {
  alias,
  format,
};
