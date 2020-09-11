const config = require('./webpack.base');
const merge = require('webpack-merge');
const webpack = require('webpack');

const dftOption = {
  mode: 'development', // 构建模式
  entries: [], 		// 构建入口(及其html构建目标)
}

module.exports = function (option = {}) {
  const {mode, entries} = {...dftOption, ...option}


}
