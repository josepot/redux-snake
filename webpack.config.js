const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: ['./src/index.js'],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },

  plugins: [new webpack.NoErrorsPlugin()],

  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
    ],
  },

};
