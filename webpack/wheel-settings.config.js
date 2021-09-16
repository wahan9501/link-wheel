const path = require("path");
const { commonConfig, distDir, devConfig, prodConfig } = require("./common.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const wheelSettingsConfig = {
  entry: {
    wheelSettings: "./src/wheel-settings/wheel-settings.ts",
  },
  output: {
    path: path.resolve(distDir, "wheel-settings"),
    publicPath: "/wheel-settings",
    filename: "[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/wheel-settings/wheel-settings.html",
      chunks: ["wheelSettings"],
      filename: "wheel-settings.html",
      scriptLoading: "blocking",
    }),
  ],
};

module.exports = wheelSettingsConfig;

module.exports = (env, argv) => {
  let config = { ...commonConfig, ...wheelSettingsConfig };
  if (argv.mode === "development") {
    return { ...config, ...devConfig };
  }

  return { ...config, ...prodConfig };
};
