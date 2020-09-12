const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

function resolvable(fn) {
  return async function () {
    try {
      const data = await promisify(fn).apply(this, arguments);
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };
}

module.exports = {
  root: (p) => path.join(__dirname, "..", p),
  packages: (p) => path.join(__dirname, "../packages", p),
  access: (file) => resolvable(fs.access)(file, fs.constants.F_OK),
  readdir: (directory) => resolvable(fs.readdir)(directory),
  copy: (o) => JSON.parse(JSON.stringify(o)),
};
