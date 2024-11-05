const webpack = require("webpack");
const path = require("path");
const Dotenv = require("dotenv-webpack");
module.exports = {
  entry: {
    main: "./frontend/index.jsx",
  },
  plugins: [
    new webpack.DefinePlugin({
      __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/, // Add this rule for CSS files
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    fallback: {
      stream: require.resolve("stream-browserify"),
      vm: require.resolve("vm-browserify"),
      path: require.resolve("path-browserify"),
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      os: require.resolve("os-browserify/browser"),
    },
  },

  output: {
    path: path.resolve(__dirname, "compiled"),
    publicPath: "/",
    filename: "bundle.js",
    libraryTarget: "umd", // Ensure compatibility
  },
  externals: {
    axios: "axios",
  },

  target: "web", // Webpack 5 may require this in your environment

  mode: "development",
};
