const PRODUCTION = process.env.NODE_ENV === "production";

module.exports = function () {
  return {
    entries: {
      "detail": {
        html: "@view/Pay/list.html"
      },
    }
  };
};