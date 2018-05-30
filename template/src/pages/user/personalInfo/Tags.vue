<template>
  <div class="wrap wrap-set-hobby">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">偏好标签</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <div class="content-block-title">
        偏好标签
      </div>
      <div class="tag-block _random">
        <span v-for="(item, index) in tagsList"
          :key="index"
          :class="{'_active':item.checked}"
          class="tag tag-lg">
          <span @click="item.tagType==='OFFICIAL' ? checkTag(item) : changeUserTag(item)">{{ item.tagName }}</span>
          <svg v-show="item.tagType==='CUSTOM'"
            @click="cancelTag(item, index)" class="svg-close-circle">
            <use xlink:href="#svg-close-circle" />
          </svg>
        </span>
      </div>
      <div class="content-block-title">
        自定义标签
      </div>
      <div class="add-hobby-input">
        <input type="text" placeholder="输入的关键词最多支持7个汉字" v-model="newTag" maxlength="7" class="item-input">
        <a href="javascript:;" v-if="newTag.trim().length>0" @click="addCustomTag" class="btn-normal btn-primary _solid btn-lg">添加标签</a>
        <a href="javascript:;" v-else class="btn-normal _solid btn-lg">添加标签</a>
      </div>
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
  name: 'MinePersonalInfoTags',
  data () {
    return {
      tagsList: [],
      newTag: '',
      checkedTagsList: [] // 已选中的标签数组
    }
  },
  created () {
    // 获取偏好标签
    this.getTagList()
  },
  watch: {
    tagsList (val) {
      // 处理已选中的标签数组
      this.checkedTagsList = []
      val.forEach(ele => {
        if (ele.checked) {
          this.checkedTagsList.push(ele)
        }
      })
    }
  },
  methods: {
    // 获取偏好标签
    getTagList () {
      let promise = axios.get(`/api/wap/members/getMemberAndOfficialTags`)
      .then(res => {
        // 基础信息
        if (res.data.code === CODE_SUCCESS) {
          this.tagsList = res.data.data
        }
      })
      Toast.loading('加载中...', promise)
    },
    // 选择标签
    checkTag (item) {
      // 切换选择状态
      if (item.checked) {
        let tagArr = []
        this.checkedTagsList.forEach(item => {
          if (item.checked) {
            tagArr.push(item)
          }
        })
        if (tagArr.length === 1) {
          Modal.alert({body: '请至少保留一个标签'})
          return
        } else {
          item.checked = false
        }
      } else {
        item.checked = true
      }
      // 处理已选中的标签数组
      this.checkedTagsList = []
      this.tagsList.forEach(ele => {
        if (item.tagType === 'OFFICIAL' && ele.checked) {
          this.checkedTagsList.push(ele)
        } else if (item.tagType === 'CUSTOM') {
          this.checkedTagsList.push(ele)
        }
      })
      if (item.tagType === 'OFFICIAL') {
        this.saveTags()
      }
    },
    // 添加自定义标签
    addCustomTag () {
      let flag = true
      // 添加的标签不能重复
      this.tagsList.forEach(item => {
        if (this.newTag.trim() === item.tagName) {
          Modal.alert({body: '该标签已存在'})
          flag = false
        }
      })
      if (flag) {
        let newTagObj = {
          tagName: this.newTag.trim(),
          tagType: 'CUSTOM',
          checked: true
        }
        this.checkedTagsList.push(newTagObj)
        this.tagsList.push(newTagObj)
        this.saveTags(1)
        this.newTag = ''
      }
    },
    // 切换自定义标签状态
    changeUserTag(item) {
      if (item.tagType === 'CUSTOM') {
        if (this.checkedTagsList.length === 1 && item === this.checkedTagsList[0]) {
          Modal.alert({body: '请至少保留一个标签'})
        } else {
          let promise = axios.post(`/api/wap/members/updateTags`, {
            id: item.id,
            checked: !item.checked
          }).then((res) => {
            if (item.checked) {
              let tagArr = []
              this.checkedTagsList.forEach(tag => {
                if (tag.checked) {
                  tagArr.push(tag)
                }
              })
              if (tagArr.length === 1) {
                Modal.alert({body: '请至少保留一个标签'})
              } else {
                item.checked = false
                this.checkedTagsList.forEach(tag => {
                  if (tag.tagName === item.tagName) {
                    tag.checked = false
                  }
                })
              }
            } else {
              this.checkedTagsList.forEach(tag => {
                if (tag.tagName === item.tagName) {
                  tag.checked = true
                } else {
                  this.checkedTagsList.push(item)
                }
              })
              item.checked = true
            }
          })
          Toast.loading('加载中...', promise)
        }
      }
    },
    // 删除自定义标签
    cancelTag (item, index) {
      let tagArr = []
      this.checkedTagsList.forEach(item => {
        if (item.checked) {
          tagArr.push(item)
        }
      })
      if (tagArr.length === 1) {
        Modal.alert({body: '请至少保留一个标签'})
      } else {
        this.tagsList.splice(index, 1)
        this.checkedTagsList.forEach((tag, idx) => {
          if (item.tagName === tag.tagName) {
            this.checkedTagsList.splice(idx, 1)
            this.saveTags()
          }
        })
      }
    },
    // 保存已选择的标签
    saveTags (flag) {
      this.checkedTagsList = []
      this.tagsList.forEach(item => {
        if (item.checked) {
          this.checkedTagsList.push(item)
        }
        if (item.tagType === 'CUSTOM' && !item.checked) {
          this.checkedTagsList.push(item)
        }
      })
      let promise = axios.post(`/api/wap/members/createTags`, this.checkedTagsList).then(() => {
        if (flag) {
          this.getTagList()
        }
      })
      Toast.loading('加载中...', promise)
    }
  }
}
</script>

