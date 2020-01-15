import 'vuescroll/dist/vuescroll.css';
import 'mvue-design/dist/index.css';
import 'vue-multiselect/dist/vue-multiselect.min.css' ;
//这几个工具类必须在最前面引用，不得删除和更改
import  $lodash from './lodash_loader';
require('libs/zepto');

import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);
import vuescroll from 'vuescroll';
Vue.use(vuescroll);
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import context from 'libs/context';
context.setVue(Vue);

import autoPageConfs from '../ai/pages/auto-page-confs';
context.setAutoPageConfs(autoPageConfs);

import mvueToolkit from 'mvue-toolkit';
context.setMvueToolkit(mvueToolkit);

//应用依赖的模块，通过moduleManager添加进来
import mvueComponents from 'mvue-components';
mvueToolkit.moduleManager.add(mvueComponents);
import mvueCore from 'mvue-core';
import settings from './settings';
//重写用户部门相关的配置
mvueCore.context.setSettings(settings);
mvueToolkit.moduleManager.add(mvueCore);

import newStore from '../store';

import asyncIs from './async-is';

var qs=require("qs");

//初始化路由数据，并初始化请求拦截器(登录校验)
function initRouter(){
  var routesData = require('../router/index').default;
  var router = new VueRouter({
    routes: routesData.initRouters()
  });
  //将路由对象设置到全局上下文中
  context.setRouter(router);
  var session=context.getMvueToolkit().session;
  router.beforeEach(function(to, from, next) {
    if(context.inIframe()){
      to.query._hide="left,top";
    }
    session.doFilter(to,from,next);
  });
  //拦截异步模块请求
  router.beforeEach(function(to, from, next) {
    let unloadedAsyncPath=asyncIs.unloadedAsyncPath(to.path);
    if(unloadedAsyncPath){
      next(unloadedAsyncPath);
    }else{
      next();
    }
  });
  context.getMvueToolkit().moduleManager.addRouterInterceptor(router,{appCtx:context});
  router.afterEach(function (transition) {
    // console.log('-----------------Router Start');
    // console.log(transition);
    // console.log('-----------------Router End');
    if(window.parent && window.parent!=window){
        context.resizeParentIframeHeight();
    }
  });
}
//Vue应用启动
function doStart(){
  initRouter();
  var App = require('../app.vue').default;
  var vueApp=new Vue({
    el: '#app',
    router: context.getRouter(),
    store: context.getStore(),
    template: '<App/>',
    components: {App},
    created: function () {
      let qmark=window.location.href.lastIndexOf('?'),params={};
      if(qmark>0){
        params=qs.parse(window.location.href.substr(qmark+1));
        if(this.$route.name=='ssoclient'&&params.returnUrl){
          qmark=params.returnUrl.lastIndexOf('?');
          params=qs.parse(params.returnUrl.substr(qmark+1));
        }
      }
      context.setIframeId(this.$route.query['_iframeId']||params['_iframeId']);
    }
  });
  context.setCurrentVue(vueApp);
  context.getMvueToolkit().moduleManager.initAfterAppStarted(context);
}
//对外暴露的Vue应用启动函数：先获取应用配置，然后初始化模块，加载元数据信息，最终启动应用
function startApp() {
  //加载应用配置
  mvueToolkit.config.loadServerConfig().then(()=>{
    Promise.all([
      import(/* webpackChunkName: "iview" */'iview')
    ]).then(function ([iview]) {
      Vue.use(iview);
      Vue.use(mvueToolkit,{
        baseUrlForResource:mvueToolkit.config.getApiBaseUrl(),
        appSettings:settings
      });

      var globalComponentsInit=require('./global_components').default;
      globalComponentsInit(Vue);

      var store = newStore(Vuex);
      context.setStore(store);

      context.getMvueToolkit().moduleManager.initAfterAppCtxCreated(context);
      //加载元数据信息
      context.getMvueCore().metaBase.initMetabase(null,true).then(()=>{
        doStart(store);
      });

    }).catch(function (err) {
      console.error('应用启动失败,错误详情: ', err);
    });
  });
}

export default{
    startApp:startApp
}
