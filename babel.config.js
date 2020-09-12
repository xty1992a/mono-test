module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: "3",
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime",
  ],
};
