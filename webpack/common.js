/* eslint-disable import/no-extraneous-dependencies, no-console */
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

/* NODE_ENV */
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const isDev = !isProd;

console.info(`
:--------- process.env.NODE_ENV: ${NODE_ENV} ---------:
`);

let config = {
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: { cacheDirectory: true }
            },
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
            }
        ]
    },
    postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
    plugins: [
        new WebpackNotifierPlugin({ title: 'Webpack' }),
        new ExtractTextPlugin('bundle.css'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        })
    ]
};

if (isDev) {
    config = merge(config, { devtool: 'inline-source-map' });
}

if (isProd) {
    config = merge(config, {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        ]
    });
}

module.exports = config;
