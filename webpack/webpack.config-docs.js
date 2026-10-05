/** @type {typeof import("node:path")} */
const path = require("path");
/** @type {typeof import("terser-webpack-plugin")} */
const TerserPlugin = require("terser-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "..", "src"),
  js: path.join(__dirname, "..", "src", "js"),
  style: path.join(__dirname, "..", "src", "style"),
  build: path.join(__dirname, "..", "docs", "dist"),
  docs: path.join(__dirname, "..", "docs"),
};

/** @type {import("webpack").Configuration & { devServer?: import("webpack-dev-server").Configuration }} */
const config = {
  mode: "production",
  entry: [PATHS.docs + "/src/js/entry.tsx"],
  output: {
    path: PATHS.docs + "/dist",
    filename: "main.js",
    library: "reactJsonView",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
        include: [PATHS.js, PATHS.docs],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};

module.exports = config;
