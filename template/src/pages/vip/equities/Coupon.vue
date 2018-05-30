<template>
  <!-- 优惠券 -->
  <div >
    <div v-for="item in privilegeInfo" :key="item.coupon_id" class="list-coupons coupons-selected">
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
</template>

<script>
export default {
  props: ['privilegeInfo']
}
</script>
