<template>
  <div>
    <transition name="fade">
      <div v-show="upgradeGoldVisibleAlert" class="mask-layer mask-layer-member _in"></div>
    </transition>
    <transition name="modalzoom">
      <div v-show="upgradeGoldVisibleAlert" class="modal-gift _in">
        <div @click="upgradeCancelHandler" class="modal-close"></div>
        <div class="gift-header">
          <div class="header-text">
            {{ giftPacks.salePrice }}元新人礼包
          </div>
        </div>
        <div class="gift-content">
          <p class="text-info">含价值
            <em>1990</em>元商品<br/>购买后直接升级为</p>
          <p class="text-grade">金卡会员</p>
          <a href="javascript:;" @click="confirmHandler" class="btn-normal btn-invitation">了解详情</a>
          <p class="text-tips"> &lt;仅限新注册用户首次消费购买&gt; </p>
        </div>
      </div>
      <!-- /.modal-gift -->
    </transition>
  </div>
</template>

<script>
import { Modal } from 'rocoui'
import axios from 'axios'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  components: {
    Modal
  },
  data() {
    return {
      giftPacks: {},
      upgradeGoldVisibleAlert: false, // 晋级金卡弹出层
      cancel: null
    }
  },
  created() {
    this.getGoldInfo()
  },
  methods: {
    // 获取晋级金卡弹出层
    getGoldInfo() {
      if (!window.sessionStorage.getItem('goldCount')) {
        const CancelToken = axios.CancelToken
        let self = this
        axios.get('/api/wap/index/goldGiftBag', {
          cancelToken: new CancelToken(function executor(c) {
            self.cancel = c
          })
        }).then((packsRes) => {
          // 只要晋级礼包弹出层返回1且开关为true就为packs赋值
          if (
            packsRes.data.code === CODE_SUCCESS &&
            packsRes.data.data.isShowGoldGiftBagTip
          ) {
            this.upgradeGoldVisibleAlert = true
            this.giftPacks = packsRes.data.data.sku
            // 已经弹过，更新sessionStorage
            window.sessionStorage.setItem('goldCount', 1)
          }
        })
      }
    },
    // 点击晋级礼包弹出层去购买跳转到商品详情
    confirmHandler() {
      this.upgradeGoldVisibleAlert = false
      window.location.href = `index.html#/product/${
        this.giftPacks.productId
      }?skuId=${this.giftPacks.id}&placeOrderType=CART`
    },
    // 点击晋级礼包弹出层关闭按钮
    upgradeCancelHandler() {
      this.upgradeGoldVisibleAlert = false
    }
  },
  beforeRouteLeave (to, from, next) {
    this.cancel()
  }
}
</script>
