/*
 * 全局代理
 * */

module.exports = {
  "/users": {
    target: "http://localhost:3000",
    changeOrigin: true,
    secure: false,
  },
};
