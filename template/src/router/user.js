import Vue from 'vue'
import Router from 'vue-router'
import User from '@/pages/user/Index'
import PersonalInfo from '@/pages/user/PersonalInfo'
import Fans from '@/pages/user/Fans'
import Focus from '@/pages/user/Focus'
import Coupon from '@/pages/user/Coupon'
import Order from '@/pages/user/Order'
import AfterSale from '@/pages/user/AfterSale'
import InvitingGift from '@/pages/user/InvitingGift'
import Collect from '@/pages/user/Collect'
import Message from '@/pages/user/Message'
import InvitedPeople from '@/pages/user/InvitedPeople'
import HelpCenter from '@/pages/user/HelpCenter'
import About from '@/pages/user/About'
import AccountSecurity from '@/pages/user/AccountSecurity'

import PersonalInfoNickname from '@/pages/user/personalInfo/Nickname'
import PersonalInfoSignature from '@/pages/user/personalInfo/Signature'
import PersonalInfoTags from '@/pages/user/personalInfo/Tags'

import CouponCommodity from '@/pages/user/coupon/List'

import OrderDetail from '@/pages/user/order/Detail'
import OrderLogistics from '@/pages/user/order/Logistics'
import OrderEvaluate from '@/pages/user/order/Evaluate'
import OrderEvaluateEdit from '@/pages/user/order/EvaluateEdit'
import OrderPayment from '@/pages/user/order/Payment'
import OrderTrialReport from '@/pages/user/order/TrialReport'
import OrderAfterSaleApply from '@/pages/user/order/afterSale/Apply'
import OrderAfterSaleProgress from '@/pages/user/order/afterSale/Progress'

import InvitingGiftList from '@/pages/user/invitingGift/List'
import AccountSecurityVerifyId from '@/pages/user/accountSecurity/VerifyId'
import AccountSecuritySetPhone from '@/pages/user/accountSecurity/SetPhone'

import AddressAdd from '@/components/Address/Add'
import AddressList from '@/components/Address/List'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',                                    // 个人中心首页
      name: 'Index',
      meta: { index: 1 },
      component: User
    },
    {
      path: '/personalInfo/',                       // 个人信息
      name: 'MinePersonalInfo',
      meta: { index: 2 },
      component: PersonalInfo
    },
    {
      path: '/fans/',                               // 粉丝
      name: 'MineFans',
      meta: { index: 3 },
      component: Fans
    },
    {
      path: '/focus/',                              // 关注
      name: 'MineFocus',
      meta: { index: 4 },
      component: Focus
    },
    {
      path: '/coupon/',                             // 优惠券
      name: 'MineCoupon',
      meta: { index: 5 },
      component: Coupon
    },
    {
      path: '/order/',                              // 订单
      name: 'MineOrder',
      meta: { index: 6 },
      component: Order
    },
    {
      path: '/afterSale/',                          // 退款/售后
      name: 'MineAfterSale',
      meta: { index: 7 },
      component: AfterSale
    },
    {
      path: '/invitingGift/',                       // 邀请有礼
      name: 'MineInvitingGift',
      meta: { index: 8 },
      component: InvitingGift
    },
    {
      path: '/collect/',                            // 我的收藏
      name: 'MineCollect',
      meta: { index: 9 },
      component: Collect
    },
    {
      path: '/message/',                            // 我的消息
      name: 'MineMessage',
      meta: { index: 10 },
      component: Message
    },
    {
      path: '/invitedPeople/',                      // 我邀请的人
      name: 'MineInvitedPeople',
      meta: { index: 11 },
      component: InvitedPeople
    },
    {
      path: '/helpCenter/',                         // 客服与帮助
      name: 'MineHelpCenter',
      meta: { index: 12 },
      component: HelpCenter
    },
    {
      path: '/about/',                              // 关于IE
      name: 'MineAbout',
      meta: { index: 13 },
      component: About
    },
    {
      path: '/accountSecurity/',                    // 账号安全
      name: 'MineAccountSecurity',
      meta: { index: 14 },
      component: AccountSecurity
    },

    // 以下为个人信息部分
    {
      path: '/personalInfo/nickname/',    // 修改昵称
      name: 'MinePersonalInfoNickname',
      meta: { index: 15 },
      component: PersonalInfoNickname
    },
    {
      path: '/personalInfo/signature/',   // 修改个人签名
      name: 'MinePersonalInfoSignature',
      meta: { index: 16 },
      component: PersonalInfoSignature
    },
    {
      path: '/personalInfo/tags/',                  // 设置偏好标签
      name: 'MinePersonalInfoTags',
      meta: { index: 17 },
      component: PersonalInfoTags
    },

    // 以下为优惠券的子页面
    {
      path: '/coupon/list/',                         // 从未使用优惠券点击立即使用按钮进入商品列表
      name: 'MineCouponCommodity',
      meta: { index: 18 },
      component: CouponCommodity
    },


    // 以下为订单部分
    {
      path: '/order/detail/:orderId',                // 查看订单详情
      name: 'MineOrderDetail',
      meta: { index: 19 },
      component: OrderDetail
    },
    {
      path: '/order/logistics/',                     // 从订单详情中跳转到物流信息页面
      name: 'MineOrderLogistics',
      meta: { index: 20 },
      component: OrderLogistics
    },
    {
      path: '/order/evaluate/:orderId',              // 从我的订单或订单详情中跳转到评价晒单列表页面
      name: 'MineOrderEvaluate',
      meta: { index: 21 },
      component: OrderEvaluate
    },
    {
      path: '/order/evaluateEdit/:id',               // 从评价晒单列表点击进入评价输入页
      name: 'MineOrderEvaluateEdit',
      meta: { index: 22 },
      component: OrderEvaluateEdit
    },
    {
      path: '/order/payment/:res',                   // 从订单列表跳到订单详情去付款
      name: 'MineOrderPayment',
      meta: { index: 23 },
      component: OrderPayment
    },
    {
      path: '/order/trialReport/:orderId',           // 从订单列表跳到发布报告页面
      name: 'MineOrderTrialReport',
      meta: { index: 24 },
      component: OrderTrialReport
    },

    // 以下为订单售后页面
    {
      path: '/order/afterSale/apply/:orderId',       // 从订单详情中跳转到申请售后页面
      name: 'MineOrderAfterSaleApply',
      meta: { index: 25 },
      component: OrderAfterSaleApply
    },
    {
      path: '/order/afterSale/progress/:orderId',    // 从退款/售后列表跳转到售后进度页面
      name: 'MineOrderAfterSaleProgress',
      meta: { index: 26 },
      component: OrderAfterSaleProgress
    },

    // 以下为邀请有礼的子页面
    {
      path: '/invitingGift/list/',                   // 从邀请有礼进入查看赠品列表
      name: 'MineInvitingGiftList',
      meta: { index: 27 },
      component: InvitingGiftList
    },
    // 以下为账号安全的子页面
    {
      path: '/accountSecurity/verifyId/',            // 从账户安全-绑定手机号进入身份验证
      name: 'MineAccountSecurityVerifyId',
      meta: { index: 28 },
      component: AccountSecurityVerifyId
    },
    {
      path: '/accountSecurity/setPhone/',            // 从身份验证进入设置手机号
      name: 'MineAccountSecuritySetPhone',
      meta: { index: 29 },
      component: AccountSecuritySetPhone
    },
    {
      path: '/address/',
      name: 'UserAddressList',
      meta: { index: 30, suffix: 'User' },
      component: AddressList
    },
    {
      path: '/address/add/',
      name: 'UserAddressAdd',
      meta: { index: 31, suffix: 'User' },
      component: AddressAdd
    },
    {
      path: '/address/:aid/',
      name: 'UserAddressEdit',
      meta: { index: 32, suffix: 'User' },
      component: AddressAdd
    }
  ]
})
