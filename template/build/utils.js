var path = require('path')
// glob模块，用于读取webpack入口目录文件
var glob = require('glob');
var config = require('../config')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.assetsLibPath = function (_path) {
  return path.posix.join(config.lib.assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  function generateLoaders (loader, loaderOptions) {
    let loaders = []
    if (loader) {
        loaders = [{
            loader: loader + '-loader',
            options: Object.assign({}, loaderOptions, {
                sourceMap: options.sourceMap
            })
        }]
    }

    if (options.extract) {
        let extractLoader = {
            loader: MiniCssExtractPlugin.loader,
            options: {}
        }
        return [extractLoader, 'css-loader'].concat(loaders)
    } else {
        return ['vue-style-loader', 'css-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

exports.getEntries = function (globPath,filterFunc,nameFunc) {
  var entries = {}
  /**
   * 读取src目录,并进行路径裁剪
   */
  glob.sync(globPath).forEach(function (entry) {
    /**
     * path.basename 提取出用 ‘/' 隔开的path的最后一部分，除第一个参数外其余是需要过滤的字符串
     * path.extname 获取文件后缀
     */
      // var basename = path.basename(entry, path.extname(entry), 'router.js') // 过滤router.js
      // ***************begin***************
      // 当然， 你也可以加上模块名称, 即输出如下： { module/main: './src/module/index/main.js', module/test: './src/module/test/test.js' }
      // 最终编译输出的文件也在module目录下， 访问路径需要时 localhost:8080/module/index.html
      // slice 从已有的数组中返回选定的元素, -3 倒序选择，即选择最后三个
    let valid=true;
    if(filterFunc) {
      valid=filterFunc(entry);
    }
    if(!valid){
      return;
    }
    var moduleName='';
    if(nameFunc){
      moduleName=nameFunc(entry);
    }else{
      var tmp = entry.split('/').splice(-3)
      moduleName = tmp.slice(1, 2);
    }
    // ***************end***************
    entries[moduleName] = entry
  });
  // 获取的主入口如下： { main: './src/module/index/main.js', test: './src/module/test/test.js' }
  return entries;
}
