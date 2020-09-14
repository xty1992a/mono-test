# 简介

本 package 聚合全局公共依赖

## 添加依赖

在项目根目录安装添加依赖后,需要更新本 package

1. 更新 index.js,引入并暴露依赖,这个包将被挂载 window 上全局暴露
2. 更新`package.json`中的`exportLibrary`与上面一致
