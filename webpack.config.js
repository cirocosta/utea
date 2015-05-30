/*jslint node: true */
"use strict";

var path = require('path');
var webpack = require('webpack');

// Env configs
var envGlobals = {
  __DEV__: process.env.NODE_ENV != "production" && process.env.NODE_ENV != "staging",
};

var envGlobalsPlugin = new webpack.DefinePlugin(envGlobals);

// The config itself
var webpackConfig = {
  addVendor: function (name, path) {
    this.resolve.alias[name] = path;
    this.module.noParse.push(new RegExp('^' + name + '$'));
  },
  entry: {
    mango: __dirname + '/src/index.js',
    example: __dirname + '/src/example.js'
  },
  output: {
    path: __dirname + '/lib',
    filename: "[name].js"
  },
  externals: { },
  resolve: {
    extensions: ['', '.js'],
    root: __dirname,
    alias: {
    }
  },
  plugins: [
    envGlobalsPlugin,
    function() {
      this.plugin("done", function(stats) {
        stats = stats.toJson();
        console.error(JSON.stringify({
          assetsByChunkName: stats.assetsByChunkName
        }));
      });
    },
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?stage=0',
        exclude: /(node_modules|bower_components)/
      }
    ],
    noParse: [ ]
  },
  devtool: "eval-source-map",
  envInfo: envGlobals,
};

webpackConfig.addVendor('gl-matrix', 'node_modules/gl-matrix/dist/gl-matrix-min.js');

if (envGlobals.__DEV__) {
  // var sourceMapPlugin = new webpack.EvalSourceMapDevToolPlugin("//# sourceMappingURL=[url]", "[resource-path]?[hash]");

  webpackConfig.devServer = {
    contentBase: "./lib"
  };

  webpackConfig.debug = true;
  // webpackConfig.plugins.push(sourceMapPlugin);
}else{
  var productionDefinePlugin = new webpack.DefinePlugin({
    // Set NODE_ENV as production for react production optimizations
    "process.env": { NODE_ENV: JSON.stringify("production") }
  });

  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({output: {comments: false}}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    productionDefinePlugin
  );
}

module.exports = webpackConfig;

