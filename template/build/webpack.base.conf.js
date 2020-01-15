var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')

var CopyWebpackPlugin = require('copy-webpack-plugin')

var HtmlWebpackPlugin = require('html-webpack-plugin')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

const fs = require('fs')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
//用来屏蔽某些vue模板解析，方便开发迁移调试
var _excludes=[];
var copyOpts=[
  {
    from: path.resolve(__dirname, '../static/config'),
    to: 'config',
    ignore: ['.*']
  },
  {
    from: path.resolve(__dirname, '../static/images'),
    to: 'static/images',
    ignore: ['.*']
  }
];
let distRemotesPath=path.resolve(__dirname, '../dist/remotes');
let remotesPath=path.resolve(__dirname, '../src/remotes');
//检测src/remotes目录是否存在，存在的话开启复制远程组件功能
let remotesPathExists=fs.existsSync(remotesPath);
if(remotesPathExists){
  //然后检测是否有remotes目录编译的远程组件，如果没有先创建它，避免CopyWebpackPlugin组件报错
  let distRemotesPathExists=fs.existsSync(distRemotesPath);
  if(!distRemotesPathExists){
    fs.mkdirSync(distRemotesPath,{recursive:true});
  }
  copyOpts.push({
    from: distRemotesPath,
    to: 'static/remotes',
    ignore: ['.*']
  });
}
var webpackConfig={
  //入口文件
  entry: {main:'./src/main.js'},
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        iview: {
          name: "iview",
          priority: 20,
          test: /[\\/]node_modules[\\/]iview[\\/]/
        },
        vendor: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial"
        }
      },
    }
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.scss', '.css','.less'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      src : resolve('src'),
      libs : resolve('src') + '/libs',
      style : resolve('src') + '/style',
      services : resolve('src') + '/services',
      modules : resolve('src') + '/modules'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: _excludes,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        exclude: _excludes,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: _excludes,
        options: {
          limit: 10000,
          publicPath:process.env.NODE_ENV === 'production'?'../img/':utils.assetsPath('img/'),
          outputPath:utils.assetsPath('img/'),
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        exclude: _excludes,
        loader: 'url-loader',
        options: {
          limit: 10000,
          publicPath:process.env.NODE_ENV === 'production'?'../fonts/':utils.assetsPath('fonts/'),
          outputPath:utils.assetsPath('fonts/'),
          name: '[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    //webpack在require动态路径时会加载整个目录的文件作为模块，这个插件可以限定要引入的模块
    new webpack.ContextReplacementPlugin(
      /codemirror[\/\\]mode$/,
      /javascript/
    ),
    new webpack.ContextReplacementPlugin(
      /codemirror[\/\\]theme$/,
      /eclipse/
    ),
    new CopyWebpackPlugin(copyOpts)
  ]
}
if (config.build.bundleAnalyzerReport) {
  //非常酷的插件，自动浏览器预览最后生成的js boundles的内容
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static'
  }));
}
var conf = {
  filename: 'index.html',
  template: 'index.html', //模板路径
  inject: true
}
// 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
module.exports = webpackConfig;
