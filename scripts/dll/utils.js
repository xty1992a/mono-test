// 获取清单
// build时,将dll加入模板中
function getDllManifest() {
  return require("./manifest.json");
}

module.exports = {
  getDllManifest,
};
