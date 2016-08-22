# 構成

## JavaScript

* babel
* webpack

## CSS

* webpack
* SCSS
* PostCSS(autoprefixer)
* CSS Modules(css-loader)

# その他

* ESLint
  * Airbnb ruleをbaseにしている
* JavaScriptの整形にbeautify
* webpack dev server
  * HtmlWebpackPluginを使ってtemplate.htmlからindex.htmlを生成
  * HMRは使っていない


# テストツール構成

* mocha
* power-assert
  * babel-preset-power-assert
  * babel-plugin-jsdoc-to-assert
  * babel-plugin-unassert
* karma
  * framework: karma-mocha
  * preprocessor: karma-webpack
  * reporter:
    * karma-mocha-reporter
    * karma-notify-reporter
  * browser
    * karma-phantomjs-launcher
    * karma-chrome-launcher

babel-plugin-jsdoc-to-assertのassertがkarmaとPhantomJSだと通ってしまうので注意。karmaをchromeで走らせた場合、consoleに警告がでる。mocha単体の場合はtestがキチンと落ちる。

[power-assert + babel as a development tool | Web Scratch](http://efcl.info/2016/04/14/espower-babel-is-deprecated/)

[JavaScriptのテスト環境構築(Mocha + power-assert + Karma + babel + webpack) - Qiita](http://qiita.com/cotto89/items/dfa11aa07919bdf73a15)

# React.jsを導入する

```
npm i -D babel-preset-react
```

```
npm i -S react react-dom
```

.babelrc

```
{
  "presets": [
    "es2015",
    "react" // reactを追加
  ],
...
```