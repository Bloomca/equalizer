const webpack = require('webpack');
const path = require('path');

module.exports = {
  // we have to require babel-polyfill first
  // https://babeljs.io/docs/usage/polyfill/
  entry: [
    'babel-polyfill',
    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on none hot updates
    'webpack-dev-server/client?http://localhost:8080',

    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '',
    filename: 'client.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
