<template>
  <div class="wrap wrap-edit-topic">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" class="bar-item item-arrow" @click="goBack">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">编辑话题</div>
      <a href="javascript:;" class="bar-item text" @click="saveDraft">保存草稿</a>
    </div>

    <div class="content">
      <form action="" class="form-normal form-eidt-topic">
        <div class="input-cloumn">
          <div class="item-input">
            <input type="text" placeholder="请输入标题" maxlength="20" v-model="sendData.name">
          </div>
          <span class="textarea-count">{{sendData.name.length}}/20</span>
        </div>
        <div class="input-cloumn">
          <div class="item-input">
            <textarea name="" id="" cols="30" rows="10" placeholder="输入你想说的话" v-model="sendData.contentText"></textarea>
          </div>
        </div>
        <div class="rocoui-image-picker">
          <div class="rocoui-image-picker-list">
            <div class="rocoui-flexbox rocoui-flexbox-align-center">
              <div class="rocoui-flexbox-list" v-for="item in sendData.admTopicTags" :key="item.id">
                <div class="rocoui-image-picker-item">
                  <div class="rocoui-image-picker-item-content" :style="{'background-image': 'url(' + item.imagePath + ')'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="button-block">
          <button type="button" class="btn-normal btn-primary _solid btn-xxl" @click="publish()">发布</button>
        </div>
      </form>
    </div>

  </div>
</template>

<script>
// 发布报告和一般的话题不一样，需要先拿到商品信息
import routerMixin from '@/mixin/router'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast, Modal } from 'rocoui'
export default {
  name: 'MineOrderTrialReport',
  mixins: [routerMixin],
  data() {
    return {
      files: [],
      isSave: true, // 判断是否保存过，如果保存过可以直接返回
      topicId: '',
      sendData: {
        type: 'REPORT', // 话题类型 试用报告
        name: '', // 标题，
        contentText: '', // 内容
        id: null,
        admTopicTags: [],
        status: 'DRAFT',
        sku: {},
        orderItem: { id: this.$route.params.orderId }
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取商品详情数据
    getInfo() {
      let promise = axios.get(`/api/wap/product/${this.$route.query.productId}?skuId=${this.$route.query.skuId}&placeOrderType=CART`).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          res.data.data.banners.forEach((element, index) => {
            this.sendData.admTopicTags.push({
              imagePath: element.path,
              effect: index === 0 ? res.data.data.subtitle : '',
              name: index === 0 ? res.data.data.name : '',
              showCanvas: false,
              sku: res.data.data.skuId
            })
          })
        }
      })
      Toast.loading('正在加载...', promise)
    },
    // 保存草稿
    saveDraft() {
      if (this.sendData.name.trim() === '') {
        Toast.info('话题标题不能为空')
        return false
      }
      this.sendData.status = 'DRAFT'
      let promise = axios.post(`/api/wap/topic/${this.sendData.id ? 'modify' : 'create'}`, this.sendData).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          Toast.success('保存草稿成功')
          this.sendData.id = res.data.data
        } else {
          Toast.error('保存草稿失败')
        }
      })
      Toast.loading('正在保存...', promise)
    },
    // 发布
    publish() {
      if (this.sendData.name.trim() === '') {
        Toast.info('话题标题不能为空')
        return false
      }
      this.sendData.status = 'NOT_APPROVAL'
      this.sendData.type = 'REPORT'
      if (!this.sendData.sku) {
        this.sendData.sku = {}
      }
      for (let index = 0; index < this.sendData.admTopicTags.length; index++) {
        if (this.sendData.admTopicTags[index].sku) {
          this.sendData.sku.id = this.sendData.admTopicTags[index].sku
          break
        }
      }
      let promise = axios.post(`/api/wap/topic/${this.sendData.id ? 'modify' : 'create'}`, this.sendData)
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            Toast.success('发布成功')
            setTimeout(this.back, 1500)
          } else {
            Toast.error('发布失败')
          }
        })
      Toast.loading('正在保存...', promise)
    },
    goBack() {
      if (this.isSave) {
        this.$router.back()
      } else {
        Modal.confirm({
          title: '确认放弃话题的编辑？',
          okText: '确定',
          cancelText: '取消',
          okCb: () => {
            this.$router.back()
          }
        })
      }
    },
    back() {
      this.$router.back()
    }
  },
  watch: {
    'sendData.name'() {
      this.isSave = false
    },
    'sendData.contentText'() {
      this.isSave = false
    },
    'files'() {
      this.isSave = false
    }
  }
}
</script>
