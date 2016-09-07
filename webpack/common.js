/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';
const isDev = !isProd;

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
                NODE_ENV: JSON.stringify(ENV)
            }
        })
    ]
};

if (isDev) {
    config = merge(config, { devtool: 'inline-source-map' });
}

if (isProd) {
    config = merge(config, {
        module: {
            loader: {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract('style', 'css?minimize!postcss!sass')
            }
        }
    });
}

module.exports = config;
