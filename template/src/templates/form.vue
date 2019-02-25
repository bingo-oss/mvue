<template>
  <div class="bvue-page"  :key="$route.fullPath"  :id="'default-form-uuid-'+metaEntity.name">
    <b-childheader v-if="isForm()" :title="header.title"></b-childheader>
    <div v-if="isReady" class="bvue-page-body" >
      <Card v-if="isForm()">
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
    data:function () {
      var entityName=this.$route.params.entityName;
      var id=this.$route.params.id;
      var errorObj={has:false,code:null,message:null};
      var metaEntity=mvueCore.metaBase.findMetaEntity(entityName);
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
            message:`[${metaEntity.title}]表单，已被禁止访问，请通过配置启用该页面后，再重试！`
          });
        }
      }
      return {
        isReady:false,
        errorObj:errorObj,
        header:{
          title:"",
        },
        recordId:id,
        metaEntity:metaEntity,
        form:{
          entityName:metaEntity.name,
          recordId:id,
        }
      }
    },
    computed:{
      isViewMode(){
        var utils=mvueCore.context.getMvueToolkit().utils;
        let action=this.$route.query&&this.$route.query[utils.queryKeys.action];
        return utils.formActions.view===action;
      },
      layout() {
        var self=this;
        var pageSettings = mvueCore.metaLayoutConvertor.convert(this.form, self);
        var layout=pageSettings.layout;
        _.forEach(layout,com=>{
          if(com.ctype=="m-form" || com.ctype=="m-detail-view"){
            com["entityName"]=this.metaEntity.name;
            com["recordId"]=this.recordId;
          }
        });
        return layout;
      }
    },
    mounted(){
      var prefix='';
      var action=this.$route.params.action;
      if(this.isViewMode){
        prefix='查看';
      }else if(this.form.recordId){
        prefix='编辑';
      }else{
        prefix='新建';
      }
      this.header.title=`${prefix}${this.metaEntity.title}`;
      if(this.errorObj.has){
        return;
      }
      this.metaEntity.getPage(action).then(st=>{
        if(st==null){
          this.errorObj.has=true;
          this.errorObj.message=`[${this.metaEntity.title}]编辑表单，已被禁止访问，请通过配置启用该页面后，再重试！`;
          return;
        }
        this.form=this.metaEntity.extendUISettings(this.form,st || {});
        if(this.form && this.form.title){
          this.header.title=this.form.title;
        }
        this.isReady=true;
      });
    },
    methods:{
      isForm(){
        let matched= this.form.ctype=="m-form";
        if(!matched && this.form.layout){
          _.forEach(this.form.layout,(c,index)=>{
            if(c.ctype=="m-form"){
              matched=true;
              return false;
            }
          });
        }
        return matched;
      }
    },
  }
</script>
