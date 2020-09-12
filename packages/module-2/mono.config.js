const PRODUCTION = process.env.NODE_ENV === "production";

module.exports = function () {
  return {
    entries: {
      detail: {
        html: "@view/Pay/list.html",
        scripts: [
          "https://unpkg.com/eruda@2.3.3/eruda.js"
        ]
      },
    },
  };
};
