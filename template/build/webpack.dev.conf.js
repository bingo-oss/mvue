var utils = require('./utils')  // 引入一些小工具
var webpack = require('webpack')
const path = require('path')
var config = require('../config')
var merge = require('webpack-merge')  //配置合并插
var baseWebpackConfig = require('./webpack.base.conf') // 加载 webpack.base.conf

module.exports = merge(baseWebpackConfig, {
  mode:'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: !config.dev.cssSourceMap })
  },
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: false,
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  devtool: config.dev.devtool
})
