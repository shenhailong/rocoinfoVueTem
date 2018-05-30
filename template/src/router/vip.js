import Vue from 'vue'
import Router from 'vue-router'
import Vip from '@/pages/vip/Index'
import Cent from '@/pages/vip/Cent'
import Equities from '@/pages/vip/equities/List'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',                               // vip会员首页
      name: 'Index',
      meta: { index: 1 },
      component: Vip
    },
    {
      path: '/cent/',                          // 积分
      name: 'VipCent',
      meta: { index: 2 },
      component: Cent
    },
    {
      path: '/vip/:type/',                      // 从vip会员页进入半价试用列表或会员商品列表页
      name: 'VipEquities',
      meta: { index: 3 },
      component: Equities
    }
  ]
})
