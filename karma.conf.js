// Karma configuration
// Generated on Mon Jun 06 2016 14:24:22 GMT+0900 (JST)
// [Karma - Spectacular Test Runner for Javascript](https://karma-runner.github.io/0.13/index.html)

const webpackConf = require('./webpack/test.conf.js');
module.exports = function karma(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'test/**/*.test.js',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.test.js': ['webpack'],
    },

    webpack: webpackConf,
    webpackMiddleware: {
      // webpack-dev - middleware configuration
      // webpackのログを消す
      noInfo: true,
      quiet: true,
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // [karma-mocha-reporter](https://www.npmjs.com/package/karma-mocha-reporter)
    reporters: ['mocha', 'notify'],

    // [karma-notify-reporter](https://www.npmjs.com/package/karma-notify-reporter)
    notifyReporter: {
      reportEachFailure: true, // Default: false, Will notify on every failed sepc
      reportSuccess: true, // Default: true, Will notify when a suite was successful
    },

    client: {
      captureConsole: true,
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
    // config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    // autoWatchまたはsingleRunのどちらかがtrueじゃないとtestが走らない
    autoWatch: true,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'], // またはChrome

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};
