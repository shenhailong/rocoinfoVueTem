<template>
  <div>
    <!-- 生日礼品 -->
    <div v-if="privilegeInfo.sku && privilegeInfo.sku.length > 0" class="list-sale">
      <div v-for="item in privilegeInfo.sku" :key="item.productId" class="item-goods item-horizontal">
        <div class="item-media">
          <img v-lazy="{
            src: item.imgPath ? item.imgPath : 'static/images/lazyload/348x348.jpg',
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="生日礼品" class="lazy-img-fadein">
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
    <!-- 生日礼券 -->
    <div v-if="privilegeInfo.coupon && privilegeInfo.coupon.length > 0">
      <div v-for="item in privilegeInfo.coupon" :key="item.coupon_id" class="list-coupons coupons-selected">
        <svg class="svg-coupons">
          <use xlink:href="#svg-coupons"></use>
        </svg>
        <!-- 选中状态标识 -->
        <div class="select-tag has-selected">
          <div class="text">{{ item.num }}张</div>
        </div>
        <div class="coupons-body">
          <div class="coupons">
            <div class="item-price"><em>¥</em>{{ item.subtraction }}</div>
            <div class="text">满{{ item.threshold }}可用</div>
          </div>
          <!-- /.coupons-bg -->
          <div class="coupons-right">
            <div class="item-inner">
              <div class="item-title _ellipsis">{{ item.name }}</div>
              <div class="item-align-center item-flex-between">
                <div class="item-subtitle">
                  {{ item.effectiveDate }}至{{ item.expireDate }}
                </div>
                <a href="user.html#/coupon" class="btn-normal btn-primary btn-xs">查看</a>
              </div>
            </div>
            <!-- /.item-inner -->
            <div class="details-info">
              <span class="text _ellipsis">{{ item.note?item.note:'全品类' }}</span>
            </div>
          </div>
          <!-- /.coupons-right -->
        </div>
        <!-- /.coupons-body -->
      </div>
      <!-- /.list-coupons -->
    </div>
  </div>
</template>

<script>
export default {
  props: ['privilegeInfo'],
  methods: {
    // 点击生日礼品跳转到商品详情页
    goRouterIdDetail (item) {
      window.location.href = `index.html#/product/${item.productId}?skuId=${item.skuId}&recordId=${item.id}&placeOrderType=BIRTHDAY_GIFT`
    }
  }
}
</script>
