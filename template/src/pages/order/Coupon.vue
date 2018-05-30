<template>
  <div class="wrap wrap-coupons">
    <div class="bar-box-top bar-absolute-top">
      <div class="bar bar-nav _border">
        <a @click="routerBack" href="javascript:;" class="bar-item item-arrow">
          <svg class="svg-arrow _left">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <div class="bar-item">优惠方式</div>
      </div>
    </div>
    <div class="content" style="padding-top: 1.12rem;">
      <div v-if="couponUnavailable" class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-coupons">icon</i>
          </div>
          <p>没有你要的优惠券</p>
        </div>
      </div>
      <div v-else class="coupons-viewbox">
        <!--
        注意:
        不可用状态请在list-coupons后追加class[coupons-disabled]
        已使用和已失效状态请在list-coupons后追加class[coupons-expried]
        选中状态请在list-coupons后追加class[coupons-selected]
        -->
        <template v-if="couponAvailable">
          <div v-for="(coupon, $index) in orderState.couponDtos" @click="couponSelectHandler(coupon, $index, 'couponDtos')" :key="coupon.id" :class="{'coupons-selected': coupon.checked}" class="list-coupons">
            <svg class="svg-coupons">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-coupons"></use>
            </svg>
            <div :class="{'has-selected': coupon.checked}" class="select-tag">
              <svg class="svg-check">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-check"></use>
              </svg>
            </div>
            <div class="coupons-body">
              <div class="coupons">
                <template v-if="coupon.id === -1">
                  <div class="text">促销活动</div>
                </template>
                <template v-else>
                  <div class="item-price">
                    <em>¥</em>{{coupon.subtraction}}</div>
                  <div class="text">满{{coupon.threshold}}可用</div>
                </template>
              </div>
              <div class="item-inner" style="min-width: 6rem;max-width: none;">
                <div class="item-title _ellipsis">{{coupon.name}}</div>
                <div class="item-subtitle _ellipsis">
                  有效期：{{coupon.effectiveDate}}
                </div>
                <div @click.stop="couponSwitchInfo(coupon,$index, 'couponDtos')" class="details-info">
                  <span class="text _ellipsis">{{coupon.note}}</span>
                  <svg :class="{'_up': coupon._textVisible, '_down': !coupon._textVisible}" class="svg-arrow">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
                  </svg>
                </div>
              </div>
              <div class="item-align-center">
                <!-- <a href="javascript:;" class="btn-normal btn-primary btn-xs">立即使用</a> -->
              </div>
            </div>
            <div :class="{'disB': coupon._textVisible, 'disN': !coupon._textVisible}" class="coupons-footer">
              {{coupon.note}}
            </div>
          </div>
        </template>
        <template v-if="noThresholdCouponAvailable">
          <div class="content-block-title">
            <span class="title text-primary">您还可以和以下优惠叠加使用</span>
          </div>

          <div v-for="(coupon, $index) in orderState.noThresholdCouponDtos" :key="coupon.id" :class="{'coupons-selected': coupon.checked}" @click="couponSelectHandler(coupon, $index, 'noThresholdCouponDtos')" class="list-coupons">
            <svg class="svg-coupons">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-coupons"></use>
            </svg>
            <!-- 选中状态标识 -->
            <div :class="{'has-selected': coupon.checked}" class="select-tag">
              <svg class="svg-check">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-check"></use>
              </svg>
            </div>
            <div class="coupons-body">
              <div class="coupons">
                <div class="item-price">
                  <em>¥</em>{{coupon.subtraction}}</div>
                <div class="text">满{{coupon.threshold}}可用</div>
              </div>
              <div class="item-inner" style="min-width: 6rem;max-width: none;">
                <div class="item-title _ellipsis">{{coupon.name}}</div>
                <div class="item-subtitle">
                  有效期：{{coupon.effectiveDate}}
                </div>
                <div @click.stop="couponSwitchInfo(coupon,$index, 'noThresholdCouponDtos')" class="details-info">
                  <span class="text _ellipsis">{{coupon.note}}</span>
                  <svg :class="{'_up': coupon._textVisible, '_down': !coupon._textVisible}" class="svg-arrow">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
                  </svg>
                </div>
              </div>
              <div class="item-align-center">
                <!-- <a href="javascript:;" class="btn-normal btn-primary btn-xs">立即使用</a> -->
              </div>
            </div>
            <div :class="{'disB': coupon._textVisible, 'disN': !coupon._textVisible}" class="coupons-footer">
              {{coupon.note}}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import routerMixin from '@/mixin/router'
import { mapState } from 'vuex'
import * as STORE_ORDER_TYPE from '@/store/types/order'
export default {
  name: 'OrderCoupon',
  mixins: [routerMixin],
  data() {
    return {}
  },
  created() {
    console.log(this.couponAvailable)
  },
  methods: {
    couponSelectHandler(coupon, index, key) {
      this.$store.commit(STORE_ORDER_TYPE.ORDER_SET_COUPON_SELECT, {
        coupon,
        index,
        key
      })
    },
    couponSwitchInfo(coupon, index, key) {
      this.$store.commit(STORE_ORDER_TYPE.ORDER_SET_COUPON_VISIBLE, {
        coupon,
        index,
        key
      })
    }
  },
  computed: {
    ...mapState({
      orderState: (state) => state.order
    }),
    couponAvailable() {
      try {
        return (
          this.orderState &&
          this.orderState.couponDtos &&
          this.orderState.couponDtos.length > 0
        )
      } catch (e) {
        console.log(e)
        return false
      }
    },
    noThresholdCouponAvailable() {
      try {
        return (
          this.orderState &&
          this.orderState.noThresholdCouponDtos &&
          this.orderState.noThresholdCouponDtos.length > 0
        )
      } catch (e) {
        console.log(e)
        return false
      }
    },
    couponUnavailable() {
      return !this.couponAvailable && !this.noThresholdCouponAvailable
    }
  }
}
</script>
