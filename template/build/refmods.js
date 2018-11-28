//`npm run dev --modules=mvue-components-idm,mvue-components-idm2`
var refmods = process.env.npm_config_modules;
if(refmods){
    refmods=refmods.split(',')
}else{
    refmods=[];
}
if(refmods.length){
    console.log('##当前应用引用了以下模块##');
    console.log(refmods);
}
module.exports=refmods;