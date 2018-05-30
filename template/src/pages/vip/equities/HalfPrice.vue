<template>
  <div class="probation-wrap">
    <div class="item-goods">
      <div class="item-inner">
        <div class="item-title _ellipsis">全场非活动商品半价试用</div>
        <div class="line"></div>
        <div class="probation-text">
          <p class="item-subtitle">
            我想不出对你的疼爱,还有什么比<span class="text-primary">5折</span>更实在
          </p>
          <p class="item-subtitle">
            您的半价试用特权还剩<span class="text-primary">
              {{ privilegeInfo.halfPriceNum }}次
            </span>
          </p>
        </div>
        <div class="text-center">
          <a href="javascript:;" v-if="privilegeInfo.halfPriceNum!==0" @click="goCommodityList('halfPrice')" class="btn-normal btn-primary _solid btn-xxs">查看商品</a>
          <a href="javascript:;" v-else class="btn-normal _solid btn-xxs">查看商品</a>
        </div>
      </div>
      <!-- /.item-inner -->
    </div>
    <!--/.item-goods-->
  </div>
  <!-- /.probation-wrap -->
</template>

<script>
export default {
  props: ['privilegeInfo'],
  methods: {
    // 点击半价试用查看商品跳到商品列表
    goCommodityList (type) {
      this.$router.push({
        name: 'VipEquities',
        params: { type }
      })
    }
  }
}
</script>
