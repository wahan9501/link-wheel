const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    background: "./src/scripts/background.ts",
    wheelSettings: "./src/pages/wheelSettings/wheelSettings.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
    clean: true,
  },
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    static: "./",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/pages/wheel/wheel.html",
      chunks: [],
      filename: "wheel.html",
    }),
    new HtmlWebpackPlugin({
      template: "src/pages/wheelSettings/wheelSettings.html",
      chunks: ["wheelSettings"],
      filename: "wheelSettings.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "src/assets", to: "" }],
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      //   {
      //     test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
      //     type: "asset",
      //   },
    ],
  },
};
