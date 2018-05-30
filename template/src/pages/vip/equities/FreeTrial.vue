<template>
  <!-- 新品免费试用 -->
  <div class="list-sale">
    <div class="tips-text">您的新品免费试用特权还剩<span class="text-primary">{{ privilegeInfo.num }}次</span></div>
    <div v-for="item in privilegeInfo.sku" :key="item.id" class="item-goods item-horizontal">
      <div class="item-media">
        <img v-lazy="{
          src: item.imgPath ? item.imgPath : 'static/images/lazyload/348x348.jpg',
          loading: 'static/images/lazyload/348x348.jpg',
          error: 'static/images/lazyload/348x348.jpg'
        }" alt="晋级礼包" class="lazy-img-fadein">
      </div>
      <div class="item-inner">
        <div class="item-title _ellipsis">{{ item.name }} {{ item.attribute1 }}</div>
        <div class="item-subtitle _ellipsis">{{ item.subtitle }}</div>
        <!-- /.title -->
        <div class="item-flex-between item-align-center item-bottom">
          <div class="price-area">
            <div class="item-price size-lg"><em>¥</em>0</div>
            <div class="item-price-original size-lg"><em>¥</em>{{ item.salePrice }}</div>
          </div>
          <template v-if="item.status==='LIST'">
            <a href="javascript:;" v-if="item.receive" class="btn-normal _solid btn-sm">已领取</a>
            <a href="javascript:;" v-else @click="goRouterSkuIdDetail(item)" class="btn-normal btn-primary _solid btn-sm">立即领取</a>
          </template>
          <a href="javascript:;" v-else class="btn-normal _solid btn-sm">已下架</a>
        </div>
      </div>
      <!-- /.item-inner -->
    </div>
    <!--/.item-goods 水平摆放商品-->
  </div>
  <!-- /.list-sale -->
</template>

<script>
export default {
  props: ['privilegeInfo'],
  methods: {
    // 点击新品免费试用商品
    goRouterSkuIdDetail (item) {
      window.location.href = `index.html#/product/${item.productId}?skuId=${item.skuId}&placeOrderType=FREE_TRIAL`
    }
  }
}
</script>
