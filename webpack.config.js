const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  publicPath: '/dist/',
};

const common = {
  entry: {
    index: `${PATHS.src}/index.js`,
  },
  output: {
    path: PATHS.dist,
    publicPath: PATHS.publicPath,
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
      {
        test: /\.md$/,
        loader: 'raw',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
  plugins: [
    new WebpackNotifierPlugin({ title: 'Webpack' }),
    new ExtractTextPlugin('bundle.css'),
  ],
};

const buildConf = {
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      hash: true,
      template: './template.html',
      env: 'dev',
    }),
  ],
};

const devConf = {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'dist/',
    inline: true,
    noInfo: true,
  },
};

const testConf = {
  devtool: 'inline-source-map',
};

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
      title: 'sample',
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


// npm start || run ** の引数に応じてconfigを返す
function config() {
  const TARGET = process.env.npm_lifecycle_event;
  let conf;

  console.log(`target: ${TARGET}`);

  switch (TARGET) {
    case 'build':
      conf = merge(common, buildConf);
      break;
    case 'test':
      conf = merge(common, testConf);
      break;
    case 'start':
    case !TARGET:
      conf = merge(common, devConf);
      break;
    case 'prod':
      conf = merge(common, prodConf);
      break;
    default:
      return false;
  }
  return conf;
}

module.exports = config();
