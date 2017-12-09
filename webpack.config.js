const webpack = require("webpack");
const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = ({ dev }) => {
  const devEntries = dev
    ? [
        // For hot style updates
        "webpack/hot/dev-server",

        // The script refreshing the browser on none hot updates
        "webpack-dev-server/client?http://localhost:8080"
      ]
    : [];

  const outputPath = path.resolve(__dirname, dev ? "build" : "dist");

  const devPlugins = [new webpack.HotModuleReplacementPlugin()];

  const buildPlugins = [
    new ExtractTextPlugin("styles/styles.css"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ];

  const cssLoader = dev
    ? [
        "style-loader",
        "css-loader",
        {
          loader: "postcss-loader",
          options: { plugins: [autoprefixer] }
        }
      ]
    : ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader!postcss-loader"
      });
  return {
    // we have to require babel-polyfill first
    // https://babeljs.io/docs/usage/polyfill/
    entry: []
      .concat("babel-polyfill")
      .concat(devEntries)
      .concat("./src/index.js"),
    output: {
      path: outputPath,
      publicPath: "",
      filename: "client.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: ["babel-loader"]
        },
        {
          test: /\.css$/,
          use: cssLoader
        },
        {
          test: /\.sass$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: `[name]__[local]___[hash:base64:5]`
              }
            },
            {
              loader: "sass-loader",
              options: {
                indentedSyntax: true
              }
            }
          ]
        }
      ]
    },
    plugins: dev ? devPlugins : buildPlugins
  };
};
