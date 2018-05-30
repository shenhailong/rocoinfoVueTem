import Vue from 'vue'
import Router from 'vue-router'
import ProductDetail from '@/components/Product/Detail'
import ProductEvaluation from '@/components/Product/Evaluation'
import Search from '@/components/Search/Search'
import SearchResult from '@/components/Search/SearchResult'
import CommonList from '@/components/CommonList'
import Activity from '@/pages/Activity'
import MainIndex from '@/pages/main/Index'
import Equities from '@/pages/vip/equities/List'
import BindPhone from '@/components/BindPhone'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { path: '/main' }
    },
    {
      path: '/main',
      name: 'Index',
      meta: { index: 1 },
      component: MainIndex
    },
    {
      path: '/product/:pid',   // query skuId placeOrderType isQuantityLimitedList = true
      name: 'ProductDetail',
      meta: { index: 10 },
      component: ProductDetail
    },
    {
      path: '/product/:skuId/evaluation',
      name: 'ProductEvaluation',
      meta: { index: 11 },
      component: ProductEvaluation
    },
    {
      path: '/main/commonList', // 从首页进入 猜你喜欢 | 新品速递
      name: 'MainCommonList',
      meta: { index: 2 },
      component: CommonList
    },
    {
      path: '/main/search', // 从首页进入 搜素页面
      name: 'Search',
      meta: { index: 3 },
      component: Search
    },
    {
      path: '/main/search/searchResult', // 从搜素页面进入 搜索结果
      name: 'SearchResult',
      meta: { index: 4 },
      component: SearchResult
    },
    {
      path: '/main/search/searchResult/commonList', // 从搜索结果进入猜你喜欢
      name: 'SearchCommonList',
      meta: { index: 5 },
      component: CommonList
    },
    {
      path: '/activity/:type/:activityId',        // 从首页或商品详情页进入活动列表页
      name: 'Activity',
      meta: { index: 6 },
      component: Activity
    },
    {
      path: '/vip/:type/',                      // 从vip会员页进入半价试用列表或会员商品列表页
      name: 'VipEquities',
      meta: { index: 7 },
      component: Equities
    },
    {
      path: '/bind/',
      name: 'BindPhone',
      meta: { index: 20 },
      component: BindPhone
    }
  ]
})
