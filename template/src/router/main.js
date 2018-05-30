import Vue from 'vue'
import Router from 'vue-router'
import MainIndex from '@/pages/main/Index'
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
    }
  ]
})
