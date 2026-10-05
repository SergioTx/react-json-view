/** @type {typeof import("node:path")} */
const path = require("path");
/** @type {typeof import("terser-webpack-plugin")} */
const TerserPlugin = require("terser-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "..", "src"),
  js: path.join(__dirname, "..", "src", "js"),
  style: path.join(__dirname, "..", "src", "style"),
  build: path.join(__dirname, "..", "dist"),
};

/** @type {import("webpack").Configuration & { devServer?: import("webpack-dev-server").Configuration }} */
const config = {
  mode: "production",
  entry: [PATHS.src + "/main.ts"],
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
    },
  },
  output: {
    path: PATHS.build,
    filename: "main.js",
    library: "reactJsonView",
    libraryTarget: "umd",
    globalObject: "this",
  },
  plugins: [],
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
        include: [PATHS.src],
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
  node: {
    global: false, // Prevents webpack from breaking CSP, see https://github.com/microlinkhq/react-json-view/issues/76
  },
};

module.exports = config;
