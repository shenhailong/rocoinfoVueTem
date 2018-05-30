<template>
  <div class="wrap wrap-center-bind-phone">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">{{ currentMobile?'更换':'绑定' }}手机号</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <form action="" @submit.prevent="completeBind" class="form-normal form-bind-phone">
        <div class="input-cloumn">
          <div class="item-input">
            <input type="text" placeholder="请输入新手机号" v-model="mobile">
          </div>
          <a href="javascript:;" v-if="codeFlag" class="btn-normal btn-disabled _solid btn-lg">
            {{ leftTime }}s重新获取
          </a>
          <a href="javascript:;" v-else @click="getCode"
            class="btn-normal btn-primary _solid btn-lg">
            {{ reGetCode ? '重新获取' : '获取验证码' }}
          </a>
        </div>
        <div class="input-cloumn">
          <div class="item-input">
            <input type="text" placeholder="请输入验证码" v-model="verifyCode">
          </div>
        </div>
        <div class="button-block">
          <button v-if="completeFlag" class="btn-normal btn-primary _solid btn-xxl">完成绑定</button>
          <button type="button" v-else class="btn-normal _solid btn-xxl">完成绑定</button>
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
  data () {
    return {
      currentMobile: '',
      completeFlag: false,
      mobile: '',
      verifyCode: '',
      validMsg: '',
      codeFlag: false,
      leftTime: 59,
      reGetCode: false
    }
  },
  created () {
    this.currentMobile = sessionStorage.getItem('mobile')
  },
  watch: {
    mobile (val) {
      if(val !== '' && this.verifyCode !== '') {
        this.completeFlag = true
      } else {
        this.completeFlag = false
      }
    },
    verifyCode (val) {
      if(this.mobile !== '' && val !== '') {
        this.completeFlag = true
      } else {
        this.completeFlag = false
      }
    }
  },
  methods: {
    // 获取验证码
    getCode () {
      if (this.validPhone()) {
        let api = this.currentMobile ? '/api/wap/members/sendChangeMobileVerifyCode' : '/api/wap/members/sendBindMobileVerifyCode'
        let promise = axios.get(api, { mobile: this.mobile })
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
    // 完成绑定
    completeBind () {
      if (this.validPhone() && this.validCode()) {
        let api = this.currentMobile ? ' /api/wap/members/changeMobile' : '/api/wap/members/bindMobile'
        let promise = axios.post(api, {
          mobile: this.mobile,
          verifyCode: this.verifyCode
        }).then(res => {
          if (res.data.code === CODE_SUCCESS) {
            Toast.success('绑定成功', 2)
            this.$router.push({
              name: 'Index'
            })
          } else {
            Toast.fail(res.data.message, 2)
          }
        })
        Toast.loading('正在进行绑定...', promise)
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
    },
    // 路由跳转
    goRouter () {
      this.$router.push({
        name: 'MineAccountSecurityVerifyId'
      })
    }
  }
}
</script>

