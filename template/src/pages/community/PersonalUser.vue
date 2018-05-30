<template>
  <div class="wrap wrap-center-topics">
    <div class="content" id="scrollContent">
      <div class=""></div>
      <div class="center-header">
        <a href="javascript:;" class="back" @click="back">
          <svg class="svg-arrow _left">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
          </svg>
        </a>
        <div class="center-header-content">
          <div class="author-avatar">
            <img v-lazy="{src: info.member.profileImage ? info.member.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'}" alt="" class="lazy-img-fadein">
            <svg class="svg-member-circle" v-if="info.member.type === 'OFFICIAL'">
              <use xlink:href="#svg-member-circle" />
            </svg>
            <div class="member-grade" v-if="info.member.type !== 'OFFICIAL' && info.member.level">
              <svg class="svg-member-grade">
                <use xlink:href="#svg-member-grade"></use>
              </svg>
              <span class="num">{{info.member.level.levelNum - 1}}</span>
            </div>

          </div>
          <div class="item-title">{{info.member.nickname}}</div>
          <div class="item-subtitle">{{info.member.signature}}</div>
          <div class="flex layout-column">
            <a class="item">
              粉丝
              <span class="num">{{info.fansNumbers}}</span>
            </a>
            <a class="item">
              话题
              <span class="num">{{info.topicNumbers}}</span>
            </a>
            <a class="item">
              关注
              <span class="num">{{info.followNumbers}}</span>
            </a>
          </div>

        </div>

      </div>

      <div class="bar-box-top">
        <div class="main-tab _border">
          <nav class="main-tab-links">
            <div class="item" :class="{'_active': currentPage === 'UserTopic'}" @click="changePage('UserTopic')">
              话题
            </div>
            <div class="item" :class="{'_active': currentPage === 'UserDraft'}" @click="changePage('UserDraft')">
              草稿
            </div>
          </nav>
        </div>

      </div>

      <div class="space-20"></div>
      <div>
        <transition :name="transitionName">
          <keep-alive>
            <component :is="currentPage" class="acce-3d child-sub-view" v-if="init" ref="infiniteLoading"></component>
          </keep-alive>
        </transition>
      </div>

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
import ScrollTop from '@/components/ScrollTop'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import store from '@/configs/store'
import { Toast } from 'rocoui'
import UserTopic from '@/components/Community/UserTopic'
import UserDraft from '@/components/Community/UserDraft'
export default {
  data() {
    return {
      info: {
        member: {
          level: {}
        }
      },
      currentPage: 'UserTopic', // 当前显示
      init: true,
      transitionName: 'slide-out'
    }
  },
  components: {
    ScrollTop,
    UserTopic,
    UserDraft
  },
  mounted() {
    this.getInfo()
  },
  created() {
    this.currentPage = store.get('userPage') || 'UserTopic'
  },
  methods: {
    // 切换当前page
    changePage(value) {
      this.currentPage = value
      store.set('userPage', value)
    },
    getInfo() {
      let promise = axios.get(`/api/wap/forum/home`).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.info = res.data.data
        }
      })
      Toast.loading('正在加载...', promise)
    },
    back() {
      store.remove('userPage')
      this.$router && this.$router.back()
    }
  }
}
</script>
