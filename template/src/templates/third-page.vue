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
      let self = this;
      let metaEntity1 = mvueCore.metaBase.findMetaEntity(this.$route.params.entityName);
      if (metaEntity1 == null) {
        this.errorObj.has = true;
        this.errorObj.message = `实体${this.$route.params.entityName}不存在`;
        return;
      }
      let relation = metaEntity1.relations[this.$route.params.relation];
      if (relation == null) {
        this.errorObj.has = true;
        this.errorObj.message = `实体${metaEntity1.name}未配置关系${this.$route.params.relation}`;
        return;
      }
      let metaEntity2 = mvueCore.metaBase.findMetaEntity(relation.targetEntity);
      let id2 = this.$route.params.subId;
      let thirdPage=this.$route.params.thirdPage;
      try {
        var settings = await metaEntity2.getPage(thirdPage);
        if (_.isEmpty(settings)) {
          this.$router.push({path: this.$route.path + "/list", query: this.$route.query});
          return;
        }
        this.pageSettings = mvueCore.metaLayoutConvertor.convert(settings, self);
        _.forEach(this.pageSettings.layout, com => {
          if (com.ctype == "m-form" || com.ctype == "m-detail-view") {
            com["showHeader"] =false;
            com["entityName"] = metaEntity2.name;
            com["recordId"] = id2;
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

