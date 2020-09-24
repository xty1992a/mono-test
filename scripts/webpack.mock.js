const { merge } = require("webpack-merge");
const utils = require("./utils");
const base = require("./webpack.base");
const { findPackages } = require("./build/entries");
module.exports = () =>
  new Promise(async (resolve) => {
    const { success, data } = await findPackages(utils.packages("."));
    if (!success) return resolve(null);
    resolve(
      merge(base, {
        resolve: {
          alias: data.reduce((map, key) => ({
            ...map,
            [key]: utils.packages(key),
          })),
        },
      })
    );
  });
