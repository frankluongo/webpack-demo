const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    app: "./src/index.js",
    print: "./src/print.js",
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new HtmlWebpackPlugin({
      title: "Output Management",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    // This makes sure that files are served correctly when using the custom server
    publicPath: "/",
  },
};
