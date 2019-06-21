<template>
    <div>
        获取token中...
    </div>
</template>
<script>
    import mvueCore from "mvue-toolkit";
    export default {
      data() {
        return {}
      },
      mounted() {
        let returnUrl = this.$route.query["redirect_uri"];
        let tokenInfo = {
          access_token: "c77d3714-6777-47a2-8824-c4dda666bfc4",  //token
          expires_in: 1558405796883,    //token过期时间
          state: "success"
        }; //获取token
        if (returnUrl.charAt(0) == "#") {
          this.$router.push({path: returnUrl.substr(1), query: tokenInfo});
        } else {
          returnUrl = returnUrl.utils.appendParams(returnUrl, tokenInfo);
          window.location = returnUrl;
        }
      }
    }
</script>
