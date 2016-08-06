/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./common');

const prodConf = {
  module: {
    loader: {
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract('style', 'css?minimize!postcss!sass'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      hash: true,
      template: './template.html',
      title: 'production',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    // ライブラリ間で依存しているモジュールが重複している場合、二重に読み込まないようにする
    new webpack.optimize.DedupePlugin(),
    // ファイルを細かく分析し、まとめられるところはできるだけまとめてコードを圧縮する
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};

module.exports = merge(common, prodConf);
