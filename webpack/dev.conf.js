const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./common.js');

const devConf = {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'dist/',
    inline: true,
    noInfo: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      hash: true,
      template: './template.html',
      env: 'dev',
    }),
  ],
};

module.exports = merge(common, devConf);
