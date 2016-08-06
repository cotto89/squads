/* eslint-disable import/no-extraneous-dependencies */

const common = require('./common');
const merge = require('webpack-merge');

const testConf = {
  devtool: 'inline-source-map',
};

module.exports = merge(common, testConf);
