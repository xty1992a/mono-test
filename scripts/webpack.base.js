const utils = require('./utils');
const VueLoader = require("vue-loader/lib/plugin-webpack4");
const PRODUCTION = process.env.NODE_ENV === "production";

module.exports = {
  mode: process.env.NODE_ENV,
  context: utils.root('.'),
  entry: {},
  output: {
    path: utils.root('dist')
  },
  resolve: {
    alias: {
      'site': utils.root('packages')
	}
  },
  module: {
    rules: [
	  {
	    test: /\.js$/,
		loader: 'babel-loader'
	  },
	  {
	    test: /\.vue$/,
		loader: 'vue-loader'
	  },
	  {
		test: /\.(jpe?g|png|gif)$/,
		use: {
		  loader: "url-loader",
		  // 开发环境一律base64,发布则转移
		  options: {
			esModule: false,
			limit: PRODUCTION ? 8192 : undefined,
			name: "[name].[ext]",
		  },
		},
	  },
	  {
	    test: /\.less/,
		loader: [
			'style-loader',
			'postcss-loader',
			'less-loader',
		]
	  }
	]
  },
  plugins: [
  	new VueLoader()
  ]
}
