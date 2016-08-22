/* eslint-disable import/no-extraneous-dependencies */

const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: './public',
    filename: '[name].bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
      },
    ],
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
  plugins: [
    new WebpackNotifierPlugin({ title: 'Webpack' }),
    new ExtractTextPlugin('bundle.css'),
  ],
};
