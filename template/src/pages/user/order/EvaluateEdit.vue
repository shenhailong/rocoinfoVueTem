<template>
  <div class="wrap wrap-edit-topic">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">评价晒单</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <form action="" @submit.prevent="submitHandler" class="form-normal form-order-sale">
        <div class=" item-goods item-horizontal">
          <div class="item-media">
            <img v-lazy="{
              src: orderData.img ? orderData.img : 'static/images/lazyload/348x348.jpg',
              loading: 'static/images/lazyload/348x348.jpg',
              error: 'static/images/lazyload/348x348.jpg'
            }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-flex-between">
              <div class="item-title _ellipsis">{{ orderData.name }}</div>
            </div>
            <div class="item-subtitle-sku">
              <span class="name">规格：</span>{{ orderData.attr }}
            </div>
          </div>
          <!-- /.item-inner -->
        </div>
        <div class="space-20"></div>
        <div class="input-cloumn">
          <div class="item-input">
            <textarea v-model="evaluateInfo.content" class="textarea-evluate" cols="30" rows="4" maxlength="200" placeholder="评价超过10个字积分随机送拍张美美的图，表明你的生活态度"></textarea>
          </div>
        </div>
        <image-picker :files="files" :max="maxNum" :canCrop="canCrop" :fixedNumber="[750, 562]" :autoCropWidth="750" :autoCropHeight="562" :fixedBox="true" @exceed-max="onExceedMax" @add-img="onAddImage" @remove-img="onRemoveImage" @startLoading="startLoading" @endLoading="endLoading" />
        <div class="text-grey-light">&nbsp;&nbsp;（点击添加图片，最多上传4张）</div>
        <div class="button-block">
          <button v-if="evaluateInfo.content" class="btn-normal btn-primary _solid btn-xxl">提交</button>
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
import { Toast, ImagePicker, Modal } from 'rocoui'
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'MineOrderEvaluateEdit',
  components: {
    ImagePicker
  },
  data () {
    return {
      maxNum: 4,
      orderData: {},
      files: [],
      evaluateInfo: {},
      topicInfo: {
        type: 'COMMENT', // 话题类型 评论转话题
        status: 'NOT_APPROVAL',
        sku: {
          id: ''
        }
      },
      topicImgArr: [],
      canCrop: true,
      resFn: null, // 上传头像的reslove
      changeTopicTimer: null,
      changeRouterTimer: null
    }
  },
  created () {
    this.orderData = this.$route.query
    this.evaluateInfo.orderItemId = this.$route.params.id
    // 评价转话题需要传的参数
    this.topicInfo.name = '关于《' + this.$route.query.name + '》的评论分享'
    this.topicInfo.sku.id = this.$route.query.skuId
  },
  methods: {
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
      formData.append('type', 'PROD_EVALUATE')
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
    startLoading () {
      let promise = new Promise((resolve, reject) => {
        this.resFn = resolve
      })
      Toast.loading('正在准备裁剪画布...', promise)
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
      sessionStorage.setItem('unevaluateOrderNum', sessionStorage.getItem('unevaluateOrderNum') - 1)
      this.evaluateInfo.imgs = []
      this.files.forEach(file => {
        this.evaluateInfo.imgs.push(file.url)
      })
      if (this.evaluateInfo.content.trim().length === 0) {
        Modal.alert({body: '评价内容不能为空'})
      } else if (this.evaluateInfo.imgs.length === 0) {
        Modal.confirm({
          body: '真的不上传图片吗？',
          okCb: () => {
            this.topicImgArr = []
            this.topicImgArr.push(this.$route.query.img)
            this.submitEvaluate()
          }
        })
      } else {
        this.topicImgArr = this.evaluateInfo.imgs
        this.submitEvaluate()
      }
    },
    submitEvaluate () {
      this.topicInfo.contentText = this.evaluateInfo.content
      // 为评价转话题的第一张图片添加标签
      this.topicInfo.admTopicTags = []
      this.topicImgArr.forEach((item, index) => {
        this.topicInfo.admTopicTags.push({
          imagePath: item,
          effect: index === 0 ? this.$route.query.subtitle : '',
          name: index === 0 ? this.$route.query.name : '',
          showCanvas: false,
          sku: this.$route.query.skuId

        })
      })
      let promise = axios.post('/api/wap/product/evaluate', this.evaluateInfo).then((evaluateRes) => {
        if (evaluateRes.data.code === CODE_SUCCESS) {
          Toast.success('提交成功，积分+' + evaluateRes.data.data, 2)
          this.changeTopicTimer = setTimeout(() => {
            let topicPromise = axios.post('/api/wap/topic/create', this.topicInfo).then((topicRes) => {
              clearTimeout(this.changeTopicTimer)
              this.changeRouterTimer = setTimeout(() => {
                this.goBackRoute()
              }, 30)
            })
            Toast.loading('正在转为话题...', topicPromise)
          }, 2001)
        }
      })
      Toast.loading('正在提交...', promise)
    },
    // 跳回待评价订单页
    goBackRoute() {
      if (sessionStorage.getItem('unevaluateOrderNum') === '0') {
        this.$router.push({
          name: 'MineOrder',
          query: { type: 'COMPLETED' }
        })
      } else {
        this.routerBack()
      }
    }
  }
}
</script>

