<template>
  <div>
    <transition name="fade">
      <div v-show="QRVisibleAlert" class="mask-layer mask-layer-member _in"></div>
    </transition>
    <transition name="modalzoom">
      <div v-show="QRVisibleAlert" class="modal-qr _in">
        <div @click="QRCancelHandler" class="modal-close" style="z-index: 100000;"></div>
        <div class="text-center">
          <svg class="logo-company">
            <use xlink:href="#logo-company" />
          </svg>
        </div>
        <img style="pointer-events:auto;" src="static/images/img-qr.jpg" alt="img-qr" class="img-qr">
        <div class="qr-text">
          长按关注 不迷路
        </div>
      </div>
      <!-- /.modal-qr -->
    </transition>
  </div>
</template>

<script>
import { Modal } from 'rocoui'
import axios from 'axios'
import createGoldModal from '@/components/GoldModal'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  components: {
    Modal
  },
  data() {
    return {
      QRVisibleAlert: false, // 二维码弹出层
      cancel: null
    }
  },
  created() {
    if (!window.sessionStorage.getItem('goldCount')) {
      this.$nextTick(() => {
        // 获取首页弹出层信息
        this.getModalInfo()
      })
    }
  },
  methods: {
    // 获取首页弹出层信息
    getModalInfo() {
      const CancelToken = axios.CancelToken
      let self = this
      axios.get('/api/wap/members/check_subscribe', {
        cancelToken: new CancelToken(function executor(c) {
          self.cancel = c
        })
      }).then((focusRes) => {
        if (focusRes.data.code === CODE_SUCCESS) {
          // 如果已关注公众号，直接判断弹出晋级金卡弹出层
          createGoldModal()
        } else {
          if (!window.sessionStorage.getItem('qrCount')) {
            this.QRVisibleAlert = true
            // 已经弹过，更新sessionStorage
            window.sessionStorage.setItem('qrCount', 1)
          }
        }
      })
    },
    // 点击二维码弹出层关闭按钮
    QRCancelHandler() {
      this.QRVisibleAlert = false
      createGoldModal()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.cancel()
  }
}
</script>
