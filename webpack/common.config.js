const path = require("path");

module.exports = {
  distDir: path.resolve(__dirname, "../dist"),
  commonConfig: {
    output: {
      // path: path.resolve(__dirname, "../dist"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".ts", ".js"],
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
          test: /\.svg$/i,
          type: "asset/source",
        },
      ],
    },
  },
  devConfig: {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
      hot: true,
    },
  },
  prodConfig: {
    mode: "production",
  },
};
