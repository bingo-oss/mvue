var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.remotes.conf')

var utils = require('./utils')
var chokidar = require('chokidar');
var glob = require('glob');
const fs = require('fs')
const pagesRelativePath='src/remotes';
const pagesPath=path.join(__dirname,`../${pagesRelativePath}`);
var changedQueue=[];
function smartRun(i){
    //console.log("--------"+i);
    //如果数据变化，先往变化队列推一条数据
    changedQueue.push(true);
    //记录当前变化队列的长度
    var length=changedQueue.length;
    //console.log(length+"-------")
    setTimeout(function(){
        //再次计算变化队列的长度，如果和之前的长度一致则表示等待时间到了，可以做相关操作了；
        //如果不一致说明数据还在变化，等到数据不再持续变化了再继续执行操作
        var _length=changedQueue.length;
        if(_length===length){
            changedQueue=[];
            run();
        }
    },500);
}
/**
 * 监听remote-vues目录文件夹变化，重新生成组件
 */
function doWatch(){
    var vueWatcher = chokidar.watch(pagesPath+'/**/*.@(vue|js)', {ignoreInitial: true ,persistent: true});
    vueWatcher
        .on('change', path => smartRun(0))
        .on('add', path => smartRun(1))
        .on('unlink', path => smartRun(4));
    var dirWatcher = chokidar.watch(pagesPath+'/**', {ignoreInitial: true ,persistent: true});
    dirWatcher
        .on('addDir', path => smartRun(2))
        .on('unlinkDir', path => smartRun(3));
}
var watched=false;
function run(devMode){
  //检测src/remotes目录是否存在，不存在的话不做任何事情
  let remotesPathExists=fs.existsSync(pagesPath);
  if(!remotesPathExists){
    return;
  }
  if(devMode&&!watched){
    watched=true;
    doWatch()
  }
  return buildRemoteVues();
}
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
function buildRemoteVues(){
  var spinner = ora('building remote components...')
  spinner.start()
  //'@.vue'
  let entries=utils.getEntries(resolve('./src/remotes/**'),function(entry){
    return entry.endsWith('@.vue');
  },function(entry){
    let basePath=entry.substring(entry.indexOf('src/remotes')+'src/remotes/'.length,entry.lastIndexOf('@.vue'));
    let paths=basePath.split('/');
    let name= paths.join('-');
    return name;
  });
  webpackConfig.entry=entries;
  return new Promise((resolve, reject) => {
    rm(path.join(config.lib.assetsRoot, 'remotes'), err => {
      if (err) throw err
      webpack(webpackConfig, function (err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n\n')
        console.log(chalk.cyan('  Build remote vue components complete.\n'))
        resolve();
      })
    })
  });
}
module.exports={
    run:run
}
