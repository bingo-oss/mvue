var glob = require('glob');
const fs = require('fs')
var path = require('path')
var modsDef = require('../config/mods-def');
const aiBasePath = path.join(__dirname,'../src/ai');
const basePath = path.join(aiBasePath,`ref-mods`)
const importPrefix = '../../../';

function writeModsDef(){
    let contentArray=[];
    modsDef.forEach(mod => {
        let c=`{
        name:'${mod.name}',//全局唯一，用来import的npm模块库名称
        routePrefix:'${mod.routePrefix}',//全局唯一，用来唯一标志模块库的访问地址前缀，也是模块库的较短唯一标志
        async:${mod.async}
    }`;
        contentArray.push(c);
    });
    let modsDefContent=`const refmods=[
    ${contentArray.join(',\r\n    ')}
];
export default refmods;
    `
    let modsDefFile=path.join(basePath,`index.js`);
    fs.writeFileSync(modsDefFile,modsDefContent);
}
function writeSyncMod(syncMods){
    let scripts=[];
    syncMods.forEach(mod => {
        scripts.push(`import ${mod.routePrefix} from '${mod.name}';`)
        scripts.push(`context.getMvueToolkit().moduleManager.addSync('${mod.routePrefix}',${mod.routePrefix});`)
    });
    var jsContent=`import context from '${importPrefix}libs/context';
${scripts.join('\r\n')}
export default {}`;
    var outputFile=path.join(basePath,`sync/index.js`);
    fs.writeFileSync(outputFile,jsContent);
    console.log("##同步模块注册逻辑已生成--_--##");
}
function writeAsyncMod(asyncMods){
    //1 写初次导入异步模块的入口路由组件
    //先做清理，删除旧的vue文件
    glob.sync(path.join(basePath,`async/*.vue`)).forEach(f=>{
        fs.unlinkSync(f);
    });
    asyncMods.forEach(mod => {
        let key=mod.routePrefix;
        let asyncVueFile=path.join(basePath,`async/${key}.vue`);
        let vueContent=`<template>
    <div></div>
</template>
<script>
import homeBase from '${importPrefix}router/home-base'; 
import appCtx from '${importPrefix}libs/context';
import pageIndex from '${importPrefix}templates/index';
export default {
    created(){
        import(/* webpackChunkName: "${mod.name}" */'${mod.name}')
        .then(({default:mod})=>{
            appCtx.getMvueToolkit().moduleManager.addAsync('${mod.routePrefix}',mod,appCtx,homeBase,pageIndex);
            this.$router.go(-1);
        });
    }
}
</script>
        `;
        fs.writeFileSync(asyncVueFile,vueContent);
    });
    //2 写异步路由定义文件
    var asyncRouteFile=path.join(basePath,`async/routes.js`);
    let routesArray=[];
    asyncMods.forEach(mod => {
        let key=mod.routePrefix;
        let route=`{
        name: 'async-mods-${key}',
        component: ()=> import(/* webpackChunkName: "${mod.name}-entry" */'./${key}.vue'),
        path: '/async-mods/${key}'
    }`;
        routesArray.push(route);
    });
    let routesContent=`const refmodsRoutes=[
    ${routesArray.join(',\r\n    ')}
];
export default refmodsRoutes;
    `;
    fs.writeFileSync(asyncRouteFile,routesContent);
    //3 写异步导入所有异步模块import-all.js
    var asyncImportAllFile=path.join(basePath,`async/import-all.js`);
    var loadFunc=`return Promise.resolve();`;
    if(asyncMods.length>0){
        let loadFuncImportArray=[],loadFuncParamsArray=[],loadFuncBodyArray=[];
        asyncMods.forEach(mod => {
            let key=mod.routePrefix;
            loadFuncImportArray.push(`import(/* webpackChunkName: "${mod.name}" */'${mod.name}')`);
            loadFuncParamsArray.push(`\{default:${key}\}`);
            loadFuncBodyArray.push(`if(!appCtx.getMvueToolkit().moduleManager.isAsyncModLoaded('${key}')){
                appCtx.getMvueToolkit().moduleManager.addAsync('${key}',${key},appCtx,homeBase,pageIndex);
            }`);
        });
        loadFunc=`return new Promise((resolve,reject)=>{
        Promise.all([
        ${loadFuncImportArray.join(',\r\n        ')}
        ]).then(([${loadFuncParamsArray.join(',')}])=>{
            ${loadFuncBodyArray.join('\r\n            ')}
            resolve();
        },()=>{reject();});
    });`
    }
    var importAllContent=`import homeBase from '${importPrefix}router/home-base'; 
import appCtx from '${importPrefix}libs/context';
import pageIndex from '${importPrefix}templates/index';
function load(){
    ${loadFunc}
}
export default {
    load
}
    `;
    fs.writeFileSync(asyncImportAllFile,importAllContent);

    console.log("##异步模块注册逻辑已生成--_--##");
}
function run(){
    let syncMods=[],asyncMods=[];
    let aiBasePathExists=fs.existsSync(aiBasePath);
    if(!aiBasePathExists){
        fs.mkdirSync(aiBasePath);
    }
    let basePathExists=fs.existsSync(basePath);
    if(!basePathExists){
        fs.mkdirSync(basePath);
        fs.mkdirSync(path.join(basePath,'async'));
        fs.mkdirSync(path.join(basePath,'sync'));
    }
    writeModsDef();
    modsDef.forEach(mod => {
        if(mod.async){
            asyncMods.push(mod);
        }else{
            syncMods.push(mod);
        }
    });
    writeSyncMod(syncMods);
    writeAsyncMod(asyncMods);
}
module.exports={
    run:run
}
