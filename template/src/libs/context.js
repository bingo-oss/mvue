var cachedContext={
    mvueCore:null,
    autoPageConfs:null,
    mvueComponents:null,  
    router:null,
    mvueToolkit:null,
    Vue:null,//全局Vue模块，例如Vue.use
    currentVue:null,//应用的根Vue对象，例如currentVue.$route
    iframeId:null,
    store:null
}

function getPageHeight() {
  var count=0;
  var h=getHeight();
  return new Promise((resolve,reject) => {
    innerResolve(resolve,reject);
  });

  function  innerResolve(resolve,reject) {
    window.setTimeout(function () {
      count++;
      var sh = getHeight();
      console.log("count:" + count + ",height:" + sh);
      if (sh == h || count > 3) {
        resolve(h);
      }
      else {
        h = sh;
        innerResolve(resolve,reject);
      }
    }, 300);
  }

  function  getHeight() {
    var docHeight=document.body.scrollHeight;
    var conHeight=0;
    var height=Math.max(docHeight,conHeight);
    return height;
  }
}

export default {
  setRouter(router) {
    cachedContext.router = router;
  },
  setIframeId: function (iframeId) {
    cachedContext.iframeId = iframeId;
  },
  postMessageToParent: function (data, targetOrigin) {
    var eventData = _.assign(data, {
      iframeId: cachedContext.iframeId
    });
    if (_.isUndefined(targetOrigin)) {
      targetOrigin = "*";
    }
    window.parent.postMessage(eventData, targetOrigin);
  },
  resizeParentIframeHeight: function () {
    var _this = this;
    getPageHeight().then(function (height) {
      var resizeTo = height + 50;
      var data = {
        action: "resize",
        params: {height: resizeTo}
      };
      console.log("resize parent iframe height to :" + resizeTo);
      _this.postMessageToParent(data);
    });
  },
  getRouter() {
    return cachedContext.router;
  },
  setMvueToolkit(mvueToolkit) {
    cachedContext.mvueToolkit = mvueToolkit;
  },
  getMvueToolkit() {
    return cachedContext.mvueToolkit;
  },
  setVue(Vue) {
    cachedContext.Vue = Vue;
  },
  getVue() {
    return cachedContext.Vue;
  },
  setStore(store){
      cachedContext.store=store;
  },
  getStore(){
      return cachedContext.store;
  },
  setCurrentVue(currentVue) {
    cachedContext.currentVue=currentVue;
  },
  getCurrentVue() {
    return cachedContext.currentVue;
  },
  info: function (opts) {
    var vue = this.getCurrentVue();
    if (vue.$Message) {
      if (opts && opts.noTimeout) {
        vue.$Message.info(opts);
      } else {
        setTimeout(function () {
          vue.$Message.info(opts);
        }, 300);
      }
    }
  },
  success: function (opts) {
    var vue = this.getCurrentVue();
    if (_.isString(opts)) {
      opts = {content: opts}
    }
    opts = _.extend({
      title: "操作成功"
    }, opts);
    if (vue.$Message) {
      if (opts && opts.noTimeout) {
        vue.$Message.success(opts);
      } else {
        setTimeout(function () {
          vue.$Message.success(opts);
        }, 300);
      }
    }
  },
  warning: function (opts) {
    var vue = this.getCurrentVue();
    opts = _.extend({
      title: "警告信息"
    }, opts);
    if (vue.$Modal) {
      if (opts && opts.noTimeout) {
        vue.$Modal.warning(opts);
      } else {
        setTimeout(function () {
          vue.$Modal.warning(opts);
        }, 300);
      }
    }
  },
  error: function (opts) {
    var vue = this.getCurrentVue();
    opts = _.extend({
      title: "错误信息"
    }, opts);
    if (vue.$Modal) {
      if (opts && opts.noTimeout) {
        vue.$Modal.error(opts);
      } else {
        setTimeout(function () {
          vue.$Modal.error(opts);
        }, 300);
      }
    }
  },
  confirm: function (opts) {
    var vue = this.getCurrentVue();
    opts = _.extend({
      title: "确认信息"
    }, opts);
    if (vue.$Modal) {
      if (opts && opts.noTimeout) {
        vue.$Modal.confirm(opts);
      } else {
        setTimeout(function () {
          vue.$Modal.confirm(opts);
        }, 300);
      }
    }
  },
  setMvueCore(mvueCore){
      cachedContext.mvueCore=mvueCore;
  },
  getMvueCore(){
      return cachedContext.mvueCore;
  },
  setMvueComponents(_mvueComponents){
      cachedContext.mvueComponents=_mvueComponents;
  },
  getMvueComponents(){
      return cachedContext.mvueComponents;
  },
  setAutoPageConfs(autoPageConfs){
      cachedContext.autoPageConfs=autoPageConfs;
  },
  getAutoPageConfs(){
      return cachedContext.autoPageConfs;
  }
}
