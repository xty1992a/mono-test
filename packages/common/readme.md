## 简介

本 package 提供公共资源,请勿放置私有资源

1. public  
   在 dev 时将作为`express`静态路径.  
   在 build 时,其下所有文件将被整体复制到 output 中.  
   因此该目录下的资源,可以直接使用`/`开头引用,**不要**通过 import 或 require 的方式引入

2. styles  
   其中的 variable.less 会被所有 less 文件载入,内部定义的变量全局可用

3. template  
   为`html-webpack-plugin`提供模板,支持`ejs`语法,编译时,会注入`htmlWebpackPlugin`,可以从上面获取一些信息.  
   页面也可以自己指定模板,但应参考此处实现.
