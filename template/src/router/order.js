import Vue from 'vue'
import Router from 'vue-router'
import Order from '@/pages/order/Order'
import Success from '@/pages/order/Success'
import Failure from '@/pages/order/Failure'
import AddressAdd from '@/components/Address/Add'
import AddressList from '@/components/Address/List'
import IdCard from '@/pages/order/IdCard'
import Coupon from '@/pages/order/Coupon'
import Invoice from '@/pages/order/Invoice'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'OrderIndex',
      meta: { index: 1, suffix: 'Order' },
      component: Order
    },
    {
      path: '/payment/success/',
      name: 'OrderSuccess',
      meta: { index: 2, suffix: 'Order' },
      component: Success
    },
    {
      path: '/payment/failure/',
      name: 'OrderFailure',
      meta: { index: 3, suffix: 'Order' },
      component: Failure
    },
    {
      path: '/id/', // query name mobile
      name: 'OrderIdCard',
      meta: { index: 4, suffix: 'Order' },
      component: IdCard
    },
    {
      path: '/coupon/',
      name: 'OrderCoupon',
      meta: { index: 5, suffix: 'Order' },
      component: Coupon
    },
    {
      path: '/invoice/',
      name: 'OrderInvoice',
      meta: { index: 6, suffix: 'Order' },
      component: Invoice
    },
    {
      path: '/address/',
      name: 'OrderAddressList',
      meta: { index: 11, suffix: 'Order' },
      component: AddressList
    },
    {
      path: '/address/add/',
      name: 'OrderAddressAdd',
      meta: { index: 12, suffix: 'Order' },
      component: AddressAdd
    },
    {
      path: '/address/:aid/',
      name: 'OrderAddressEdit',
      meta: { index: 13, suffix: 'Order' },
      component: AddressAdd
    }
  ]
})
