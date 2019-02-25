<template>
  <div class="bvue-page"  :key="$route.fullPath"  :id="'default-grid-uuid-'+metaEntity.name">
    <b-childheader v-if="isGrid()" :title="header.title" :showBack="false"></b-childheader>
    <div v-if="isReady" class="bvue-page-body" >
      <Card v-if="isGrid()">
        <meta-layout  :layout="layout"></meta-layout>
      </Card>
      <meta-layout v-else :layout="layout"></meta-layout>
    </div>
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
  import  mvueCore from "mvue-core";
  export default {
    data:function(){
      var entityName=this.$route.params.entityName;
      var metaEntity=mvueCore.metaBase.findMetaEntity(entityName);
      var errorObj={has:false,code:null,message:null};
      if(metaEntity==null){
        errorObj=_.assign(errorObj,{
          has:true,
          code:"404",
          message:`实体${entityName}不存在`
        });
        metaEntity={title:"不存在实体"};
      }else{
        var hasError=!metaEntity.isUIEnable();
        if(hasError){
          errorObj=_.assign(errorObj,{
            has:true,
            code:"500",
            message:`实体${metaEntity.title}列表，已被禁止访问，请通过配置启用该页面后，再重试！`
          });
        }
      }
      return {
        isReady:false,
        errorObj:errorObj,
        header:{
          title:`${metaEntity.title || metaEntity.name}列表`,
          description:metaEntity.description,
          showBack:false
        },
        metaEntity:metaEntity,
        grid:{
          entityName:metaEntity.name
        }
      }
    },
    computed:{
      layout() {
        var pageSettings = mvueCore.metaLayoutConvertor.convert(this.grid, self);
        var layout=pageSettings.layout;
        return layout;
      }
    },
    mounted:function () {
      if(this.errorObj.has){
        return;
      }
      this.metaEntity.getPage("list").then((st)=>{
        if(st==null){
          this.errorObj.has=true;
          this.errorObj.message=`[${this.metaEntity.title}]列表，已被禁止访问，请通过配置启用该页面后，再重试！`;
          return;
        }
        this.grid=this.metaEntity.extendUISettings(this.grid,st);
        if(this.grid && this.grid.title){
          this.header.title=this.grid.title;
        }
        this.isReady=true;
      });
    },
    methods:{
      isGrid(){
        return this.grid.ctype=="m-grid" || this.grid.ctype=="m-tree-grid";
      }
    }
  };
</script>
