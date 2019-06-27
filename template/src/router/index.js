import routesBase from "./routes-base";
import mvueToolkit from "mvue-toolkit";
import autoRoutes from '../ai/pages/auto-routes';
import asyncRoutes from '../ai/ref-mods/async/routes';
var routersData = mvueToolkit.router.toRealRoutes(routesBase,function (component) {
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
function setComponent(__routes){
  __routes.forEach(route=>{
    if(!route.component){
      route.component=_.assign({},pageIndex);
    }
    if(!_.isEmpty(route.children)){
      setComponent(route.children);
    }
  });
}
setComponent(_routes);
let _autoRoutes=_routes.concat(autoRoutes,asyncRoutes);
//将自动生成的路由附加到根路由上
routersData[0].children=routersData[0].children.concat(_autoRoutes);
let formIndex=require('src/templates/form');
let subPageRelation=require('src/templates/sub-page-relation');
let metaUIRouters=[
  {
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
  },
  {
    meta: {
      requireAuth: true
    },
    name: "defaultCreateForm",
    component: _.assign({},formIndex),
    path: "entities/:entityName/:action",
    beforeEnter: function (to, from, next) {
      propsResolve(to);
      next();
    }
  },
  {
    meta: {
      requireAuth: true
    },
    name: "defaultEditForm",
    component: _.assign({},formIndex),
    path: "entities/:entityName/:id/:action",
    children:[
      {
        name: "defaultSubPage",
        path:":subPage",
        component:require("src/templates/sub-page"),
      },
      {
        name: "defaultSubCreatePage",
        path:":relation/:subPage",
        component:_.assign({},subPageRelation)
      },
      {
        name: "defaultSubRelationPage",
        path:":relation/:subId/:subPage",
        component:_.assign({},subPageRelation),
        children:[
          {
            name: "defaultThirdPage",
            path:":thirdPage",
            component:require("src/templates/third-page"),
          },
          {
            name: "defaultThirdRelationPage",
            path:":relation2/:id3?/:thirdPage",
            component:require("src/templates/third-page-relation.vue"),
            children:[

            ]
          }
        ]
      }
    ],
    beforeEnter: function (to, from, next) {
      propsResolve(to);
      next();
    }
  }
];

_.forEach(metaUIRouters,router=>{
  routersData[0].children.push(router);
});

function appendMetaUIRoute(parentRoute) {
  let cloned=_.cloneDeep(metaUIRouters);
  mvueToolkit.utils.visitTree(cloned,router=>{
    router.name=`${parentRoute.name}-${router.name}`;
  });
  _.forEach(cloned,router=>{
    parentRoute.children.push(router);
  });
}

//动态pages页面
var dyncPage=require('src/templates/dync-page');
export default {
  initRouters() {
    let data = routersData;
    let remoteRoutes = mvueToolkit.router.initRemoteRoutes(dyncPage);
    if (remoteRoutes) {
      _.forEach(remoteRoutes,route=>{
        data[0].children.push(route);
        mvueToolkit.utils.visitTree(route,(item,parent,indexOrKey)=>{
          if(item.name.indexOf("&entities")>-1){
            appendMetaUIRoute(parent);
          }
        });
      });
    }

    data[0].children.push({
      name: "dynamicPage1",
      component: dyncPage,
      path: "pages/:page1",
      children: [
        {
          name: "dynamicPage2",
          component: _.assign({},dyncPage),
          path: ":page2",
          children: [
            {
              name: "dynamicPage3",
              component: _.assign({},dyncPage),
              path: ":page3",
            }
          ]
        }
      ],
      beforeEnter: function (to, from, next) {
        propsResolve(to);
        next();
      }
    });
    return data;
  }
}
