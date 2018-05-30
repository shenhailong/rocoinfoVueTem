<template>
  <div class="wrap" :class="wrapClass">
    <!-- 显示请加class[_in] -->
    <transition name="filterfade">
      <!-- 筛选组件显示或者展开菜单时显示 -->
      <div class="mask-layer _in" v-show="maskShow" @click="maskClick"></div>
    </transition>

    <NavBar :type="navType" />
    <!--/.bar-tab-->
    <!-- 显示组件为精选 -->
    <div class="show bar-box-top bar-absolute-top" :class="{'bar-box-top-two':showModel==='Default'}">
      <header class="bar bar-nav">
        <a href="#/main/search" class="bar-item">
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
            <span class="badge badge-circle tag-primary _solid" v-if="unread"></span>
          </div>
        </a>
      </header>
      <!--/.bar-nav-->
      <div class="main-menu-box">
        <div class="main-menu _border">
          <!-- 菜单 -->
          <!-- 菜单箭头向下显示 -->
          <nav class="main-menu-link" v-show="svgClass==='_down'">
            <a href="javascript:;" class="item" v-for="(item, index) in navInfo" :key="index" :class="{_active:activeIndex==index}" @click.stop="navClick(index,item.id)">
              {{item.name}}
              <span class="badge" v-if="item.showHot">hot</span>
            </a>
          </nav>
          <!-- 菜单箭头向上显示 -->
          <div class="text" v-show="svgClass==='_up'">全部频道</div>
          <div class="item">
            <svg class="svg-arrow" :class="svgClass" @click="toggleMenu">
              <use xlink:href="#svg-arrow" />
            </svg>
          </div>
        </div>
        <!-- /.main-menu 展开菜单 -->
        <!-- 菜单箭头向上显示 -->
        <div class="tag-block columns4" v-show="svgClass=='_up'">
          <span class="tag tag-lg _ellipsis
" v-for="(item, index) in navInfo" :key="index" :class="{_active:activeIndex==index}" @click.stop="navClick(index,item.id)">{{item.name}}
            <!-- <span class="badge" v-if="item.showHot">hot</span> -->
          </span>
        </div>
      </div>
      <!-- /.main-menu-box -->
      <!-- 人气价格筛选 -->
      <!--
      注意，点击当前状态请在svg-triangle后加class[_click]
      -->
      <!-- 排序-商品列表,并且菜单未展开显示 -->
      <div class="bar bar-filter flex-between" :class="{disN:showModel!=='AllGoods'||svgClass==='_up'}">
        <div class="bar-item item-sort">
          <!-- 人气排序 -->
          <div class="item" @click="orderGoods('viewQuantity')">
            人气
            <div class="icon-triangle-wrap">
              <!-- 升序 -->
              <svg class="svg-triangle _up" :class="{_click:form.orderColumn==='viewQuantity'&&form.orderDirection==='ASC'}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-triangle"></use>
              </svg>
              <!-- 降序 -->
              <svg class="svg-triangle _down" :class="{_click:form.orderColumn==='viewQuantity'&&form.orderDirection==='DESC'}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-triangle"></use>
              </svg>
            </div>
          </div>
          <!-- 价格排序 -->
          <div class="item" @click="orderGoods('price')">
            价格
            <div class="icon-triangle-wrap">
              <!-- 升序 -->
              <svg class="svg-triangle _up" :class="{_click:form.orderColumn==='price'&&form.orderDirection==='ASC'}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-triangle"></use>
              </svg>
              <!-- 降序 -->
              <svg class="svg-triangle _down" :class="{_click:form.orderColumn==='price'&&form.orderDirection==='DESC'}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-triangle"></use>
              </svg>
            </div>
          </div>
        </div>
        <div class="bar-item item-filter" @click="makeFilter">
          筛选
          <svg class="svg-filter">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-filter"></use>
          </svg>
        </div>
      </div>
    </div>
    <!-- 筛选组件 -->
    <transition name="slideRight">
      <GoodsFilter v-show="showFilter" @doFilter="filterGoods" :catalogs="catalogs" :useGroups="useGroups" :tags="tags" />
    </transition>
    <!-- 内容区 -->
    <div class="content" id="scrollContent">
      <!-- props:显示组件,限时购限量试用,推荐,banner,是否显示倒计时,商品列表-->
      <component :is="showModel" :limitedActivity="limitedActivity" :recommend="recommend" :banners="banners" :runTimeLimit="runTimeLimit" :pageData="pageData" ref="limit" />
      <!-- 上拉加载,显示组件是商品列表并且有商品 -->
      <infinite-loading :on-infinite="getGoods" ref="infinite" v-show="showModel==='AllGoods'&&!pageData.noGoods" :key="infiniteKey" spinner="circles">
        <span slot="no-results" style="display:none;"></span>
        <img slot="no-more" class="tips-nolist" src="static/images/img-footer.png" alt="-已经到底了-">
      </infinite-loading>
    </div>
    <div class="float-window">
      <ScrollTop :container="'#scrollContent'"></ScrollTop>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import ScrollTop from '@/components/ScrollTop'
// 精选
import Default from './Default'
// 商品列表
import AllGoods from './AllGoods'
// 领券中心
import Coupon from './Coupon'
// 商品筛选
import GoodsFilter from './subpage/Filter'
// 底部导航
import NavBar from '@/components/NavBar'
// 导航常量
import NavType from '@/constants/navType'
import { Toast } from 'rocoui'
import createQRcodeModal from '@/components/QRcodeModal'
import InfiniteLoading from 'vue-infinite-loading'
export default {
  name: 'Main',
  data() {
    return {
      showModel: 'Default', // 默认显示模块首页
      showFilter: false, // 显示筛选组件
      svgClass: '_down', // 导航切换svg-向下
      maskShow: false, // 导航展开mask
      activeIndex: 0, // 默认精选
      navInfo: [{ name: '精选' }, { name: '领券中心', showHot: true }, { name: '全部商品' }], // 导航
      banners: [], // banner
      catalogs: [], // 筛选-分类
      useGroups: [], // 筛选-使用人群
      tags: [], // 筛选-功效
      catalogsCopy: null, // 分类备份
      useGroupsCopy: null, // 使用人群备份
      tagsCopy: null, // 功效备份
      unread: 0, // 未读消息数
      // 限时购-限量试用
      limitedActivity: {
        timeLimitedActivity: { endTime: 0 }, // 限时购
        quantityLimitedActivity: null // 限量试用活动
      },
      runTimeLimit: true, // 运行限时购倒计时
      // 推荐系列
      recommend: {
        like: [], // 猜你喜欢
        newProducts: [], // 新品速递
        faddishProducts: [] // 人气爆款
      },
      // 商品列表请求参数
      form: {
        offset: 0,
        limit: 8,
        keyword: null, // 搜索关键字
        catalogs: null, // 分类ID
        useGroups: null, // 适用人群名称
        tags: null, // 功效名称
        orderColumn: null,
        orderDirection: null
      },
      pageData: {
        goods: [],
        noGoods: false
      },
      // 过滤时的key
      filters: ['catalogs', 'useGroups', 'tags'],
      navType: NavType.INDEX,
      infiniteKey: 'AllGoods'
    }
  },
  computed: {
    wrapClass() {
      let _class = 'wrap-index'
      if (this.showModel === 'AllGoods') {
        _class = 'wrap-index wrap-list-all-goods'
      } else if (this.showModel === 'Coupon') {
        _class = 'wrap-index wrap-coupons'
      }
      return _class
    }
  },
  created() {
    this.initData()
    // 商品列表刷新页面
    if (this.$route.query.active) {
      this.activeIndex = this.$route.query.active
      this.form.catalogs = this.$route.query.catalogs || null
      this.showModel = 'AllGoods'
    }
  },
  beforeCreate() {
    this.$store.dispatch('cartGetQuantity')
  },
  methods: {
    initData() {
      let promise = axios.all([
        // banner 分类 使用人群 消息数
        axios.get('/api/wap/index/constant'),
        // 限时购 限量试用
        axios.get('/api/wap/index/activity'),
        // 猜你喜欢 人气爆款 新品速递
        axios.get('/api/wap/index/recommend')
      ]).then(axios.spread((constant, activity, recommend) => {
        // banner 分类 使用人群 消息数
        if (constant.data.code === '1') {
          // banner
          this.banners = constant.data.data.banners
          // 消息数
          this.unread = constant.data.data.unread
          // 分类
          constant.data.data.catalogs.forEach(item => {
            item.active = false
          })
          // 使用人群
          constant.data.data.useGroups.forEach(item => {
            this.useGroups.push({
              name: item,
              active: false
            })
          })
          // 功效
          constant.data.data.tags.forEach(item => {
            this.tags.push({
              name: item,
              active: false
            })
          })
          // 分类添加到导航
          this.navInfo.push(...constant.data.data.catalogs)
          // 当前在某个分类则分类筛选 [] 反之赋值
          if (this.form.catalogs) {
            this.catalogs = []
          } else {
            this.catalogs = constant.data.data.catalogs
          }
          // 分类备份-筛选重置用到
          this.catalogsCopy = JSON.stringify(constant.data.data.catalogs || [])
          // 使用人群备份
          this.useGroupsCopy = JSON.stringify(this.useGroups)
          // 功效备份
          this.tagsCopy = JSON.stringify(this.tags)
        }
        // 限时购 限量试用
        if (activity.data.code === '1') {
          this.limitedActivity = activity.data.data || {}
        }
        // 如果限时购不存在则清除定时器
        if (!this.limitedActivity.timeLimitedActivity || !this.limitedActivity.timeLimitedActivity.endTime) {
          // 显示限时购倒计时
          this.runTimeLimit = false
          try {
            clearInterval(this.$refs.limit.runTimer)
          } catch (e) {
            console.error(e)
          }
        }
        // 猜你喜欢 人气爆款 新品速递
        if (recommend.data.code === '1') {
          this.recommend = recommend.data.data || {}
        }
      })).finally(() => {
        // 判断是否关注公众号及是否购买晋级金卡大礼包
        createQRcodeModal()
      })
      Toast.loading('正在加载...', promise)
    },
    // 点击导航, 下标, 分类id
    navClick(index, id) {
      // 使用replace 不产生路由历史,防止在首页前进后退
      // 高亮导航
      this.activeIndex = index
      // mask隐藏
      this.maskShow = false
      // 导航箭头向下
      this.svgClass = '_down'
      // >1 非精选非领券中心
      if (index > 1) {
        // 商品列表
        this.showModel = 'AllGoods'
        this.$router.replace({
          path: '/main',
          query: { active: index, catalogs: id }
        })
        this.form = {
          offset: 0,
          limit: 8,
          keyword: null, // 搜索关键字
          catalogs: id || null, // 分类ID
          useGroups: null, // 适用人群名称
          tags: null, // 功效名称
          orderColumn: null,
          orderDirection: null
        }
        // 清空商品
        this.pageData = {
          goods: [],
          noGoods: false
        }
        // 重置使用人群
        this.useGroups = JSON.parse(this.useGroupsCopy)
        // 重置功效
        this.tags = JSON.parse(this.tagsCopy)
        // id存在即非全部商品,筛选里不显示分类
        if (id) {
          this.catalogs = null
        } else {
          this.catalogs = JSON.parse(this.catalogsCopy)
        }
        // 让infiniteLoad组件重新渲染
        if (this.infiniteKey === 'AllGoods') {
          this.infiniteKey = '_AllGoods'
        } else {
          this.infiniteKey = 'AllGoods'
        }
      } else if (!index) {
        // 精选,index 为0
        this.$router.replace({
          path: '/main'
        })
        this.showModel = 'Default'
      } else {
        // 领券中心
        this.$router.replace({
          path: '/main'
        })
        this.showModel = 'Coupon'
      }
    },
    // 展开,收起菜单
    toggleMenu() {
      if (this.svgClass === '_up') {
        this.svgClass = '_down'
        this.maskShow = false
      } else {
        this.svgClass = '_up'
        this.maskShow = true
      }
    },
    // 点击mask
    maskClick() {
      this.svgClass = '_down'
      this.maskShow = false
      this.showFilter = false
    },
    // 点击筛选
    makeFilter() {
      this.showFilter = true
      this.maskShow = true
    },
    // 筛选商品
    filterGoods() {
      this.showFilter = false
      this.maskShow = false
      this.pageData = {
        goods: [],
        noGoods: false
      }
      this.form.offset = 0
      this.filters.forEach(key => {
        let result = ''
        // 从分类,使用人气,功效里边找出选中的
        this[key] && this[key].forEach(item => {
          if (item.active) {
            if (!result) {
              result = item.id || item.name
            } else {
              result += ',' + (item.id || item.name)
            }
          }
        })
        // 设置对应的查询条件
        if (result) {
          this.form[key] = result
        } else {
          this.form[key] = null
        }
      })
      // 当前导航处在某个分类设置分类
      this.form.catalogs = this.form.catalogs || this.$route.query.catalogs
      // 让infiniteLoad组件重新渲染
      if (this.infiniteKey === 'AllGoods') {
        this.infiniteKey = '_AllGoods'
      } else {
        this.infiniteKey = 'AllGoods'
      }
    },
    // 排序商品
    orderGoods(key) {
      // 点击的和当前排序的不一样
      if (this.form.orderColumn !== key) {
        this.form.orderColumn = key
        if (key === 'viewQuantity') {
          // 人气默认降序
          this.form.orderDirection = 'DESC'
        } else if (key === 'price') {
          // 价格默认升序
          this.form.orderDirection = 'ASC'
        }
      } else {
        // 连续点击价格或者人气
        this.form.orderDirection = this.form.orderDirection === 'DESC' ? 'ASC' : 'DESC'
      }
      this.pageData = {
        goods: [],
        noGoods: false
      }
      this.form.offset = 0
      // 让infiniteLoad组件重新渲染
      if (this.infiniteKey === 'AllGoods') {
        this.infiniteKey = '_AllGoods'
      } else {
        this.infiniteKey = 'AllGoods'
      }
    },
    getGoods() {
      if (this.showModel === 'AllGoods') {
        if (this.pageData.goods.length) {
          this.form.offset += this.form.limit
        }
        let promise = axios.get('/api/wap/product/list', { params: this.form }).then(res => {
          if (res.data.code === '1') {
            this.pageData.goods.push(...res.data.data.rows)
            this.$refs.infinite.$emit('$InfiniteLoading:loaded') // 加载完成
            if (res.data.data.rows.length < this.form.limit) {
              this.$refs.infinite.$emit('$InfiniteLoading:complete') // 没有更多数据了
            }
          } else {
            this.$refs.infinite.$emit('$InfiniteLoading:complete') // 没有更多数据了
          }
          if (!this.pageData.noGoods && !this.pageData.goods.length) {
            this.pageData.noGoods = true
          }
        })
        if (!this.pageData.goods.length) {
          Toast.loading('正在加载...', promise)
        }
        // console.log('getgoods')
      } else {
        this.$refs.infinite.$emit('$InfiniteLoading:complete') // 没有更多数据了
      }
    }
  },
  components: {
    ScrollTop,
    Default,
    AllGoods,
    Coupon,
    GoodsFilter,
    NavBar,
    InfiniteLoading
  }
}
</script>
