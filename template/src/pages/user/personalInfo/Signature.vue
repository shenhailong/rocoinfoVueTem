<template>
  <div class="wrap wrap-center-change">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">个人签名</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <form action="" @submit.prevent="submitHandler" class="form-normal form-change">
        <div class="input-cloumn">
          <div class="item-input">
            <textarea placeholder="请输入个人签名" rows="3" v-model="signature" maxlength="30">幸福的秘诀是得到自由</textarea>
          </div>
          <span class="textarea-count">
            <span>{{ (signature && signature.length) || 0 }}</span>/30
          </span>
        </div>
        <div class="button-block">
          <button class="btn-normal btn-primary _solid btn-xxl">保存</button>
        </div>
      </form>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import { Modal, Toast } from 'rocoui'
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'MinePersonalInfoSignature',
  data () {
    return {
      signature: ''
    }
  },
  created () {
    this.signature = this.$route.query.infoType
  },
  methods: {
    // 保存
    submitHandler () {
      let self = this
      let signature = this.signature.trim()
      if (this.$route.query.infoType !== '' && signature.length === 0) {
        Modal.confirm({
          okText: '确定',
          cancelText: '取消',
          body: '确定清空签名吗？',
          okCb: () => {
            self.save()
          }
        })
      } else {
        self.save()
      }
    },
    save () {
      let signature = this.signature.trim()
      let promise = axios.post('/api/wap/members/update', { signature })
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
</script>
