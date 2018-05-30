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

        <image-picker :files="files" :max="5" :canCrop="canCrop" @exceed-max="onExceedMax" @add-img="onAddImage" @remove-img="onRemoveImage" :fixedNumber="[750, 562]" :autoCropWidth="750" :autoCropHeight="562" :fixedBox="true" @start-loading="startLoading" @end-loading="endLoading"/>

        <div class="button-block">
          <button type="button" class="btn-normal btn-primary _solid btn-xxl" @click="next()">下一步</button>
        </div>
      </form>
    </div>

  </div>
</template>

<script>
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast, ImagePicker, Modal } from 'rocoui'
import store from '@/configs/store'
export default {
  data() {
    return {
      files: [],
      isSave: true, // 判断是否保存过，如果保存过可以直接返回
      topicId: '',
      canCrop: true,
      sendData: {
        type: 'ORDINARY', // 话题类型
        name: '', // 标题，
        contentText: '', // 内容
        id: null,
        admTopicTags: [],
        status: 'DRAFT',
        sku: {}
      },
      resFn: null
    }
  },
  components: {
    ImagePicker
  },
  mounted() {
    if (store.get('topicSendData')) {
      this.sendData = JSON.parse(store.get('topicSendData'))
      this.sendData.admTopicTags.forEach(element => {
        this.files.push({
          url: element.imagePath,
          effect: element.effect,
          name: element.name,
          showCanvas: element.showCanvas,
          sku: element.sku
        })
      })
    }
  },
  methods: {
    // 保存草稿
    saveDraft() {
      this.sendData.status = 'DRAFT'
      if (this.sendData.name.trim() === '') {
        Toast.info('话题标题不能为空')
        return false
      }
      this.sendData.admTopicTags = []
      this.files.forEach(element => {
        this.sendData.admTopicTags.push({
          imagePath: element.url,
          effect: element.effect,
          name: element.name,
          showCanvas: element.showCanvas,
          sku: element.sku
        })
      })
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
    next() {
      if (this.sendData.name.trim() === '') {
        Toast.info('话题标题不能为空')
        return false
      }
      if (this.files.length === 0) {
        Toast.info('没有图片的话题是不能公布于众的哦')
        return false
      }
      this.sendData.admTopicTags = []
      this.files.forEach(element => {
        this.sendData.admTopicTags.push({
          imagePath: element.url,
          effect: element.effect,
          name: element.name,
          showCanvas: element.showCanvas,
          sku: element.sku
        })
      })
      let editTopic = {
        id: this.sendData.id,
        name: this.sendData.name,
        contentText: this.sendData.contentText,
        admTopicTags: this.sendData.admTopicTags,
        sku: {},
        type: this.sendData.type
      }
      store.set('topicSendData', JSON.stringify(editTopic))
      this.$router.push({ path: `/Index/EditTopic/AddLabel` })
    },
    // 多选时超出最大值需要进行提示
    onExceedMax(max) {
      // Modal.alert({body: '最多只能上传' + max + '张图片'})
    },
    onAddImage(rst, fnCallback) {
      let formData = new FormData()
      if (this.canCrop) {
        formData.append('file', rst, 'image.png')
      } else {
        formData.append('file', rst.file)
      }
      formData.append('type', 'CIQ_ID_IMG')
      // 把目标图片的地址传给后台，后台返回新的图片数组并更新this.files
      let promise = axios.post('/api/wap/attachment/upload', formData, {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.files.push({
            url: res.data.data.path,
            id: new Date().getTime()
          })
          fnCallback()
        }
      })
      Toast.loading('正在上传...', promise)
    },
    onRemoveImage(index) {
      // 把id传给后台，返回新的图片数组并更新this.files
      this.files.splice(index, 1)    // 先用splice方法代替
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
    goBack() {
      if (this.isSave) {
        store.remove('topicSendData')
        this.$router.back()
      } else {
        Modal.confirm({
          title: '确认放弃话题的编辑？',
          okText: '确定',
          cancelText: '取消',
          okCb: () => {
            store.remove('topicSendData')
            this.$router.back()
          }
        })
      }
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

