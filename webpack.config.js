"use strict";

var webpack = require('webpack');

// Env configs
var envGlobals = {
  __DEV__: process.env.NODE_ENV != "production",
  __PROD__: process.env.NODE_ENV === "production"
};

var envGlobalsPlugin = new webpack.DefinePlugin(envGlobals);

// The config itself
var webpackConfig = {
  addVendor: function (name, path) {
    this.resolve.alias[name] = path;
    this.module.noParse.push(new RegExp('^' + name + '$'));
  },

  entry: {
    'mango': './src/index.js',
    '01-square': './example/01-square/01-square.js',
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
      mango: __dirname + "/src"
    },
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
      },
      {
        test: /\.(frag|vert)$/,
        loader: 'shader-loader',
      }
    ],
    noParse: [ ]
  },

  glsl: {},
  devtool: "eval-source-map",
  envInfo: envGlobals,
};

webpackConfig.addVendor('gl-matrix',
                        'node_modules/gl-matrix/dist/gl-matrix-min.js');

if (envGlobals.__DEV__) {
  webpackConfig.devServer = {
    contentBase: "./"
  };

  webpackConfig.debug = true;
} else {
  var productionDefinePlugin = new webpack.DefinePlugin({
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

