const portfinder = require("portfinder");
const myServer = require("./my-server");
const devServer = require("./dev-server");

const mono = require("../mono");
const { handlePackages } = require("./entries");
const utils = require("../utils");

const { proxy } = require("../mono.config");

portfinder.basePort = 8080;

module.exports = async function ({ packages, serverType }) {
  // 分析package,获取入口信息
  const configs = await handlePackages(packages);
  if (!configs.success) return;
  // 将每个package的入口展平(1维化)
  const port = await portfinder.getPortPromise();
  const entries = compose(configs.data);

  const serverMap = {
    devServer,
    myServer,
  };
  const server = serverMap[serverType];
  server.run({
    packages,
    entries,
    proxy,
    port,
  });
};

// 将packages格式化为一维的入口数组
function compose(configs) {
  return configs.reduce((list, { module, entries }) => {
    const pages = Object.keys(entries).map((page) => {
      const detail = entries[page];
      return {
        name: `${module}/${page}`,
        entryJs: utils.packages(`${module}/pages/${page}/index.js`),
        template: mono.format({
          pathString: detail.template,
          module,
          name: page,
        }),
        options: {
          styles: detail.styles,
          scripts: [
            ...detail.scripts,
            { body: true, link: `/${module}/${page}.js` },
          ],
        },
      };
    });

    return [...list, ...pages];
  }, []);
}
