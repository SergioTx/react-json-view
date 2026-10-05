/** @param {import('@babel/core').ConfigAPI} api */
module.exports = (api) => {
  const isTest = api.env("test");

  return {
    presets: [
      ["@babel/preset-env", { modules: isTest ? "commonjs" : false }],
      ["@babel/preset-react", { runtime: "automatic" }],
      "@babel/preset-typescript",
    ],
    plugins: ["react-html-attrs", isTest && "istanbul"].filter(Boolean),
  };
};
