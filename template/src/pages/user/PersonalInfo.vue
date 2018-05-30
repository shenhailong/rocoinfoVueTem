<template>
  <div class="wrap wrap-center-personal-info">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">个人信息</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <form action="" class="form-normal form-personal-info">
        <a href="javascript:;" class="input-cloumn">
          <div class="item-label">
            <image-picker list-type="photo-card" :canCrop="canCrop" :fixedNumber="[750, 750]" :autoCropWidth="750" :autoCropHeight="750" :files="photoFiles" @add-img="onAddImage" @start-loading="startLoading" @end-loading="endLoading" />
          </div>
          <div class="item-input">
            <span class="text text-grey-light">修改头像</span>
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" @click="goInfoRouter('Nickname')" class="input-cloumn">
          <div class="item-label">
            昵称
          </div>
          <div class="item-input">
            <span class="text">{{ userInfo.nickname }}</span>
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" @click="goInfoRouter('Signature')" class="input-cloumn input-cloumn-wrap flex-align-start">
          <div class="item-label text-top">
            个性签名
          </div>
          <div class="item-input item-input-wrap text-top">
            <div class="text">{{ userInfo.signature }}</div>
          </div>
          <svg class="svg-arrow _right text-arrow">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" @click="openActionSheet('gender')" class="input-cloumn">
          <div class="item-label">
            性别
          </div>
          <div class="item-input">
            <span class="text" :class="{'text-grey-light':!userInfo.gender}">
              {{ userInfo.gender?genderText[userInfo.gender]:'请选择' }}
            </span>
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" @click="showBirthPopup" class="input-cloumn">
          <div class="item-label">
            生日
          </div>
          <div class="item-input">
            <span class="text" :class="{'text-grey-light':!showDate}">
              {{ showDate ? showDate : '生日设定后不可修改'}}
            </span>
          </div>
          <svg v-show="birthPopupFlag" class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
          <PopupDatePicker v-model="newShowDate" :visible.sync="birthVisible" :maxDate="popupMaxDate"></PopupDatePicker>
        </a>
        <a href="javascript:;" @click="openActionSheet('children')" class="input-cloumn">
          <div class="item-label">
            有无子女
          </div>
          <div class="item-input">
            <span class="text" :class="{'text-grey-light':typeof userInfo.children==='undefined'}">
              {{ typeof userInfo.children!=='undefined'?childrenText[userInfo.children]:'请选择' }}
            </span>
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" @click="goRouter" class="input-cloumn flex-align-start">
          <div class="item-label ">
            偏好标签
          </div>
          <div class="item-input tag-block _random">
            <span v-for="(item, index) in tagsInfo" :key="index" class="tag tag-lg _ellipsis">{{ item.tag }}</span>
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
      </form>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import moment from 'moment'
import { Toast, ActionSheet, PopupDatePicker, ImagePicker } from 'rocoui'
import axios from 'axios'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'MinePersonalInfo',
  components: {
    PopupDatePicker,
    ImagePicker
  },
  data () {
    return {
      userInfo: {},    // 基础信息
      photoFiles: [],
      canCrop: true,
      popupMaxDate: moment(),
      birthVisible: false,
      showDate: '',
      newShowDate: moment(),
      birthPopupFlag: true, // 是否可以选择生日
      count: 0, // 打开生日弹出的次数

      genderText: {
        MALE: '男',
        FEMALE: '女'
      },
      genderOptions: ['男', '女', '取消'],
      childrenText: {
        true: '有',
        false: '无'
      },
      childrenOptions: ['有', '无', '取消'],

      tagsInfo: [], // 用户标签
      resFn: null // 上传头像的reslove
    }
  },
  watch: {
    newShowDate(val) {
      if (val) {
        this.showDate = val.format('YYYY-MM-DD')
      }
    },
    showDate (val) {
      if (val) {
        this.birthPopupFlag = false
        // 保存生日
        if (this.count) {
          this.saveUserInfo()
        }
      }
    }
  },
  created () {
    // 获取用户个人信息
    this.getUserInfo()
  },
  methods: {
    // 获取用户个人信息
    getUserInfo () {
      let promise = axios.all([
        axios.get(`/api/wap/members/getMemberInfo`), // 基础信息
        axios.get(`/api/wap/members/getCheckedTags?limit=6`) // 用户标签
      ]).then(axios.spread((baseRes, tagRes) => {
        // 基础信息
        if (baseRes.data.code === CODE_SUCCESS) {
          this.userInfo = baseRes.data.data
          this.photoFiles = []
          this.photoFiles.push({
            url: this.userInfo.profileImage
          })
          this.showDate = this.userInfo.birthday
        }
        // 用户标签
        if (tagRes.data.code === CODE_SUCCESS) {
          this.tagsInfo = tagRes.data.data
        }
      }))
      Toast.loading('加载中...', promise)
    },
    // 路由跳转
    goRouter () {
      this.$router.push({
        name: 'MinePersonalInfoTags'
      })
    },
    // 路由跳转 -- 昵称/个人签名
    goInfoRouter (name) {
      let infoName = name.toLowerCase()
      this.$router.push({
        name: 'MinePersonalInfo' + name,
        query: { infoType: this.userInfo[infoName] }
      })
    },
    // 修改头像
    onAddImage (rst, fnCallback) {
      let formData = new FormData()
      if (this.canCrop) {
        formData.append('file', rst, 'image.png')
      } else {
        formData.append('file', rst.file)
      }
      formData.append('type', 'MEMBER_HEAD')
      // 把目标图片的地址传给后台，后台返回新的图片数组并更新this.files
      let promise = axios.post('/api/wap/attachment/upload', formData, {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.code === CODE_SUCCESS) {
          this.photoFiles = []
          this.photoFiles.push({
            url: res.data.data.path
          })
          this.userInfo.profileImage = res.data.data.path
          // 回调，清空file的value，从而触发input框的onchange事件
          fnCallback()
        }
      }).finally(() => {
        // 保存头像
        this.saveUserInfo()
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

    // 选择性别和子女信息
    openActionSheet(sheet) {
      let self = this
      let curIndex = 0
      self[sheet + 'Options'].forEach((item, index) => {
        if (item === self[sheet + 'Text'][self.userInfo[sheet]]) {
          curIndex = index
        }
      })
      ActionSheet.showActionSheet(
        {
          cancelButtonIndex: self[sheet + 'Options'].length - 1,
          destructiveButtonIndex: curIndex,
          options: self[sheet + 'Options']
        },
        index => {
          if (index !== self[sheet + 'Options'].length - 1) {
            // 调保存接口
            for (let name in self[sheet + 'Text']) {
              if (self[sheet + 'Options'][index] === self[sheet + 'Text'][name]) {
                self.userInfo[sheet] = name
                self.$forceUpdate()
              }
            }
            self.saveUserInfo()
          }
        }
      )
    },
    // 选择生日
    showBirthPopup () {
      if (this.birthPopupFlag) {
        this.birthVisible = true
        this.count ++
      }
    },

    // 保存个人信息
    saveUserInfo () {
      this.userInfo.birthday = this.showDate
      let promise = axios.post('/api/wap/members/update', this.userInfo)
      Toast.loading('正在保存...', promise)
    }
  },
  beforeDestroy () {
    ActionSheet.close()
  }
}
</script>

