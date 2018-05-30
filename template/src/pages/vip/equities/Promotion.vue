<template>
  <!-- 晋级礼 -->
  <div class="list-sale">
    <div v-for="item in privilegeInfo" :key="item.id" class="item-goods item-horizontal">
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
            <a href="javascript:;" v-else @click="goRouterIdDetail(item)" class="btn-normal btn-primary _solid btn-sm">立即领取</a>
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
    // 点击晋级礼包跳转到商品详情页
    goRouterIdDetail (item) {
      window.location.href = `index.html#/product/${item.productId}?skuId=${item.skuId}&recordId=${item.id}&placeOrderType=UPGRADE_GIFT`
    }
  }
}
</script>
