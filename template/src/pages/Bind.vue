<template>
  <div class="wrap wrap-invitation-coupons">
    <div class="content">
      <div class="invitation-header">
        <div class="coupons-wrap">
          <div class="coupons-header">
            <div class=" coupons-price-area">
              <div class="coupons-price">
                <em>￥</em>{{ coupon }}</div>
              <div class="coupons-text">购物券</div>
            </div>
          </div>
          <div class="coupons-content">
            <svg class="logo-company">
              <use xlink:href="#logo-company" />
            </svg>
            <p class="text-info">送您{{ coupon }}元无门槛礼券</p>
          </div>
        </div>
        <!-- /.coupons-wrap-->
      </div>
      <!-- /.invitation-header -->

      <div class="invitation-content">
        <form action="" @submit.prevent="obtainHandler" class="form-invitation">
          <div class="input-column">
            <input v-model="mobile" class="input-text" type="text" placeholder="请输入手机号">
          </div>
          <div class="input-column">
            <input v-model="verifyCode" class="input-text seccode-text" type="text" placeholder="请输入验证码">
            <div v-if="codeFlag" class="links-text ">{{ leftTime }}s重新获取</div>
            <div v-else @click="getCode" class="links-text text-primary">
              {{ reGetCode ? '重新获取' : '获取验证码' }}
            </div>
          </div>
          <button class="btn-normal btn-invitation">立即领取</button>
          <p class="text">绑定手机后即可获得{{ coupon }}元购物券一张</p>
        </form>
      </div>
      <!-- /.invitation-content -->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>
<script>
import { Toast } from 'rocoui'
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
import qs from '@/utils/qs'
import {routerTransitionMixin} from '@/mixin/router'
export default {
  name: 'Bind',
  mixins: [routerTransitionMixin],
  data () {
    return {
      coupon: null,
      mobile: '',
      verifyCode: '',
      validMsg: '',
      codeFlag: false,
      leftTime: 59,
      reGetCode: false,
      flag: true,
      urlObj: null
    }
  },
  computed: {
    routeQuery () {
      return this.$route.query ? this.$route.query : null
    }
  },
  created () {
    // 获取优惠券信息
    this.getCoupons()
    this.urlObj = qs()
    for(var name in this.urlObj) {
      if (!name) {
        this.flag = false
      } else {
        this.flag = true
        this.urlObj[name] = this.urlObj[name].substring(0, this.urlObj[name].lastIndexOf('?redirect'))
      }
    }
  },
  methods: {
    // 获取优惠券信息
    getCoupons () {
      let promise = axios.get('/api/wap/activity/invites/gift/coupon/get').then(res => {
        if (res.data.code === CODE_SUCCESS) {
          this.coupon = res.data.data.subtraction
        }
      })
      Toast.loading('加载中...', promise)
    },
    // 获取验证码
    getCode () {
      if (this.validPhone()) {
        let promise = axios.get('/api/wap/members/sendBindMobileVerifyCode', { mobile: this.mobile })
        .then(res => {
          if (res.data.code === CODE_SUCCESS) {
            Toast.success('发送成功，30分钟内有效', 2)
            this.codeFlag = true
            let leftTimer = setInterval(() => {
              this.leftTime --
              if (this.leftTime === 0) {
                clearInterval(leftTimer)
                // 重新获取
                this.codeFlag = false
                this.reGetCode = true
                this.leftTime = 59
              }
            }, 1000)
          }
        })
        Toast.loading('发送中...', promise)
      } else {
        Toast.fail(this.validMsg, 2)
      }
    },
    // 领取优惠券
    obtainHandler () {
      let paramObj = this.flag ? this.urlObj : null
      if (this.validPhone() && this.validCode()) {
        let promise = axios.post('/api/wap/members/bindMobile', {
          mobile: this.mobile,
          verifyCode: this.verifyCode,
          ...paramObj
        }).then(res => {
          if (res.data.code === CODE_SUCCESS) {
            Toast.success('领取成功', 2)
            setTimeout(() => {
              window.location.href = 'interest.html'
            }, 2001)
          }
        })
        Toast.loading('正在领取优惠券...', promise)
      } else {
        Toast.fail(this.validMsg, 2)
      }
    },

    // 校验手机号
    validPhone () {
      if (this.mobile === '') {
        this.validMsg = '手机号不能为空'
        return false
      } else if (!(/^1[34578]\d{9}$/.test(this.mobile))) {
        this.validMsg = '手机号格式不正确'
        return false
      } else {
        return true
      }
    },
    // 校验验证码
    validCode () {
      let code = this.verifyCode
      if (code === '') {
        this.validMsg = '验证码不能为空'
        return false
      } else if (!(/^[0-9]{6}$/.test(code))) {
        this.validMsg = '验证码输入不正确'
        return false
      } else {
        return true
      }
    }
  }
}
</script>
