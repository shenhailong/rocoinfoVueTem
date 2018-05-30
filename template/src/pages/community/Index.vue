<template>
  <div class="wrap wrap-index-community">
    <NavBar :type="NavType.COMMUNITY"></NavBar>

    <div class="bar-box-top bar-absolute-top">
      <header class="bar bar-nav">
        <a href="#/Index/search" class="bar-item">
          <svg class="svg-search _left">
            <use xlink:href="#svg-search" />
          </svg>
        </a>
        <div class="bar-item">
          <img src="static/images/logo.png" alt="logo" class="logo-bar">
        </div>
        <a href="user.html#/message" class="bar-item">
          <div class="message">
            <svg class="svg-message">
              <use xlink:href="#svg-message" />
            </svg>
            <span class="badge badge-circle tag-primary _solid" v-show="unReadNum"></span>
          </div>
        </a>
      </header>

      <div class="main-tab _border">
        <nav class="main-tab-links">
          <div class="item" :class="{'_active': currentPage === 'Hot'}" @click="changePage('Hot')">
            热门
          </div>
          <div class="item" :class="{'_active': currentPage === 'Attention'}" @click="changePage('Attention')">
            关注
          </div>
          <div class="item" :class="{'_active': currentPage === 'TrialReport'}" @click="changePage('TrialReport')">
            试用报告
          </div>
        </nav>
      </div>

    </div>

    <div class="content" id="scrollContent">

      <transition :name="transitionName">
        <keep-alive>
          <component :is="currentPage" class="acce-3d child-sub-view" v-if="init" ref="commuinityContent"></component>
        </keep-alive>
      </transition>

    </div>

    <div class="float-window">
      <a href="#/Index/EditTopic" class="item">
        <svg class="svg-icon svg-write">
          <use xlink:href="#svg-write" />
        </svg>
      </a>

    </div>
    <ScrollTop :container="'#scrollContent'"></ScrollTop>
  </div>

</template>
<script>
import NavType from '@/constants/navType'
import store from '@/configs/store'
import NavBar from '@/components/NavBar'
import ScrollTop from '@/components/ScrollTop'
import Hot from '@/components/Community/IndexHot'
import Attention from '@/components/Community/IndexAttention'
import TrialReport from '@/components/Community/IndexTrialReport'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
export default {
  data() {
    return {
      NavType,
      transitionName: 'slide-out', // 动画
      currentPage: 'Hot', // 当前显示
      init: true,
      unReadNum: 0
    }
  },
  components: {
    NavBar,
    Hot,
    Attention,
    TrialReport,
    ScrollTop
  },
  created() {
    this.currentPage = store.get('communityPage') || 'Hot'
    this.unRead()
  },
  beforeCreate() {
    this.$store.dispatch('cartGetQuantity')
  },
  methods: {
    // 获取未读消息
    unRead() {
      axios.get('/api/wap/message/unread').then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.unReadNum = res.data.data
        }
      })
    },
    // 切换当前page
    changePage(value) {
      this.currentPage = value
      store.set('communityPage', value)
    }
  },
  watch: {
    currentPage(val) {
      this.transitionName = this.currentPage === 'Hot' ? 'slide-out' : 'slide-in'
    }
  }
}
</script>
