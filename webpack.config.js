const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = ({ dev }) => {
  const devEntries = dev
    ? [
      // For hot style updates
      'webpack/hot/dev-server',

      // The script refreshing the browser on none hot updates
      'webpack-dev-server/client?http://localhost:8080'
    ] : [];

  const outputPath = path.resolve(__dirname, dev ? 'build' : 'dist');

  const devPlugins = [
    new webpack.HotModuleReplacementPlugin()
  ];

  const buildPlugins = [
    new ExtractTextPlugin('styles/styles.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ];

  const cssLoader = dev
    ? 'style-loader!css-loader!postcss-loader'
    : ExtractTextPlugin.extract(
        'style-loader',
        'css-loader!postcss-loader');
  return {
    // we have to require babel-polyfill first
    // https://babeljs.io/docs/usage/polyfill/
    entry: []
      .concat('babel-polyfill')
      .concat(devEntries)
      .concat('./src/index.js'),
    output: {
      path: outputPath,
      publicPath: '',
      filename: 'client.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel'
        },
        {
          test:   /\.css$/,
          loader: cssLoader
        },
        {
          test: /\.json$/,
          loader: 'json'
        }
      ]
    },
    plugins: dev ? devPlugins : buildPlugins,
    postcss: [
      autoprefixer,
      require('postcss-modules')({
        generateScopedName: '[name]__[local]___[hash:base64:4]',
      })
    ]
  }
};
