import routesBase from "./routes-base";
import mvueToolkit from "mvue-toolkit";
import autoRoutes from '../pages/auto-routes';
var routersData = mvueToolkit.router.toRealRoutes(routesBase,function (component) {
  if(!_.isString(component)){
    return component;
  }
  return require('src/modules/' + component);
});
var propsResolve = function (router) {
  if (!_.isEmpty(router.params.menu)) {
    router.meta["menu"] = router.params.menu;
  }
};
//合并各个引用模块的路由
let _routes=[];
let mods=mvueToolkit.moduleManager.mods;
mods.forEach(mod => {
  if(mod.pages&&mod.pages.routes){
    _routes=_routes.concat(mod.pages.routes);
  }
});
//每一个页面由于在引用组件无法使用当前应用的模板，所以如果未定义component，附加上去
var pageIndex=require('src/templates/index');
_routes.forEach(route=>{
  if(!route.component){
    route.component=pageIndex;
  }
});
let _autoRoutes=_routes.concat(autoRoutes);
//将自动生成的路由附加到根路由上
routersData[0].children=routersData[0].children.concat(_autoRoutes);
routersData[0].children.push({
  meta: {
    requireAuth: true
  },
  name: "defaultEntityList",
  component: require('src/templates/list'),
  path: "entities/:entityName/list",
  beforeEnter: function (to, from, next) {
    propsResolve(to);
    next();
  }
});
routersData[0].children.push({
  meta: {
    requireAuth: true
  },
  name: "defaultCreateForm",
  component: require('src/templates/form'),
  path: "entities/:entityName/create",
  beforeEnter: function (to, from, next) {
    propsResolve(to);
    next();
  }
});
routersData[0].children.push({
  meta: {
    requireAuth: true
  },
  name: "defaultEditForm",
  component: require('src/templates/form'),
  path: "entities/:entityName/edit/:id",
  beforeEnter: function (to, from, next) {
    propsResolve(to);
    next();
  }
});

export default routersData;
