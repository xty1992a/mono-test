const fse = require("fs-extra");
const utils = require("../utils");

async function writePkgJson(name) {
  const pkg = {
    name: name,
    version: "1.0.0",
    description: "",
    main: "",
    scripts: {},
    isBusinessModule: true,
    keywords: [],
    author: "",
    license: "ISC",
    dependencies: {},
  };
  return fse.writeJson(utils.packages(`${name}/package.json`), pkg, {
    spaces: 4,
  });
}

async function moveTemplate(name) {
  return fse.copy(utils.root("scripts/create/package"), utils.packages(name), {
    overwrite: true,
  });
}

async function createPackage(options) {
  const { packageName } = options;
  try {
    await moveTemplate(packageName);
    await writePkgJson(packageName);
    await createPage(options);
  } catch (e) {
    console.log(e);
  }
}

async function createPage({ packageName, pageName }) {
  try {
    const page = (p) => utils.packages(`${packageName}/pages/${pageName}/${p}`);
    await fse.copy(
      utils.root("scripts/create/page/index.js"),
      page("index.js")
    );
    const file = await fse.readFile(
      utils.root("scripts/create/page/index.vue"),
      "utf-8"
    );

    await fse.writeFile(page("index.vue"), file.replace(/\[name\]/g, pageName));
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  createPackage,
};
