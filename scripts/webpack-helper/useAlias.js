const utils = require("../utils");

// 将各package映射为全局别名
function mapPackageAlias(packages) {
  return packages.reduce((map, p) => {
    return { ...map, [p]: utils.packages(p) };
  }, {});
}

module.exports = {
  mapPackageAlias,
};
