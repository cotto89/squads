/* eslint-disable import/no-extraneous-dependencies */

const merge = require('webpack-merge');
const common = require('./common');

const config = {
    entry: './docs/example/counter/index.js',
    output: {
        path: './docs/example/counter/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './docs/example/counter/',
        inline: true,
        noInfo: true
    }
};

module.exports = merge(common, config);
