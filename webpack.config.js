"use strict";

var webpack = require('webpack');
var envGlobals = {
  __DEV__: process.env.NODE_ENV !== "production"
};

// The config itself
var webpackConfig = {
  entry: {
    '01-square': './example/01-square/01-square.js',
    '02-cubes': './example/02-cubes/02-cubes.js',
    '03-curves': './example/03-curves/03-curves.js',
  },

  output: {
    path: __dirname + '/lib',
    filename: "[name].js",
    chunkFilename: "[id].chunk.js",
    publicPath: '/lib/'
  },

  resolve: {
    extensions: ['', '.js'],
    root: __dirname,
    alias: {
      utea: __dirname + "/src",
      vendor: __dirname + "/vendor",
    },
  },

  plugins: [
    new webpack.DefinePlugin(envGlobals),
    new webpack.optimize.CommonsChunkPlugin("commons.js"),
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          stage: 0,
          optional: ['runtime']
        }
      },
      {
        test: /\.(frag|vert)$/,
        loader: 'shader-loader',
      }
    ],
  },

  glsl: {},
};

if (envGlobals.__DEV__) {
  webpackConfig.debug = true;
  webpackConfig.devtool = "eval-source-map";
} else {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
    })
  );
  webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());
}

module.exports = webpackConfig;

