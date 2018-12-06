var glob = require('glob')
const fs = require('fs')
var path = require('path')
var refmods = require('./refmods');

function writeConfs(pagesPath,files){
    var outputFile=path.join(pagesPath,'auto-page-confs.js')
    var fileJson=JSON.stringify(files,null,'\t').replace(/\"##require_placeholder_begin##/g,'require').replace(/##require_placeholder_end##\"/g,'.default');
    var jsContent=`const confs=${fileJson}`;
    jsContent+=`\r\nexport default confs`
    fs.writeFileSync(outputFile,jsContent)
}
function buildConf(pagesPath,autoConfs,routes,parentPath){
    for (let index = 0; index < routes.length; index++) {
        const ele = routes[index];
        if(ele.meta&&ele.meta.type=="js"){
            let key=ele.path;
            if(parentPath){
                key=`${parentPath}/${key}`;
            }
            let confValue=ele.meta.file.replace(pagesPath,'.');
            autoConfs[key]=`##require_placeholder_begin##('${confValue}')##require_placeholder_end##`;
        }
        if(ele.children){
            buildConf(pagesPath,autoConfs,ele.children,ele.path);
        }
    }
}
function run(refModsRoutes){
    refmods.forEach(refmod => {
        let autoConfs={};
        let refModRoutes=refModsRoutes[refmod.name];
        let pagesPath=`${refmod.path}/src/pages`;
        buildConf(pagesPath,autoConfs,refModRoutes);
        writeConfs(pagesPath,autoConfs);
        console.log(`##引用模块${refmod.name}自动页面配置生成完成--_--##`);
    });
}
module.exports={
    run:run
}
