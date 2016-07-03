const common = require('./common.js');
const merge = require('webpack-merge');

const testConf = {
  devtool: 'inline-source-map',
};

module.exports = merge(common, testConf);
