import Vue from 'vue'
import Router from 'vue-router'
import BindPhone from '@/components/BindPhone'
import Cart from '@/pages/cart/Cart'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Cart
    },
    {
      path: '/bind/',
      name: 'BindPhone',
      component: BindPhone
    }
  ]
})
