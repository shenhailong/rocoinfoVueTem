<template>
  <div class="wrap wrap-edit-topic">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">申请售后</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <form action="" @submit.prevent="submitHandler" class="form-normal form-order-sale">
        <div class=" item-goods item-horizontal">
          <div class="item-media">
            <img v-lazy="{
              src: afterSaleInfo.skuImg ? afterSaleInfo.skuImg : 'static/images/m/img348x348.jpg',
              loading: 'static/images/m/img348x348.jpg',
              error: 'static/images/m/img348x348.jpg'
            }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-flex-between">
              <div class="item-title _ellipsis">{{ afterSaleInfo.skuName }}</div>
            </div>
            <div class="item-subtitle-sku">
              <span class="name">规格：</span>{{ afterSaleInfo.attribute }}
              <span class="item-count">x{{ afterSaleInfo.quantity }}</span>
            </div>
          </div>
          <!-- /.item-inner -->
        </div>
        <div class="input-cloumn">
          <div class="modified">
            <div @click="minusHandler" class="minus">
              <svg class="svg-minus">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-minus"></use>
              </svg>
            </div>
            <div class="num"><input type="text" v-model="quantity"></div>
            <div @click="plusHandler" class="plus">
              <svg class="svg-add">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-add"></use>
              </svg>
            </div>
          </div>
          <!-- /.modified -->
        </div>
        <div class="space-20"></div>
        <div @click="actionSheetHandler" class="input-cloumn">
          <div class="item-input">
            <div :class="{'text-grey-light':!currentType.label}">{{ currentType.label ? currentType.label : '请选择服务类型' }}</div>
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow"></use>
          </svg>
        </div>
        <div class="space-20"></div>
        <div class="input-cloumn">
          <div class="item-input">
            <textarea v-model="afterSaleInfo.applyReason" cols="30" rows="4" maxlength="255" placeholder="请对您的问题进行描述"></textarea>
          </div>
        </div>
        <image-picker :files="files" :max="maxNum" :canCrop="canCrop" :fixedNumber="[750, 750]" :autoCropWidth="750" :autoCropHeight="750" @exceed-max="onExceedMax" @add-img="onAddImage" @remove-img="onRemoveImage" @start-loading="startLoading" @end-loading="endLoading" />
        <div class="text-grey-light">&nbsp;&nbsp;（点击添加图片，最多上传4张）</div>
        <div class="button-block">
          <button v-if="afterSaleInfo.applyReason" class="btn-normal btn-primary _solid btn-xxl">提交</button>
          <button type="button" v-else class="btn-normal _solid btn-xxl">提交</button>
        </div>
      </form>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import { ActionSheet, ImagePicker, Modal, Toast } from 'rocoui'
import store from '@/configs/store'
import AFTER_SALES_TYPE_LIST from '@/constants/afterSaleType'
import _ from 'lodash'
import axios from 'axios'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'MineOrderAfterSaleApply',
  components: {
    ImagePicker
  },
  data () {
    return {
      afterSaleInfo: {},
      quantity: 1,
      AFTER_SALES_TYPE_LIST,
      actionSheetOptions: [],
      currentType: {},
      files: [],
      maxNum: 4,
      canCrop: true,
      resFn: null // 上传头像的reslove
    }
  },
  created () {
    this.afterSaleInfo = store.get('willAfterSaleInfo')
    this.afterSaleInfo.orderId = this.$route.params.orderId
    // 服务类型数据 - 判断是否为保税区商品
    if (this.afterSaleInfo.taxType === 'FREE') {
      // 保税区
      let taxArr = _.slice(AFTER_SALES_TYPE_LIST, 0, 3)
      this.actionSheetOptions = _.map(taxArr, 'label')
    } else {
      this.actionSheetOptions = _.map(AFTER_SALES_TYPE_LIST, 'label')
    }
    this.actionSheetOptions.push('取消')
  },
  watch: {
    // 服务类型
    currentType (val) {
      this.afterSaleInfo.type = val.value
    }
  },
  methods: {
    // 操作售后商品数量
    minusHandler () {
      if (this.quantity > 1) {
        this.quantity -= 1
      } else {
        Modal.alert({body: '商品数量不能小于1'})
      }
    },
    plusHandler () {
      if (this.quantity < this.afterSaleInfo.quantity) {
        this.quantity += 1
      } else {
        Modal.alert({body: '商品数量不能大于商品总数'})
      }
    },
    // 选择服务类型
    actionSheetHandler() {
      ActionSheet.showActionSheet(
        {
          cancelButtonIndex: this.actionSheetOptions.length - 1,
          destructiveButtonIndex: typeof this.currentType.index !== 'undefined' ? this.currentType.index : null,
          options: this.actionSheetOptions
        },
        index => {
          if (index !== this.actionSheetOptions.length - 1) {
            this.currentType = this.AFTER_SALES_TYPE_LIST[index]
            this.currentType.index = index
          }
        }
      )
    },
    // 多选时超出最大值需要进行提示
    onExceedMax(max) {
      Modal.alert({body: '最多只能上传' + max + '张图片'})
    },
    onAddImage(rst, fnCallback) {
      let formData = new FormData()
      if (this.canCrop) {
        formData.append('file', rst, 'image.png')
      } else {
        formData.append('file', rst.file)
      }
      formData.append('type', 'AFTER_SALE')
      // 把目标图片的地址传给后台，后台返回新的图片数组并更新this.files
      let promise = axios.post('/api/wap/attachment/upload', formData, {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.code === CODE_SUCCESS) {
          // 由于涉及到异步，需要另作判断
          if (this.files.length < this.maxNum) {
            this.files.push({
              url: res.data.data.path
            })
          } else {
            this.onExceedMax(this.maxNum)
          }
          // 回调，清空file的value，从而触发input框的onchange事件
          fnCallback()
        }
      })
      Toast.loading('正在上传...', promise)
    },
    // 为安卓机计算图片数据到上传前的空白时间添加loading
    startLoading () {
      let promise = new Promise((resolve, reject) => {
        this.resFn = resolve
      })
      Toast.loading('正在准备图片...', promise)
    },
    endLoading () {
      this.resFn()
    },
    onRemoveImage(index) {
      // 把id传给后台，返回新的图片数组并更新this.files
      this.files.splice(index, 1)
    },
    // 提交
    submitHandler () {
      this.afterSaleInfo.images = []
      this.files.forEach(file => {
        this.afterSaleInfo.images.push(file.url)
      })
      if (typeof this.afterSaleInfo.type === 'undefined') {
        Modal.alert({body: '请选择服务类型'})
      } else if (this.afterSaleInfo.applyReason.trim().length === 0) {
        Modal.alert({body: '评价内容不能为空'})
      } else if (this.afterSaleInfo.images.length === 0) {
        Modal.alert({body: '请至少上传一张图片'})
      } else {
        this.afterSaleInfo.quantity = this.quantity
        this.afterSaleInfo.part = true
        let promise = axios.post('/api/wap/aftersale/create', this.afterSaleInfo)
        .then(res => {
          if (res.data.code === CODE_SUCCESS) {
            let self = this
            Modal.alert({
              title: '提示',
              body: '您的申请已经受理，售后进度请到我的订单-退款售后中查看',
              okText: '知道了',
              okCb: function(){
                self.routerBack()
              }
            })
          }
        })
        Toast.loading('正在提交...', promise)
      }
    }
  },
  beforeDestroy () {
    ActionSheet.close()
  }
}
</script>

