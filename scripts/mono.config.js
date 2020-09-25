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
    ...platProxy(["/Business", "/api"], "https://bkchina.m.yunhuiyuan.cn"),
  },
};

function platProxy(list, target) {
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
