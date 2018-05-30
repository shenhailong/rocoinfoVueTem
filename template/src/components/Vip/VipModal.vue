<template>
  <!-- vip会员页面用到的弹出层 -->
  <div>
    <transition name="fade">
      <div class="mask-layer mask-layer-member" :class="{'_in': visibleAlert}"></div>
    </transition>
    <transition name="modalzoom">
      <div class="modal-member" :class="{'_in': visibleAlert}">
        <div @click="cancelHandler" class="modal-close"></div>
        <img class="decoration" src="static/images/icon-decoration.png" alt="">
        <div class="text-wrap">
          <svg class="logo-company">
            <use xlink:href="#logo-company" />
          </svg>
          <div class="text-congratulation">恭喜您</div>
          <div class="title-wrap">
            <h1 class="title">荣升{{ equitiesObj.levelName }} </h1>
          </div>
          <h2 class="subtitle">您将特享以下专属权益</h2>
          <img class="icon-arrow" src="static/images/icon-arrow.png" alt="">
        </div>

        <div class="layout-column-wrap">
          <div class=" layout-column">
            <a href="javascript:;" v-for="(item, index) in equitiesObj.equities" :key="index" @click="confirmHandler" class="item">
              <div class="icon-wrap">
                <svg v-if="index" :class="['icon', 'svg-privilege'+index+'']">
                  <use :xlink:href="['#svg-privilege'+index+'']"></use>
                </svg>
                <svg v-else class="icon svg-privilege8">
                  <use xlink:href="#svg-privilege8"></use>
                </svg>
              </div>
              <div class="text">
                <p>{{ item.label }}</p>
                <p>{{ item.value }}</p>
              </div>
            </a>
          </div>
          <!-- /.layout-column -->
          <!-- <img class="decoration" src="static/images/icon-decoration-bottom.png" alt=""> -->
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Modal } from 'rocoui'
import Cookies from 'js-cookie'
import axios from 'axios'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  components: {
    Modal
  },
  data() {
    return {
      equitiesObj: {},
      visibleAlert: false
    }
  },
  mounted() {
    this.visibleAlert = true
    // 获取vip权益
    this.getVipEquities()
  },
  methods: {
    // 获取vip权益
    getVipEquities() {
      axios.get(`/api/wap/memberVIP/upgradeHintInfo`).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.equitiesObj = res.data.data
        }
      })
    },
    // 点击vip权益跳转到vip首页
    confirmHandler() {
      axios.get(`/api/wap/memberVIP/closeUpgradeHint`).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          Cookies.set('upgradeHint', false)
          window.location.href = 'vip.html'
        }
      })
    },
    // 点击弹出层关闭按钮
    cancelHandler() {
      axios.get(`/api/wap/memberVIP/closeUpgradeHint`).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          Cookies.set('upgradeHint', true)
          this.visibleAlert = false
        }
      })
    }
  }
}
</script>
