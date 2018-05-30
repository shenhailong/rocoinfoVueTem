<template>
  <div class="wrap wrap-center-index">
    <nav-bar :type="NAV_TYPES.USER"></nav-bar>
    <div class="content">
      <div class="center-header-wrap">
        <div class="bar bar-center flex-end">
          <a href="javascript:;" @click="goRouter('Message')" class="bar-item message">
            <svg class="svg-message">
              <use xlink:href="#svg-message"></use>
            </svg>
            <span v-if="userCenterInfo.messageNum" class="badge badge-circle tag-primary _solid"></span>
          </a>
        </div>
        <!--/.bar-nav-->
        <div class="center-header">
          <div class="center-header-body">
            <div @click="goRouter('PersonalInfo')" class="item-goods item-horizontal">
              <div @click.stop="goCommunityRouter" class="author-column">
                <div class="author-avatar">
                  <img v-lazy="{
                    src: userCenterInfo.profileImage ? userCenterInfo.profileImage : 'static/images/m/avatar.jpg',
                    loading: 'static/images/m/avatar.jpg',
                    error: 'static/images/m/avatar.jpg'
                  }" alt="avatar" class="lazy-img-fadein">
                </div>
              </div>
              <!-- /.author -->
              <div class="item-inner">
                <div class="item-title _ellipsis">{{ userCenterInfo.nickname }}</div>
                <div class="item-subtitle _ellipsis">{{ userCenterInfo.signature }}</div>
                <!-- /.title -->
              </div>
              <!-- /.item-inner -->
              <div class="item-align-center">
                <svg class="svg-arrow _right">
                  <use xlink:href="#svg-arrow"></use>
                </svg>
              </div>
            </div>
            <!-- /.item-goods -->
            <div class="tag-block _random">
              <span v-if="index < 6" v-for="(item, index) in tagsList" :key="index" class="tag tag-lg _ellipsis">
                {{ item }}
              </span>
            </div>
            <!-- /.tag-block -->
            <div class="flex layout-column">
              <a @click="goRouter('Fans')" class="item">
                <div class="num">{{ userCenterInfo.fansNum }}</div>
                <div class="text">粉丝</div>
              </a>
              <a @click="goRouter('Focus')" class="item">
                <div class="num">{{ userCenterInfo.followNum }}</div>
                <div class="text">关注</div>
              </a>
              <a @click="goRouter('Coupon')" class="item">
                <div class="num">{{ userCenterInfo.couponNum }}</div>
                <div class="text">优惠券</div>
              </a>
              <a @click="goCentRouter(userCenterInfo.centAmount)" class="item">
                <div class="num">{{ userCenterInfo.centAmount }}</div>
                <div class="text">积分兑换</div>
              </a>
            </div>
            <!-- /.layout-column -->
          </div>
          <!-- /.center-header-body -->
          <div class="center-header-footer content-block-title">
            <div class="title">
              <svg :class="['svg-vip-solid', 'svg-grad'+(userCenterInfo.level.id-1)+'']">
                <use :xlink:href="['#svg-grad'+(userCenterInfo.level.id-1)+'']" />
              </svg>
              {{ LEVELS[userCenterInfo.level.id-1]?LEVELS[userCenterInfo.level.id-1].text:'' }}
            </div>
            <a href="vip.html" class="item-right">
              点击查看特权
              <svg class="svg-arrow _right">
                <use xlink:href="#svg-arrow"></use>
              </svg>
            </a>
          </div>
          <!-- /.center-header-footer -->
        </div>
        <!-- /.center-header -->
      </div>
      <!-- /.center-header-wrap -->

      <div class="card card-order">
        <div class="card-header _border-bottom">
          <div class="item-left">
            我的订单
          </div>
          <!-- /.item-left -->
          <a href="javascript:;" @click="goOrderRouter(null)" class="item-right">
            <span class="text">查看全部订单</span>
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow"></use>
            </svg>
          </a>
          <!--/.item-right -->
        </div>
        <!-- /.card-header -->
        <div class="card-body">
          <div class="flex layout-column">
            <a href="javascript:;" @click="goOrderRouter('PENDING_PAID')" class="item">
              <div class="icon-wrap">
                <svg class="icon svg-wallet">
                  <use xlink:href="#svg-wallet"></use>
                </svg>
                <div v-if="userCenterInfo.pendingPaymentNum" class="badge">{{ userCenterInfo.pendingPaymentNum }}</div>
              </div>
              <div class="text">待付款</div>
            </a>
            <a href="javascript:;" @click="goOrderRouter('PENDING_DELIVER')" class="item">
              <div class="icon-wrap">
                <svg class="icon svg-deliver">
                  <use xlink:href="#svg-deliver"></use>
                </svg>
                <div v-if="userCenterInfo.pendingDeliverNum" class="badge">{{ userCenterInfo.pendingDeliverNum }}</div>
              </div>
              <div class="text">待发货</div>
            </a>
            <a href="javascript:;" @click="goOrderRouter('PENDING_RECEIVE')" class="item">
              <div class="icon-wrap">
                <svg class="icon svg-receiving">
                  <use xlink:href="#svg-receiving"></use>
                </svg>
                <div v-if="userCenterInfo.pendingReceiptNum" class="badge">{{ userCenterInfo.pendingReceiptNum }}</div>
              </div>
              <div class="text">待收货</div>
            </a>
            <a href="javascript:;" @click="goOrderRouter('COMPLETED')" class="item">
              <div class="icon-wrap">
                <svg class="icon svg-evalute">
                  <use xlink:href="#svg-evalute"></use>
                </svg>
                <div v-if="userCenterInfo.pendingEvaluateNum" class="badge">{{ userCenterInfo.pendingEvaluateNum }}</div>
              </div>
              <div class="text">待评价</div>
            </a>
            <a href="javascript:;" @click="goRouter('AfterSale', userCenterInfo.memberId)" class="item">
              <div class="icon-wrap">
                <svg class="icon svg-after-sale">
                  <use xlink:href="#svg-after-sale"></use>
                </svg>
                <div v-if="userCenterInfo.afterSaleNum" class="badge">{{ userCenterInfo.afterSaleNum }}</div>
              </div>
              <div class="text">退款售后</div>
            </a>
          </div>
          <!-- /.layout-column -->
        </div>
        <!-- /.card-body -->
      </div>
      <!-- /.card -->
      <a href="javascript:;" @click="goRouter('InvitingGift')" class="bulletin-column">
        <p class="item item-title">邀请享好礼</p>
        <p class="item item-subtitle">邀请好友拿好礼，好礼不重样</p>
      </a>
      <div class="center-link-column">
        <a href="javascript:;" @click="goRouter('Collect', 'commodity')" class="content-block-title _border">
          <div class="title">
            <svg class="svg-heart">
              <use xlink:href="#svg-heart"></use>
            </svg>
            我的收藏
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow"></use>
          </svg>
        </a>
        <!-- /.content-block-title -->
        <a href="javascript:;" @click="goCommunityRouter" class="content-block-title _border">
          <div class="title">
            <svg class="svg-topic icon">
              <use xlink:href="#svg-topic"></use>
            </svg>
            我的话题
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow"></use>
          </svg>
        </a>
        <!-- /.content-block-title -->
        <a href="javascript:;" @click="goAddressRouter" class="content-block-title _border">
          <div class="title">
            <svg class="svg-location icon">
              <use xlink:href="#svg-location"></use>
            </svg>
            我的地址
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow"></use>
          </svg>
        </a>
        <!-- /.content-block-title -->
        <a href="javascript:;" @click="goRouter('InvitedPeople')" class="content-block-title  ">
          <div class="title">
            <svg class="svg-invitation icon">
              <use xlink:href="#svg-invitation"></use>
            </svg>
            我邀请的人
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow"></use>
          </svg>
        </a>
        <!-- /.content-block-title -->
      </div>
      <!-- /.center-link-column -->

      <div class="center-link-column">
        <a href="javascript:;" @click="goRouter('HelpCenter')" class="content-block-title _border">
          <div class="title">
            <svg class="svg-service icon">
              <use xlink:href="#svg-service"></use>
            </svg>
            客服与帮助
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow"></use>
          </svg>
        </a>
        <!-- /.content-block-title -->
        <a href="javascript:;" @click="goRouter('About')" class="content-block-title  ">
          <div class="title">
            <svg class="svg-about icon">
              <use xlink:href="#svg-about"></use>
            </svg>
            关于IN ESSENCE
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow"></use>
          </svg>
        </a>
        <!-- /.content-block-title -->
      </div>
      <!-- /.center-link-column -->
      <div class="center-link-column">
        <a href="javascript:;" @click="goAccountRouter" class="content-block-title  ">
          <div class="title">
            <svg class="svg-safe icon">
              <use xlink:href="#svg-safe"></use>
            </svg>
            账号安全
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow"></use>
          </svg>
        </a>
        <!-- /.content-block-title -->
      </div>
      <!-- /.center-link-column -->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import NavBar from '@/components/NavBar'
import NAV_TYPES from '@/constants/navType'
import axios from '@/configs/axios'
import { Toast } from 'rocoui'
import LEVELS from '@/constants/memberLevel'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  name: 'Index',
  components: {
    NavBar
  },
  data() {
    return {
      NAV_TYPES,
      LEVELS,
      userCenterInfo: {
        level: {
          id: null
        }
      },
      tagsList: []
    }
  },
  beforeCreate() {
    this.$store.dispatch('cartGetQuantity')
  },
  created() {
    // 获取个人中心信息
    this.getCenterInfo()
  },
  methods: {
    // 获取个人中心信息
    getCenterInfo() {
      let promise = axios
        .get(`/api/wap/members/getMemberCenterInfo`)
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.userCenterInfo = res.data.data
            this.tagsList = this.userCenterInfo.tagsList.split(',')
          }
        })
      Toast.loading('加载中...', promise)
    },
    // 路由跳转
    goRouter(name, value) {
      this.$router.push({
        name: 'Mine' + name,
        query: { value }
      })
    },
    // 路由跳转到订单模块
    goOrderRouter(type) {
      this.$router.push({
        name: 'MineOrder',
        query: { type }
      })
    },
    // 路由跳转到账号安全
    goAccountRouter() {
      sessionStorage.setItem('mobile', this.userCenterInfo.mobile)
      let mobile = this.userCenterInfo.mobile
      let currentMobile =
        mobile.substring(0, 3) + '****' + mobile.substring(7, 11)
      if (this.userCenterInfo.mobile) {
        // 已绑定手机号，直接跳到展示、更换页面
        this.$router.push({
          name: 'MineAccountSecurity',
          query: { mobile: currentMobile }
        })
      } else {
        // 未绑定手机号，去绑定
        this.$router.push({
          name: 'MineAccountSecuritySetPhone'
        })
      }
    },
    // 跳转到其他模块
    goCentRouter(cent) {
      window.location.href = `vip.html#/cent?centBalance=${cent}`
    },
    goCommunityRouter() {
      window.location.href = `community.html#/Index/personalUser?id=${
        this.userCenterInfo.memberId
      }&forward=true`
    },
    goAddressRouter() {
      this.$router.push({
        name: 'UserAddressList'
      })
    }
  }
}
</script>
