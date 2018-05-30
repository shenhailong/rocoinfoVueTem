<template>
  <div class="wrap wrap-add-identify">
    <div class="bar bar-nav _border bar-absolute-top">
      <a @click="routerBack" href="javascript:;" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">上传身份信息</div>
    </div>
    <div class="content">
      <form @submit.prevent="submitHandler" class="form-normal form-add-identity">
        <div class="input-cloumn">
          <div class="item-label">
            <em>*</em>姓名
          </div>
          <div class="item-input">
            <span class="text">{{form.name}}</span>
          </div>
        </div>
        <div class="input-cloumn">
          <div class="item-label">
            <em>*</em>手机号
          </div>
          <div class="item-input">
            <span class="text">{{form.mobile}}</span>
          </div>
        </div>
        <div class="input-cloumn">
          <div class="item-label">
            <em>*</em>身份证号
          </div>
          <div class="item-input">
            <input v-model="form.idNo" type="text" placeholder="请输入收件人身份证号码">
          </div>
        </div>
        <div class="input-cloumn border-no">
          <div class="item-label ">
            <em>*</em>上传身份证正反面
          </div>
        </div>

        <image-picker list-type="id-card" :files="frontFile" @add-img="onAddFront" @remove-img="onRemoveFront" @start-loading="startLoading" @end-loading="endLoading">
          <span>上传身份证国徽面</span>
        </image-picker>
        <image-picker :style="computedStyleObj" list-type="id-card" :files="backFile" @add-img="onAddBack" @remove-img="onRemoveBack" @start-loading="startLoading" @end-loading="endLoading">
          <span>上传身份证个人信息面</span>
        </image-picker>
        <div class="button-block">
          <button :disabled="submitting" :class="computedBtnClass" class="btn-normal _solid btn-xxl">保存</button>
        </div>
      </form>
    </div>
    <!-- /.content -->
  </div>
</template>
<script>
import axios from 'axios'
import { mapState } from 'vuex'
import CODE_SUCCESS from '@/constants/responseCode'
import { Toast, ImagePicker } from 'rocoui'
import routerMixin from '@/mixin/router'
import * as ORDER_TYPE from '@/store/types/order'
import validators from '@/validators'
export default {
  mixins: [routerMixin],
  name: 'IdCard',
  components: {
    'image-picker': ImagePicker
  },
  data() {
    return {
      form: {
        id: '',
        memberId: '',
        name: '',
        mobile: '',
        idNo: '',
        frontImg: '',
        backImg: ''
      },
      frontFile: [],
      backFile: [],
      submitting: false,
      resFn: null
    }
  },
  created() {
    if (this.customInfo) {
      this.form = { ...this.customInfo }
      this.frontFile = [
        { url: this.customInfo.frontImg, id: new Date().getTime() }
      ]
      this.backFile = [
        { url: this.customInfo.backImg, id: new Date().getTime() }
      ]
    } else {
      this.form.name = this.$route.query.name
      this.form.mobile = this.$route.query.mobile
    }
  },
  methods: {
    fetchInfo() {
      let promise = axios
        .get('/api/wap/ciq/findByNameAndMobile', {
          name: this.form.name,
          mobile: this.form.mobile
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            // 没有data表示没查到
            if (res.data.data) {
              this.form = res.data.data
            }
          }
        })
      Toast.loading('正在加载', promise)
    },
    submitHandler() {
      if (!validators.id(this.form.idNo)) {
        Toast.info('请填写正确的身份证号码', 2, null, false)
        return false
      }
      if (this.form.frontImg === '') {
        Toast.info('请上传身份证国徽面', 2, null, false)
        return false
      }
      if (this.form.backImg === '') {
        Toast.info('请上传身份证个人信息面', 2, null, false)
        return false
      }
      this.submitting = true
      let promise = axios
        .post('/api/wap/ciq/edit', this.form)
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.$store.commit(ORDER_TYPE.ORDER_SET_CUSTOM_INFO, {
              ...this.form
            })
            Toast.success(
              '保存成功',
              2,
              () => {
                this.$router.back()
              },
              false
            )
          }
        })
        .finally(() => {
          this.submitting = false
        })
      Toast.loading('正在保存', promise)
    },
    onAddFront(rst, fnCallback) {
      let formData = new FormData()
      formData.append('file', rst.file)
      formData.append('type', 'CIQ_ID_IMG')
      // 把目标图片的地址传给后台，后台返回新的图片数组并更新this.files
      let promise = axios
        .post('/api/wap/attachment/upload', formData, {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.frontFile = [
              {
                url: rst.base64,
                id: new Date().getTime()
              }
            ]
            this.form.frontImg = res.data.data.path
            fnCallback()
          }
        })
      Toast.loading('正在上传', promise)
    },
    onAddBack(rst, fnCallback) {
      // 把目标图片的地址传给后台，后台返回新的图片数组并更新this.files
      let formData = new FormData()
      formData.append('file', rst.file)
      formData.append('type', 'CIQ_ID_IMG')
      let promise = axios
        .post('/api/wap/attachment/upload', formData, {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.backFile = [
              {
                url: rst.base64,
                id: new Date().getTime()
              }
            ]
            this.form.backImg = res.data.data.path

            // 回调，清空file的value，从而触发input框的onchange事件
            fnCallback()
          }
        })
      Toast.loading('正在上传', promise)
    },
    onRemoveFront(index) {
      // 把id传给后台，返回新的图片数组并更新this.files
      this.frontFile.splice(index, 1) // 先用splice方法代替
      this.form.frontImg = ''
    },
    onRemoveBack(index) {
      // 把id传给后台，返回新的图片数组并更新this.files
      this.backFile.splice(index, 1) // 先用splice方法代替
      this.form.backImg = ''
    },
    startLoading () {
      let promise = new Promise((resolve, reject) => {
        this.resFn = resolve
      })
      Toast.loading('正在准备图片...', promise)
    },
    endLoading () {
      this.resFn()
    }
  },
  computed: {
    ...mapState({
      customInfo: (state) => state.order.customInfo
    }),
    computedStyleObj() {
      return { marginTop: this.frontFile.length > 0 ? '0' : '20px' }
    },
    computedBtnClass() {
      return {
        'btn-disabled': this.submitting,
        'btn-primary': !this.submitting
      }
    }
  }
}
</script>
