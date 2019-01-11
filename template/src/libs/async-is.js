import refmods from '../ai/ref-mods/index';
import appCtx from './context';

function unloadedAsyncPath(routePath){
    //当前路由是异步模块库定义的，将找得到对应的异步模块
    let mod = refmods.find(refmod=>{
        let key=refmod.routePrefix;
        return refmod.async&&routePath.indexOf(`/pages/${key}/`)>-1;
    });
    //如果异步模块未加载过，返回异步模块的入口
    if(mod&&!appCtx.getMvueToolkit().moduleManager.isAsyncModLoaded(routePath)){
        return `/async-mods/${mod.routePrefix}`
    }
    return '';
}
export default {
    unloadedAsyncPath
};