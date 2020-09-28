# 简介

本项目旨在构建一个 monorepo-like 的前端多页项目.

## 命令

0. dll `npm run dll`  
   实际执行了`node ./bin/mn.js dll`.打包公共依赖

1. build `npm run build`  
   **执行本命令之前,请先执行 dll 命令**  
   实际调用了`node ./bin/mn.js pack --build`,即 cli 的 pack 命令下的 build 模式.  
   启动命令后,选择要编译的`package`,cli 会依次使用 webpack 打包每个`package`.

2. dev `npm run dev`  
   实际调用了`node ./bin/mn.js pack --dev`,即 cli 的 pack 命令下的 dev 模式.  
   命令将启动一个`express`服务器,并将所有`package`的入口加入路由.
   当访问某个路径时,将该路径对应的入口加入 webpack 编译流程.

### 命令释疑

> dll 的作用
> 该命令类似`webpack`的`DllPlugin`插件,它将打包`packages`下的`dll`
> 并生成清单,后续的打包会检查该清单,将清单中的依赖作为`externals`排除.

> cli 如何搜寻 packages?  
> 搜寻 packages 下的目录,过滤出其中包含`package.json`,且`package.json`中`isBusinessModule`字段为`true`的目录,将其视为一个`package`

> cli 如何搜寻入口?  
> 默认搜寻一个 package 下的 pages 目录,该目录下的每个文件夹都视作一个入口
> 你还可以添加`mono.config.js`,来指定入口

## 配置

### package 下的 mono.config.js

默认情况下,每个 package 都会按照`/scripts/mono/index`中`getDftEntry`指定的配置生成 entry.
如果在 package 下的添加了`mono.config.js`,将使用该文件提供的配置与默认配置合并生成该 package 的 entry.
可配置项如下

|     属性 |     类型 |                                   默认值 |                                                     描述 |
| -------: | -------: | ---------------------------------------: | -------------------------------------------------------: |
|   output |   string |                "@output/[name]/build.js" |                                              js 输出路径 |
|     html |   string |             "@view/[module]/[name].html" |                                            html 输出路径 |
| template |   string | "@packages/common/template/template.ejs" |                                                html 模版 |
|   styles | string[] |                               dll.styles | 加到 head 中的 link 标签资源路径 ， 指定 template 时无效 |
|  scripts | string[] |                              dll.scripts |                       加到 head 中的 script 标签资源路径 |

其中
