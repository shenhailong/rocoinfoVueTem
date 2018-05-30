<template>
  <div>
    <div class="member-block-title">
      <div class="item-title">会员商品</div>
      <div class="item-subtitle">会员积分专享兑换商品</div>
    </div>
    <!-- /.member-block-title -->
    <div class="list-product list-column2">
      <div v-for="(item, index) in commodityList" :key="item.skuId" v-show="index < 4" @click="goRouterSkuIdDetail(item, 'CENT_EXCHANGE')" class="item-goods">
        <div class="item-media">
          <img v-lazy="{
            src: item.skuImg ? item.skuImg : 'static/images/lazyload/348x348.jpg',
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
        </div>
        <div class="item-inner">
          <div class="item-title _ellipsis2">{{ item.skuName }}</div>
          <div class="item-subtitle _ellipsis">{{ item.subTitle }}</div>
          <div class="price-area">
            <div class="item-price">积分{{ item.centPrice }}</div>
          </div>
        </div>
      </div>
      <!--/.item-goods 商品-->
    </div>
    <!-- /.list-product -->
    <a href="javascript:;" v-if="commodityList.length > 4" @click="goCommodityList('member')" class="btn-normal btn-more">
      查看全部商品
      <svg class="svg-arrow">
        <use xlink:href="#svg-arrow"></use>
      </svg>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    commodityList: {
      type: Array
    }
  },
  methods: {
    // 点击某个会员商品跳到商品详情
    goRouterSkuIdDetail (item, type) {
      window.location.href = `index.html#/product/${item.productId}?skuId=${item.skuId}&placeOrderType=${type}`
    },
    // 点击查看更多会员商品
    goCommodityList (type) {
      this.$router.push({
        name: 'VipEquities',
        params: { type }
      })
    }
  }
}
</script>
