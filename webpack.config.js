const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const { webpack } = require("webpack");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "test";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public/root.css'),
            to: 'root.css' // Output path in dist
          },
          {
            from: path.resolve(__dirname, 'src/importmap.json'),
            to: 'importmap.json'
          }
        ]
      }),
       new webpack.DefinePlugin({
      'process.env.REACT_APP_AUTH_API': JSON.stringify(process.env.REACT_APP_AUTH_API)
    }),
    ],
  });
};
