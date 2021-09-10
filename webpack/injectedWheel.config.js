const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
var InlineChunkHtmlPlugin = require("inline-chunk-html-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const preprocessConfig = {
  mode: "development",
  entry: {
    // injecteWheel: "./src/common/wheel.scss",
  },
  output: {
    path: path.resolve(__dirname, "../dist/injectedWheel"),
    publicPath: "/",
    filename: "[name].css",
    clean: true,
    // compareBeforeEmit: false,
  },
  // plugins: [
  //   // new MiniCssExtractPlugin(),
  //   new HtmlWebpackPlugin({
  //     template: "src/common/wheel.html",
  //     chunks: [], // This html will be injected to user content page by our content/background script. Any inline/ref script will not be executed.
  //     filename: "wheel.html",
  //   }),
  //   new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
  // ],
  plugins: [new MiniCssExtractPlugin("a.css")],
  module: {
    // rules: [
    //   {
    //     test: /\.s[ac]ss$/i,
    //     use: ["sass-loader"],
    //   },
    //   // {
    //   //   test: /\.html$/i,
    //   //   loader: "html-loader",
    //   // },
    //   // {
    //   //   test: /\.svg$/i,
    //   //   type: "asset/source",
    //   // },
    // ],
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
};

const injectedWheelConfig = {
  entry: {
    injecteWheel: "./src/injectedWheel/injectedWheel.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
  },
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    static: "./",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "src/common/wheel.html",
      chunks: [], // This html will be injected to user content page by our content/background script. Any inline/ref script will not be executed.
      filename: "wheel.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "src/assets", to: "" }],
    }),
  ],
  resolve: {
    extensions: [".ts"],
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
        oneOf: [
          {
            test: /wheelDev\.css/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
          {
            use: ["style-loader", "css-loader"],
          },
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.svg$/i,
        type: "asset/source",
      },
    ],
  },
};

module.exports = preprocessConfig;
