<template>
  <div class="wrap wrap-center-bind-phone">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">身份验证</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <div v-if="codeFlag" class="text-info">
        <div class="text">验证码已发送<br/>请输入手机号{{ $route.query.mobile }}接收到的验证码</div>
      </div>
      <form action="" @submit.prevent="goChangeMobile" class="form-normal form-bind-phone">
        <div class="input-cloumn">
          <div class="item-input">
            <input type="text" placeholder="请输入验证码" v-model="verifyCode">
          </div>
          <a href="javascript:;" v-if="codeFlag" class="btn-normal btn-disabled _solid btn-lg">
            {{ this.leftTime }}s重新获取
          </a>
          <a href="javascript:;" v-else @click="getCode"
            class="btn-normal btn-primary _solid btn-lg">
            {{ reGetCode ? '重新获取' : '获取验证码' }}
          </a>
        </div>
        <div class="button-block">
          <button v-if="nextFlag" class="btn-normal btn-primary _solid btn-xxl">下一步</button>
          <button type="button" v-else class="btn-normal _solid btn-xxl">下一步</button>
        </div>
      </form>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import { Toast } from 'rocoui'
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'MineAccountSecurityVerifyId',
  data () {
    return {
      codeFlag: false,
      nextFlag: false,
      leftTime: 59,
      verifyCode: '',
      reGetCode: false,
      validMsg: ''
    }
  },
  watch: {
    // 监听验证码输入框
    verifyCode (val) {
      if (val !== '') {
        this.nextFlag = true
      }
    }
  },
  methods: {
    // 获取验证码
    getCode () {
      let promise = axios.get(`/api/wap/members/sendAuthenticationVerifyCode`)
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
    },
    // 下一步路由跳转
    goChangeMobile () {
      if (this.validCode()) {
        let promise = axios.post(`/api/wap/members/checkAuthenticationVerifyCode`, {
          mobile: sessionStorage.getItem('mobile'),
          verifyCode: this.verifyCode
        }).then(res => {
          if (res.data.code === CODE_SUCCESS) {
            Toast.success('验证成功', 2)
            this.$router.push({
              name: 'MineAccountSecuritySetPhone'
            })
          } else {
            Toast.fail(res.data.message, 2)
          }
        })
        Toast.loading('正在验证身份...', promise)
      } else {
        Toast.fail(this.validMsg, 2)
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

