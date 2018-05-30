<template>
  <div class="wrap wrap-start-pages">
    <div class="content">
      <h1 class="content-title">你感兴趣的是什么？</h1>
      <h2 class="content-subtitle">最多可以选6种</h2>
      <form action="" @submit.prevent="submit">
        <div class="tag-block columns3">
          <span v-for="(item, index) in labelList" :key="index" @click="checkLabel(item)" :class="{'_active':item.checked}" class="tag tag-xxl _ellipsis">{{ item.tagName }}</span>
        </div>
        <!-- 按钮不可用状态请替换[ btn-primary ]为[ btn-disabled ] -->
        <div class="bar bar-button bar-absolute-bottom _pd">
          <button v-if="checkedLabelList.length>0" class="btn-normal btn-primary _solid btn-xxl">进入首页</button>
          <button type="button" v-else class="btn-normal btn-disabled _solid btn-xxl">进入首页</button>
        </div>
        <!--/.bar-button -->
      </form>
    </div>
    <!-- /.content -->
  </div>
</template>
<script>
import axios from 'axios'
import {Modal} from 'rocoui'
import qs from '@/utils/qs'
import CODE_SUCCESS from '@/constants/responseCode'
import {routerTransitionMixin} from '@/mixin/router'
export default {
  data () {
    return {
      type: 'OFFICIAL',
      labelList: [],                 // 初始化的所有标签数组
      checkedLabelList: []           // 已选中的标签数组
    }
  },
  mixins: [routerTransitionMixin],
  created () {
    // 初始化兴趣标签列表
    this.initInterestLabels()
  },
  methods: {
    // 初始化兴趣标签列表
    initInterestLabels () {
      axios.get(`/api/wap/dictconstant/${this.type}`).then(res => {
        if (res.data.code === '1') {
          this.labelList = res.data.data
          // 处理标签数据格式
          let arr = []
          this.labelList.forEach(item => {
            let obj = {}
            obj.checked = false
            obj.tagName = item
            obj.tagType = this.type
            arr.push(obj)
          })
          this.labelList = arr
        }
      })
    },
    // 选择标签
    checkLabel (item) {
      // 切换选择状态
      if (item.checked) {
        item.checked = false
      } else if (this.checkedLabelList.length > 5) {
        Modal.alert({body: '最多只能选择6种'})
      } else {
        item.checked = true
      }
      // 处理已选中的标签数组
      this.checkedLabelList = []
      this.labelList.forEach(ele => {
        if (ele.checked) {
          this.checkedLabelList.push(ele)
        }
      })
    },
    // 保存已选择的标签并跳转到首页
    submit () {
      axios.post(`/api/wap/members/createTags`, this.checkedLabelList)
      .then(res => {
        if (res.data.code === CODE_SUCCESS) {
          // 操作sessionStorage
          let userInfo = JSON.parse(window.sessionStorage.getItem('oilmall_user'))
          userInfo.selectedInterestTags = true
          window.sessionStorage.setItem('oilmall_user', JSON.stringify(userInfo))
          // 跳转页面
          let queryString = qs()
          if (queryString && queryString.redirect) {
            window.location.href = queryString.redirect
          } else {
            window.location.href = 'index.html'
          }
        }
      })
    }
  }
}
</script>
