var glob = require('glob')
const fs = require('fs')
var path = require('path')
const aiBasePath = path.join(__dirname,'../src/ai/pages');
function writeConfs(files){
    var outputFile=path.join(aiBasePath,'auto-page-confs.js')
    var fileJson=JSON.stringify(files,null,'\t').replace(/\"##require_placeholder_begin##/g,'require').replace(/##require_placeholder_end##\"/g,'.default');
    var jsContent=`const confs=${fileJson}`;
    jsContent+=`\r\nexport default confs`
    fs.writeFileSync(outputFile,jsContent)
    console.log("##自动页面配置生成完成--_--##");
}
function buildConf(autoConfs,routes,parentPath){
    for (let index = 0; index < routes.length; index++) {
        const ele = routes[index];
        if(ele.meta&&ele.meta.type=="js"){
            let key=ele.path;
            if(parentPath){
                key=`${parentPath}/${key}`;
            }
            autoConfs[key]=`##require_placeholder_begin##('${ele.meta.file}')##require_placeholder_end##`;
        }
        if(ele.children){ 
            let pPath;  
            if (!parentPath) {
                pPath = ele.path;  
            } else {
                pPath = parentPath + '/' + ele.path;  
            } 
            buildConf(autoConfs,ele.children, pPath); 
        }
    }
}
function run(routes){
    var autoConfs={};
    buildConf(autoConfs,routes);
    writeConfs(autoConfs);
}
module.exports={
    run:run
}