const utils = require("../utils");

// 将数组map为一个新对象,值为末梢为每个item的路径
function mapAlias(directories, road = utils.packages) {
  return directories.reduce((map, p) => {
    return { ...map, [p]: road(p) };
  }, {});
}

module.exports = {
  mapAlias,
};
