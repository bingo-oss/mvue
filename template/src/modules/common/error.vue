<template>
  <div class="bvue-page page-error">
    <div class="bvue-page-body">
      <Card >
        <Alert type="warning" show-icon style="margin: 20px 200px">
          页面错误
          <template slot="desc">
            对不起，系统出错了，请联系管理员处理！
          </template>
        </Alert>
        <div class="page-error-foot">
          <Button :to="'/'"  icon="ios-arrow-back">返  回</Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
    export default {
      data() {
        return {}
      },
      mounted() {

      }
    }
</script>
