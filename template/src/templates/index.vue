<template>
  <meta-page :header="header" :pageSettings="pageSettings"></meta-page>
</template>
<script>
  import confs from '../pages/auto-page-confs';
  import mvueCore from 'mvue-core';
  export default {
    data:function(){
      var self=this;
      var key=this.$route.matched[this.$route.matched.length-1].path;
      var pageSettings=mvueCore.metaLayoutConvertor.convert(_.cloneDeep(confs[key]),self);
      var header={
        title:pageSettings.title||"未设置",
        description:pageSettings.description
      };
      return {
        pageSettings:pageSettings,
        header:header
      };
    }
  };
</script>

