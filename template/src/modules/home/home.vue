<style lang="less">
  @import "./home.less";
</style>
<template>
  <div class="layout" v-bind:class="{'layout-header-hide': hide('top') , 'layout-hide-menu' :hide('left') }">
    <m-header v-if="!hide('top')" :title="title" :logo="logo">
    </m-header>
    <Layout :class="'ivu-layout-has-sider'" class="layout-content">
      <m-menu v-if="!hide('left') && menuLoaded" v-bind="menu" ref="navMenuRef" @on-menu-selected="handleOnMenuSelected"></m-menu>
      <Content>
        <b-router-tab></b-router-tab>

        <div class="bvue-page-tabcontent">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </Content>
    </Layout>
  </div>
</template>
<script>
  import { menuService,productService } from "mvue-components";
  import  mvueCore from 'mvue-toolkit';
  export default {
    data: function () {
      return {
        menu: {
          menus: []
        },
        productResouce:productService(),
        errorRouter:{
          name:"error403",
          query:null
        },
        menuLoaded:false,
        title: "品高云平台",
        logo:"static/images/logo.png"
      }
    },
    mounted: function () {
      const self = this;
      if (!_.isEmpty(mvueCore.config.getConfigVal("settings.app.title"))) {
        self.title = mvueCore.config.getConfigVal("settings.app.title");
        document.title = self.title;
      }
      if (!_.isEmpty(mvueCore.config.getConfigVal("settings.app.logo"))) {
        self.logo = mvueCore.config.getConfigVal("settings.app.logo");
      }
    },
    computed:{
      flatNavUrls(){
        let _menus={};
        if(this.menu&&this.menu.menus){
          this.mapAll(_menus,this.menu.menus);
        }
        return _menus;
      }
    },
    methods: {
      mapAll(_menus,originMenus){
        _.each(originMenus,m=>{
          m.url?_menus[m.url]=true:'';
          if(m.children){
            this.mapAll(_menus,m.children);
          }
        })
      },
      loadMenu(){
        let self=this;
        return new Promise((resolve,reject)=>{
          menuService().published({orderby: "displayOrder asc"},{onError:function (error) {
              return self.onDeny(error);
            }}).then(function ({data}) {
            self.prepareMenu(data);
            resolve();
          });
        });
      },
      hide(type) {
        var types = this.$route.query._hide;
        if (!types) {
          return false;
        }
        types = types.split(",");
        return _.includes(types, type);
      },
      isAutoPages() {
        var key = this.$route.path;
        if (_.startsWith(key, "/pages/") || _.startsWith(key, "/entities/")) {
          return true;
        }
        return false;
      },
      handleOnMenuSelected() {
        this.$store.commit("core/clearGridStatus");
      },
      prepareMenu(rawMenu) {
        this.menuLoaded=true;
        if (_.isArray(rawMenu)) {
          this.menu = {
            menus: rawMenu
          };
        } else {
          this.menu = rawMenu;
        }
      },
      /**
       * 根据配置，自动选择默认主页
       */
      autoIndexPage() {
        if (this.$route.path === "/") {
          var indexUrl = mvueCore.config.getConfigVal("settings.app.index");
          var indexRouter = null;
          if (!_.isEmpty(indexUrl)) {
            if (indexUrl.indexOf("#") >= 0) {
              indexUrl = indexUrl.substring(indexUrl.indexOf("#") + 1);
            }
            indexRouter = {path: indexUrl};
            this.$router.push(indexRouter);
          } else {
            var hasMenu = false;
            if (this.menu.menus && this.menu.menus.length > 0) {
              hasMenu = true;
            }
            if (!hasMenu) {
              indexRouter = {name: "tutorial"};
              this.$router.push(indexRouter);
            }
          }
        }else if(this.$route.name==this.errorRouter.name) {
          if(this.$route.query["_url"]){
            this.$router.push({path:this.$route.query["_url"]});
          }
        }
      },
      onDeny(error){
        var response=error.response;
        if(!response){
          return false;
        }
        if(response.status==403){
          if(this.$route.name==this.errorRouter.name){
            return true;
          }
          this.errorRouter["query"]={
            "_hide":"left",
            "_url":this.$route.fullPath
          }
          this.$router.push(this.errorRouter);
          return true;
        }
        return false;
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm=>{
        vm.loadMenu().then(()=>{
            vm.autoIndexPage();
        });
      });
    },
    beforeRouteUpdate (to, from, next) {
      next();
    }
  }
</script>
