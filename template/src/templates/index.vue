<template>
  <meta-page :header="header" :pageSettings="pageSettings"></meta-page>
</template>
<script>
  import context from '../libs/context';
  export default {
    data:function(){
      var self=this;
      var key=this.$route.matched[this.$route.matched.length-1].path;
      var confs=context.getAutoPageConfs();
      var pageSettings=context.getMvueCore().metaLayoutConvertor.convert(_.cloneDeep(confs[key]),self);
      var header={
        title:pageSettings.title,
        description:pageSettings.description
      };
      return {
        pageSettings:pageSettings,
        header:header
      };
    }
  };
</script>

