<template>
  <div class="bvue-page" :key="$route.fullPath"  :id="'default-form-uuid-'+metaEntity.name">
    <b-childheader :title="childheader.title"></b-childheader>
    <div class="bvue-page-body">
      <Card :bordered="false" :padding="24">
        <Row>
          <Col span="22" >
              <meta-form v-if="isReady" ref="form" v-bind="form">
              </meta-form>
              <Alert type="warning" v-if="hasError" show-icon style="margin: 20px 200px">
              页面错误
              <template slot="desc">
                该页面已被禁止访问，请通过配置启用该页面后，再重试！
              </template>
            </Alert>
          </Col>
        </Row>
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
    var metaEntity=mvueCore.metaBase.findMetaEntity(entityName);
    if(metaEntity==null){
      mvueCore.context.error({
        content:`实体${entityName}不存在`
      });
      return;
    }
    var hasError=!metaEntity.isUIEnable();
    return {
      isReady:false,
      hasError:hasError,
      childheader:{
        title:"",
      },
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
    }
  },
  mounted(){
    var prefix='';
    var action="create";
    if(this.isViewMode){
      prefix='查看';
      action="view";
    }else if(this.form.recordId){
      prefix='编辑';
      action="edit";
    }else{
      prefix='新建';
    }
    this.childheader.title=`${prefix}${this.metaEntity.title}`;
    if(this.hasError){
      return;
    }
    this.metaEntity.getFormSettings(action).then(st=>{
      if(st==null){
        this.hasError=true;
        return;
      }
      this.form=this.metaEntity.extendUISettings(this.form,st);
      this.isReady=true;
    });
  }
}
</script>

