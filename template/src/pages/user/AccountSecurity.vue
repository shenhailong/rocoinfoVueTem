<template>
  <div class="wrap wrap-center-bind-phone">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">绑定手机号</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <div class="text-info">
        <div class="text">您的手机号：{{ $route.query.mobile }}</div>
      </div>
      <div class="button-block">
        <a href="javascript:;" @click="goRouter" class="btn-normal btn-primary _solid btn-xxl">更换手机号</a>
      </div>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
export default {
  mixins: [routerMixin],
  name: 'MineAccountSecurity',
  methods: {
    // 路由跳转
    goRouter () {
      this.$router.push({
        name: 'MineAccountSecurityVerifyId',
        query: {mobile: this.$route.query.mobile}
      })
    }
  }
}
</script>

