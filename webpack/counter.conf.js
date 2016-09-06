/* eslint-disable import/no-extraneous-dependencies */

const merge = require('webpack-merge');
const common = require('./common');

const config = {
    entry: './docs/example/counter/index.js',
    output: {
        path: './docs/example/counter/',
        filename: 'bundle.js'
    }
};

module.exports = merge(common, config);
