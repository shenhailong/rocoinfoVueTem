<template>
  <div class="wrap wrap-add-pin">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" class="bar-item item-arrow" @click="goBack">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">添加标签</div>
      <a href="javascript:;" class="bar-item text" @click="saveDraft">保存草稿</a>
    </div>

    <div class="content">

      <div class="swiper-container swiper-container-details" ref="labelSwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(items, index) in sendData.admTopicTags" :key="items.id" style="position: relative">
            <img :src="items.imagePath" alt="详情图">
            <label-canvas v-if="items.showCanvas" :effect="items.effect" :name="items.name" :currentRef="items.id" @searchName="searchName" :ref="'canvas' + index" @removeLabel="removeLabel"></label-canvas>
          </div>
        </div>

        <div class="pagination"></div>
      </div>

      <div class="text-center content-add-pin">
        <a href="javascript:;" class="btn-normal btn-primary btn-add-tags" @click="addLabel">添加标签</a>
        <div class="text">
          <p>如果无需添加商品标签</p>
          <p>可以点击发布按钮,发布话题</p>
        </div>
        <div class="button-block">
          <button type="button" class="btn-normal btn-primary _solid btn-xxl" @click="publish">发布</button>
        </div>
      </div>

    </div>
    <transition name="fadeScale">
      <SearchName v-if="searchFilter" @filterBack="filterBack" :isName="isName" :name="name" :effect="effect" />
    </transition>

  </div>
</template>

<script type="text/ecmascript-6">
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import store from '@/configs/store'
import Swiper from 'Swiper'
import { Toast } from 'rocoui'
import labelCanvas from '@/components/Community/Canvas'
import SearchName from '@/components/Community/SearchName'
export default {
  data() {
    return {
      sendData: {
        contentText: '', // 内容
        name: '', // 标题
        admTopicTags: [],
        sku: {
          id: ''
        },
        type: 'ORDINARY'
      },
      swiperIndex: 0,
      searchFilter: false,
      name: '',
      effect: '',
      isName: true // 弹层搜索是名称还是功效
    }
  },
  components: {
    'label-canvas': labelCanvas,
    SearchName
  },
  mounted() {
    this.sendData = JSON.parse(store.get('topicSendData')) || {}
    this.sendData.sku = {}
    this.initSwiper()
  },
  methods: {
    initSwiper() {
      let self = this
      this.$nextTick(() => {
        this.labelSwiper = new Swiper(this.$refs.labelSwiper, {
          pagination: '.pagination',
          paginationType: 'fraction',
          lazyLoading: true,
          lazyLoadingOnTransitionStart: true,
          lazyLoadingInPrevNext: true,
          lazyLoadingInPrevNextAmount: 2,
          onSlideChangeEnd: function (swiper) {
            self.swiperIndex = swiper.activeIndex
          },
          paginationFractionRender: function (
            swiper,
            currentClassName,
            totalClassName
          ) {
            return (
              '<span class="' +
              currentClassName +
              '"></span>' +
              '/' +
              '<span class="' +
              totalClassName +
              '"></span>'
            )
          }
        })
      })
    },
    // 发布
    publish() {
      this.sendData.status = 'NOT_APPROVAL'
      this.sendData.type = 'ORDINARY'
      if (!this.sendData.sku) {
        this.sendData.sku = {}
      }
      for (let index = 0; index < this.sendData.admTopicTags.length; index++) {
        if (this.sendData.admTopicTags[index].sku) {
          this.sendData.sku.id = this.sendData.admTopicTags[index].sku
          break
        }
      }
      let promise = axios
        .post(
        `/api/wap/topic/${this.sendData.id ? 'modify' : 'create'}`,
        this.sendData
        )
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            Toast.success('发布成功')
            this.$router.replace({ path: '/Index' })
            store.remove('topicSendData')
          } else {
            Toast.error('发布失败')
          }
        })
      Toast.loading('正在保存...', promise)
    },
    saveDraft() {
      this.sendData.status = 'DRAFT'
      let promise = axios
        .post(
        `/api/wap/topic/${this.sendData.id ? 'modify' : 'create'}`,
        this.sendData
        )
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            Toast.success('保存草稿成功')
            this.sendData.id = res.data.data
          } else {
            Toast.error('保存草稿失败')
          }
        })
      Toast.loading('正在保存...', promise)
    },
    // 添加标签
    addLabel() {
      this.isName = true
      if (this.sendData.admTopicTags[this.swiperIndex].showCanvas) {
        Toast.info('每张图片只能添加一个标签')
      } else {
        this.$set(
          this.sendData.admTopicTags[this.swiperIndex],
          'showCanvas',
          true
        )
      }
    },
    // 关闭选择弹窗
    filterBack(val) {
      this.searchFilter = false
      if (val) {
        this.$set(
          this.sendData.admTopicTags[this.swiperIndex],
          'name',
          val.name
        )
        this.$set(
          this.sendData.admTopicTags[this.swiperIndex],
          'effect',
          val.effect
        )
        this.sendData.admTopicTags[this.swiperIndex].sku = val.skuId
      }
    },
    searchName(val) {
      this.isName = val
      this.name = this.sendData.admTopicTags[this.swiperIndex].name
      this.effect = this.sendData.admTopicTags[this.swiperIndex].effect
      this.searchFilter = true
    },
    removeLabel() {
      this.$set(
        this.sendData.admTopicTags[this.swiperIndex],
        'showCanvas',
        false
      )
      this.sendData.admTopicTags[this.swiperIndex].name = ''
      this.sendData.admTopicTags[this.swiperIndex].effect = ''
    },
    goBack() {
      store.set('topicSendData', JSON.stringify(this.sendData))
      this.$router.back()
    }
  }
}
</script>

