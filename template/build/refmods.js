//`npm run dev --modules=mvue-components-idm,mvue-components-idm2`
const fs = require('fs')
var path = require('path')
var refModeNames = process.env.npm_config_modules;
var refModules=[];
if(refModeNames){
  refModeNames=refModeNames.split(',')
}else{
  refModeNames=[];
}
if(refModeNames.length){
    refModeNames.forEach(refmod => {
      var modulePath=getModulePath(refmod);
      if(modulePath==null){
        console.log(`##模块${refmod}不存在##`);
        return;
      }
      refModules.push({
        name:refmod,
        path:modulePath
      });
      console.log(`##加载模块${refmod}:${modulePath}##`);
    });
}

function getModulePath(moduleName){
  var currentPath=path.resolve(__dirname, '..');
  var max=20,i=0;
  var existModulePath=null;
  while (i<max) {
    i++;
    var modulePath = path.join(currentPath, `node_modules/${moduleName}`);
    try {
      fs.accessSync(modulePath, fs.constants.R_OK);
      existModulePath = modulePath.replace(/\\/g,"/");
      break;
    } catch (err) {
      var parentPath = path.resolve(currentPath, '..');
      if (parentPath == currentPath) {
        break;
      }
      currentPath = parentPath;
    }
  }
  return existModulePath;
}
module.exports=refModules;
