<template>
  <div :class="cls" >
    <div class="bvue-page-body">
      <Card >
        <Alert type="warning" show-icon style="margin: 20px 200px">
          访问拒绝
          <template slot="desc">
            您没权限访问此页面，请联系管理员授权后，再重试！
          </template>
        </Alert>
        <div class="page-error-foot">
          <Button v-if="!isLeftHide()"  icon="ios-arrow-round-back" @click="goback">返  回</Button>
          <Button  icon="ios-log-out" @click="logout">注 销</Button>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
  import  mvueToolkit from "mvue-toolkit";
    export default {
      data() {
        return {}
      },
      mounted() {

      },
      computed:{
        cls(){
          return [
            "bvue-page","page-error",
            this.isLeftHide()?"left-hidden":""
          ]
        }
      },
      methods:{
        isLeftHide() {
          var types = this.$route.query._hide;
          if (!types) {
            return false;
          }
          types = types.split(",");
          return _.includes(types, 'left');
        },
        logout(){
          mvueToolkit.session.doLogout(window.location.href.substring(0,window.location.href.indexOf('#')));
        },
        goback(){
          this.$router.history.go(-1);
        }
      }
    }
</script>
