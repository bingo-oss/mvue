<template>
  <div>
    <meta-layout v-if="ready" :layout="pageSettings.layout"></meta-layout>
    <Alert type="warning" v-if="errorObj.has" show-icon style="margin: 20px 200px">
      页面错误
      <template slot="desc">
        {{ errorObj.message }}
      </template>
    </Alert>
  </div>
</template>
<script>
  import  mvueCore from "mvue-core";
  export default {
    data: function () {
      var errorObj = {has: false, code: null, message: null};
      return {
        errorObj: errorObj,
        ready: false,
        pageSettings: null,
      };
    },
    mounted: async function () {
      var self = this;
      var mainEntityName = this.$route.params.entityName;
      var relationName = this.$route.params.relation;
      var subPage = this.$route.params.subPage;
      var mainRecordId = this.$route.params.id;
      var subRecordId = this.$route.params.subId;

      var mainMetaEntity = mvueCore.metaBase.findMetaEntity(mainEntityName);
      if (mainMetaEntity == null) {
        this.errorObj.has = true;
        this.errorObj.message = `实体${mainEntityName}不存在`;
        return;
      }
      var metaRelation = mainMetaEntity.relations[relationName];
      if (metaRelation == null) {
        this.errorObj.has = true;
        this.errorObj.message = `实体${mainEntityName}不存在关系${relationName}`;
        return;
      }
      var subMetaEntity = mvueCore.metaBase.findMetaEntity(metaRelation.targetEntity);
      try {
        var settings = null;
        if (_.isEmpty(settings)) {
          settings = await mainMetaEntity.getRelationPage(relationName,subPage);
        }
        this.pageSettings = mvueCore.metaLayoutConvertor.convert(settings, self);
        mvueCore.metaLayoutConvertor.visit(this.pageSettings, (widget) => {
          if (widget.ctype == "m-form" || widget.ctype == "m-detail-view") {
            widget["entityName"] = subMetaEntity.name;
            if (subPage == "create") {
              widget["recordId"] = null;
            }
            if (subRecordId) {
              widget["recordId"] = subRecordId;
            }
          }
        });
        this.ready = true;
      } catch (e) {
        this.errorObj.has = true;
        this.errorObj.message = e;
      }
    }
  };
</script>

