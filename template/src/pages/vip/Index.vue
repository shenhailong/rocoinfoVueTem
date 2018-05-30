<template>
  <div class="wrap wrap-vip-index">
    <nav-bar :type="NAV_TYPES.VIP"></nav-bar>
    <div class="content" id="scrollContent">
      <div class="member-card-box">
        <div class="member-card-header flex-end">
          <a href="javascript:;">等级规则</a>
        </div>
        <!--
          注意：定义等级背景色和进度条颜色的class是【_card-grade-0】，
              总共6个等级，从0到6，数字递增，默认是0级
        -->
        <div :class="['member-card', '_card-grade-'+(vipInfo.currentLevelNum-1)+'']">
          <div class="member-grade-column">
            <div class="member-grade-box">
              <div class="author-avatar">
                <img src="static/images/member-logo.png" alt="avatar">
              </div>
              <div class="icon-member-grade">
                <svg class="svg-member-grade">
                  <use xlink:href="#svg-member-grade" />
                </svg>{{ vipInfo.currentLevelNum-1 }}
              </div>
              <span class="text">{{ vipInfo.currentLevelName }}</span>
            </div>
            <!-- /.member-grade -->
            <div @click="goRouterCent" class="tag">积分{{ vipInfo.centBalance }}</div>
          </div>
          <!-- /.member-grade-column -->
          <div v-if="vipInfo.currentLevelNum!==7">
            <div class="progress-colunm">
              <svg v-if="vipInfo.currentLevelNum!==1" :class="['svg-icon', 'svg-grad'+(vipInfo.currentLevelNum-1)+'']">
                <use :xlink:href="['#svg-grad'+(vipInfo.currentLevelNum-1)+'']" />
              </svg>
              <div class="progress">
                <div :style="{width: vipInfo.levelCent/vipInfo.nextCentMin*100 + '%'}" class="progress-bar"></div>
                <div class="text">
                  <span class="current-value">{{ vipInfo.levelCent }}</span>/{{ vipInfo.nextCentMin }}
                </div>
              </div>
              <svg :class="['svg-icon', 'svg-grad'+vipInfo.currentLevelNum+'']">
                <use :xlink:href="['#svg-grad'+vipInfo.currentLevelNum+'']" />
              </svg>
            </div>
            <!-- /.progress-colunm -->
            <div v-if="vipInfo.currentLevelNum>1" class="text-tips text-center">
              {{ vipInfo.clearLevelCentTime }} 0点前,再获得{{ vipInfo.nextCentMin-vipInfo.levelCent }}积分升级为{{ vipInfo.nextLevelName }}
            </div>
          </div>
          <!-- 升到最高级 -->
          <div v-else class="text-tips text-lg text-center">
            <svg class="svg-vip">
              <use xlink:href="#svg-vip" />
            </svg>
            <div class="text">恭喜您！已升至最高等级</div>
          </div>
        </div>
        <!-- /.member-card -->
      </div>
      <!-- /.member-card-box -->
      <div class="member-block-title">
        <div class="item-title">会员特权</div>
        <div class="item-subtitle">查看不同级别会员服务特权</div>
      </div>
      <!-- /.member-block-title -->

      <div class="member-privilege-box">
        <div class="layout-column">
          <a href="javascript:;" v-for="item in vipInfo.equitiesList" :key="item.id" @click="rightsTab(item)" :class="['item', {'_light':item.have, '_current':currentSelected===item.id&&item.have}]">
            <svg :class="['icon', 'svg-privilege'+item.id+'']">
              <use :xlink:href="['#svg-privilege'+item.id+'']"></use>
            </svg>
            <div class="text">{{ item.name }}</div>
          </a>
        </div>
        <!-- /.layout-column -->
        <div v-if="isHasPrivilege" class="member-privilege-content">
          <component :is="currentView" :privilegeInfo="privilegeInfo"></component>
        </div>
        <!-- /.member-privilege-content -->
      </div>
      <!-- /.member-privilege-box -->
      <div v-if="vipInfo.vipSkuList.length > 0">
        <member-commodity :commodityList="vipInfo.vipSkuList"></member-commodity>
      </div>
    </div>
    <!-- /.content -->
    <div class="float-window">
      <ScrollTop :container="'#scrollContent'"></ScrollTop>
    </div>
    <!-- /.float-window -->
    <input type="file" capture="aa">
  </div>
  <!-- /.wrap -->
</template>

<script>
import NavBar from '@/components/NavBar'
import NAV_TYPES from '@/constants/navType'
import ScrollTop from '@/components/ScrollTop'
import axios from 'axios'
import { Toast, Modal } from 'rocoui'
import halfPrice from './equities/HalfPrice' // 半价试用
import coupon from './equities/Coupon' // 优惠券
import birthday from './equities/Birthday' // 生日礼
import promotion from './equities/Promotion' // 晋级礼
import timeLimited from './equities/TimeLimited' // 限时购
import freeTrial from './equities/FreeTrial' // 新品免费试用
import expert from './equities/Expert' // 专家服务
import MemberCommodity from './equities/MemberCommodity' // 会员商品
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  name: 'Index',
  components: {
    NavBar,
    ScrollTop,
    halfPrice,
    coupon,
    birthday,
    promotion,
    timeLimited,
    freeTrial,
    expert,
    MemberCommodity
  },
  data() {
    return {
      NAV_TYPES,
      vipInfo: {
        vipSkuList: []
      },
      currentView: 'halfPrice',
      currentSelected: 1,
      isHasPrivilege: true,
      privilegeInfo: {
        halfPriceNum: 0
      }
    }
  },
  beforeCreate() {
    this.$store.dispatch('cartGetQuantity')
  },
  created () {
    // 获取vip会员信息
    this.getVipInfo()
  },
  methods: {
    // 获取vip会员信息
    getVipInfo () {
      let promise = axios.get(`/api/wap/memberVIP/list`).then(res => {
        if (res.data.code === CODE_SUCCESS) {
          this.vipInfo = res.data.data
          this.privilegeInfo.halfPriceNum = this.vipInfo.halfPriceNum
          this.vipInfo.equitiesList.forEach(item => {
            if (item.id === 1 && !item.have) {
              this.isHasPrivilege = false
            }
          })
        }
      })
      Toast.loading('加载中...', promise)
    },
    // 切换权益tab
    rightsTab (item) {
      // 根据have字段判断是否可以切换tab
      if (item.have) {
        this.currentSelected = item.id
        switch (item.id) {
          case 1:
            this.currentView = 'halfPrice'
            break
          case 2:
            this.currentView = 'coupon'
            break
          case 3:
            this.currentView = 'birthday'
            break
          case 4:
            this.currentView = 'promotion'
            break
          case 5:
            this.currentView = 'timeLimited'
            let promise = axios.get(`/api/wap/index/timeLimitedActivity`)
            .then(res => {
              if (res.data.code === CODE_SUCCESS) {
                this.privilegeInfo = res.data.data
              }
            })
            Toast.loading('正在加载...', promise)
            break
          case 6:
            this.currentView = 'freeTrial'
            break
          default:
            this.currentView = 'expert'
            break
        }
        // 专家服务特权不需要调接口
        if (item.id !== 5 && item.id !== 7) {
          let promise = axios.get(`/api/wap/memberVIP/${item.id}/${this.currentView}Equities`)
          .then(res => {
            if (res.data.code === CODE_SUCCESS) {
              this.privilegeInfo = res.data.data
            }
          })
          Toast.loading('正在加载...', promise)
        }
      } else {
        Modal.confirm({
          title: '没有该特权',
          okText: '确定',
          cancelText: '取消',
          body: '是否要跳到等级规则页面？',
          okCb: function(){
            // Modal.alert({body: '你点击了确认'})
          }
        })
      }
    },
    // 点击积分跳转到积分流水明细页
    goRouterCent () {
      this.$router.push({
        name: 'VipCent',
        query: { centBalance: this.vipInfo.centBalance }
      })
    }
  }
}
</script>
