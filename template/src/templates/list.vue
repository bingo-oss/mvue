<template>
  <m-page-tmpl type="list" :key="pid"></m-page-tmpl>
</template>

<script>
  export default {
    data: function () {
      return {
        pid:this.calPageId()
      };
    },
    beforeRouteUpdate(to, from, next) {
      this.pid=this.calPageId();
      next();
    },
    methods:{
      calPageId(){
        return "list_"+this.$route.fullPath;
      }
    }
  }
</script>
