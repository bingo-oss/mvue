<template>
  <div class="bvue-page">
    <b-childheader :title="header.title" :subtitle="header.description" :showBack="header.showBack" ></b-childheader>
    <div class="bvue-page-body">
      <Card >
        <meta-grid v-if="isReady" ref="gridList" v-bind="grid">
        </meta-grid>
        <Alert type="warning" v-if="hasError" show-icon style="margin: 20px 200px">
          页面错误
          <template slot="desc">
            该页面已被禁止访问，请通过配置启用该页面后，再重试！
          </template>
        </Alert>
      </Card>
    </div>
  </div>
</template>
<script>
  import  mvueCore from "mvue-core";
  import contextHelper from "../libs/context";
  export default {
    data:function(){
      var entityName=this.$route.params.entityName;
      var metaEntity=mvueCore.metaBase.findMetaEntity(entityName);
      if(metaEntity==null){
        contextHelper.error({
          content:`实体${entityName}不存在`
        });
        return;
      }
      var hasError=!metaEntity.isUIEnable();
      return {
        isReady:false,
        hasError:hasError,
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
    mounted:function () {
      if(this.hasError){
        return;
      }
      this.metaEntity.getUISettings().then((settings)=>{
        var gridSetting=(settings && settings.list)||{};
        this.grid=this.metaEntity.extendUISettings(this.grid,gridSetting);
        this.isReady=true;
      });
    }
  };
</script>
