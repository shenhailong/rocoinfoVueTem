<template>
  <div class="wrap wrap-bind-phone">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:history.back();" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">绑定手机号</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <div class="text-info">
        <div class="title">亲爱的INESSENCE用户:</div>
        <div class="text">为保证您在其他平台购买商品能够转换成积分关联到微信商城账户，请先完成手机绑定。</div>
      </div>
      <form action="" class="form-normal form-bind-phone">
        <div class="input-cloumn">
          <div class="item-input">
            <input type="text" placeholder="请输入手机号" v-model="phone" maxlength="11">
          </div>
          <a href="javascript:;" class="btn-normal btn-primary _solid btn-lg" v-if="codeFlag" @click="getVerifyCode(findPwd?'sendForgotVerifyCode':'sendRegisterVerifyCode')">获取验证码</a>
          <a href="javascript:;" class="btn-normal btn-disabled _solid btn-lg" v-else>重新获取（{{ codeTime }}s）</a>
        </div>
        <div class="input-cloumn">
          <div class="item-input">
            <input type="text" placeholder="请输入验证码" v-model="code">
          </div>
        </div>
        <div class="button-block">
          <button type="button" class="btn-normal btn-primary  btn-xxl" :class="isOk ? '_solid' : 'btn-disabled'" @click="bindPhone">完成绑定</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast } from 'rocoui'
import validators from '@/validators/index'
export default {
  data() {
    return {
      phone: '',
      code: '',
      codeFlag: true,
      findPwd: false,
      codeTime: 59
    }
  },
  created() {
    console.log(this.$route.query)
    console.log(validators)
  },
  methods: {
    // 获取验证码
    getVerifyCode(port) {
      // 校验手机号
      if (this.validPhone()) {
        // 校验通过，调取后台接口，调取成功后开始倒计时
        let codeGetting = axios.get('/api/wap/members/sendBindMobileVerifyCode', { params: { mobile: this.phone } })
          .then(res => {
            if (res.data.code === CODE_SUCCESS) {
              Toast.success('发送成功，30分钟内有效', 2)
              this.codeFlag = false
              let codeTimer = setInterval(() => {
                this.codeTime--
                if (this.codeTime === 0) {
                  clearInterval(codeTimer)
                  // 重新获取
                  this.codeFlag = true
                  this.reGetCode = true
                  this.codeTime = 59
                }
              }, 1000)
            }
          })
        Toast.loading('发送中...', codeGetting)
      } else {
        Toast.fail(this.validMsg, 2)
      }
    },
    // 校验手机号
    validPhone() {
      if (this.phone === '') {
        this.validMsg = '手机号不能为空'
        return false
      } else if (!validators.mobile(this.phone)) {
        this.validMsg = '手机号格式不正确'
        return false
      } else {
        return true
      }
    },
    // 校验验证码
    validCode() {
      let code = this.code
      if (code === '') {
        this.validMsg = '验证码不能为空'
        return false
      } else if (!validators.validCode(code)) {
        this.validMsg = '验证码输入不正确'
        return false
      } else {
        return true
      }
    },
    bindPhone() {
      // 再次校验
      if (this.validPhone() && this.validCode()) {
        // 调取后台接口，验证刚输入的验证码是否正确，再决定是否跳转
        let data = {
          mobile: this.phone,
          verifyCode: this.code
        }
        let bind = axios.post('/api/wap/members/bindMobile', data).then(res => {
          if (res.data.code === CODE_SUCCESS) {
            Toast.success('绑定成功')
            // 最后成功要跳转的路径需要后期具体看哪些页面要调用
            if (this.$route.query.forward) {
              this.$router.push({
                name: this.$route.query.forward
              })
            }else if(this.$route.query.redirect){
              window.location.href = this.$route.query.redirect
            } else {
              window.history.back()
            }
          }
        })
        Toast.loading('请稍等...', bind)
      } else {
        Toast.fail(this.validMsg, 2)
      }
    }
  },
  computed: {
    isOk() {
      // if(this.code !== '' && this.phone !== ''){
      if (this.validPhone() && this.validCode()) {
        return true
      }
      return false
    }
  }
}
</script>

