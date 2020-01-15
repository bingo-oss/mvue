var refmodsRegister = require('./refmods-register');
refmodsRegister.run();
var autoRouter=require('./auto-router');
autoRouter.run(false);
var autoBuildRemoteVues=require('./build-remotes');
process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

function build(callback){
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
    callback&&callback();
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
}
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  var buildRemotesPromise=autoBuildRemoteVues.run(false);
  //等待远程组件编译完成再继续构建
  if(buildRemotesPromise){
    buildRemotesPromise.then(function(){
      build(function(){
        rm(path.join(config.lib.assetsRoot, 'remotes'),err=>{
          if (err) {
            console.log(chalk.yellow('  自动清理dist/remotes目录失败，请手工删除\n'));
          }
        });
      });
    })
  }else{
    build();
  }
})
