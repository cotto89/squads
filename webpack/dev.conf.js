/* eslint-disable import/no-extraneous-dependencies */

const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./common');

const devConf = {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'public',
    inline: true,
    noInfo: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      hash: true,
      template: './template.html',
      env: 'dev',
      title: 'dev',
    }),
  ],
};

module.exports = merge(common, devConf);
