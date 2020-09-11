/*
* 查询指定路径下的子路径,返回其中package.json中包含 isBusinessModule 为true的目录
* */
const utils = require('./utils');
const fs = require('fs');
const path = require('path');


module.exports = function (directory) {
  return new Promise(resolve => {
	fs.readdir(directory, function (error, dirs) {
	  if (error) return resolve({success: false, error});
	  try {
		const data = [];
		dirs.forEach(dir => {
		  const pkg = require(path.join(directory, dir, 'package.json'));
		  if (!pkg || !pkg.isBusinessModule) return;
		  data.push(dir);
		});
		resolve({success: true, data});
	  } catch (error) {
		resolve({success: false, error});
	  }
	});
  });
};
