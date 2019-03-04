<template>
  <div>
    <meta-page v-if="this.pageSettings!=null"
               :header="header"
               :pageSettings="pageSettings">
    </meta-page>
    <div v-if="errorObj.has" class="bvue-page-body" >
      <Card>
        <Alert type="warning"  show-icon style="margin: 20px 200px">
          页面错误
          <template slot="desc">
            {{ errorObj.message}}
          </template>
        </Alert>
      </Card>
    </div>
  </div>
</template>
<script>
  import mvueCore from "mvue-core";
  import pathToRegexp from 'path-to-regexp';
  export default {
    data:function(){
      return {
        pageSettings:null,
        header:{
          header:null,
          description:null
        },
        errorObj:{
          has:false,code:null,message:null
        },
      };
    },
    async mounted() {
      let self = this;
      let path = this.matchedRoutePath();
      path = path.substr(path.indexOf("/", 2)+1);
      try{
        let page = await mvueCore.metaService().getPage(path);
        this.pageSettings = mvueCore.metaLayoutConvertor.convert(_.cloneDeep(page), this);
        if(this.pageSettings.title){
          this.header = {
            title: this.pageSettings.title,
            description: this.pageSettings.description
          }
        }
      }catch (e) {
        console.error(e);
        this.errorObj.has=true;
        this.errorObj.message="页面错误";
      }
    },
    methods:{
      matchedRoutePath() {
        let matchedRoute = mvueCore.context.componentInRoute(this);
        if (!matchedRoute) {
          matchedRoute = this.$route;
        }
        let url = pathToRegexp.compile(matchedRoute.path)(this.$route.params);
        return url;
      }
    }
  };
</script>

