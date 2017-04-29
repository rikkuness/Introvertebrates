const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  entry: {
    main: './src/app.js'
  },
  output: {
    filename: 'index_bundle.js',
    path: path.resolve(__dirname, "dist")
  },
  module: {
    loaders: [
    { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: ['es2016'] } } },
    { test: /\.pug$/, loader: 'pug-loader' },
    { test: /\.css$/, loader: 'style-loader!css-loader' },
    { test: /\.(png|jpg|gif)$/, loader: "file-loader?name=img/img-[hash:6].[ext]" },
    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
    { test: /\.(woff|woff2)$/, loader:"url-loader?prefix=font/&limit=5000" },
    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.pug',
      inject: true
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new FaviconsWebpackPlugin('./src/img/favicon.png')
  ]
}