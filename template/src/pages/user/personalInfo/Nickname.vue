<template>
  <div class="wrap wrap-center-change">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">修改昵称</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <form action="" @submit.prevent="submitHandler" class="form-normal form-change">
        <div class="input-cloumn">
          <div class="item-input">
            <input type="text" placeholder="请输入昵称" v-model="nickname" maxlength="10">
          </div>
        </div>
        <div class="form-tips-text">昵称最多支持10个汉字</div>
        <div class="button-block">
          <button v-if="nickname.trim().length>0" class="btn-normal btn-primary _solid btn-xxl">保存</button>
          <button type="button" v-else class="btn-normal _solid btn-xxl">保存</button>
        </div>
      </form>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import { Toast, Modal } from 'rocoui'
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'

export default {
  mixins: [routerMixin],
  name: 'MinePersonalInfoNickname',
  data () {
    return {
      nickname: ''
    }
  },
  created () {
    this.nickname = this.$route.query.infoType
  },
  methods: {
    // 保存
    submitHandler () {
      let nickname = this.nickname.trim()
      if (nickname.length === 0) {
        Modal.alert({body: '昵称不能为空'})
      } else {
        let promise = axios.post('/api/wap/members/update', { nickname })
        .then(res => {
          if (res.data.code === CODE_SUCCESS) {
            Toast.success('保存成功', 2)
            this.routerBack()
          } else {
            Toast.fail('保存失败', 2)
          }
        })
        Toast.loading('正在保存...', promise)
      }
    }
  }
}
</script>
