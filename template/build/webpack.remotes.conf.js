var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var nodeExternals = require('webpack-node-externals')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.lib.env

var webpackConfig = {
  mode: 'development',
  target: 'web',
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  //entry在build-remotes脚本中加入，这里先不配置
  output: {
    path: config.lib.assetsRoot,
    filename: path.posix.join('remotes','[name].js'),
    library: '[name]',
    libraryTarget: 'umd',
    globalObject: 'self'
  },
  module: {
    rules: [
      {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig
      },
      {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src'), resolve('test')]
      },
      {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
      },
      {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
      },
      {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
      }
    ]
  },
  devtool: config.lib.productionSourceMap ? '#source-map' : false,
  externals: [nodeExternals({
      //需要打包到bundle中的特殊node_modules模块：非dependencies默认包含的模块（平台工程没有引入的模块）
      whitelist: [/^@babel/,/^regenerator-runtime/]
  })],
  plugins: [
    new VueLoaderPlugin()
  ]
}
Array.prototype.push.apply(webpackConfig.module.rules,utils.styleLoaders({
    sourceMap: config.lib.productionSourceMap
  })
)

if (config.lib.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.lib.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.lib.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
