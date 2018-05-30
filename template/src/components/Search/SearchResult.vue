<template>
  <div class="wrap wrap-search">
    <div class="bar-box-top bar-absolute-top">
      <div class=" bar bar-search _border ">
        <a href="javascript:history.back();" class="bar-item item-arrow">
          <svg class="svg-arrow _left">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <div class="item-search">
          <div class="search clearfix" id="search">
            <div class="search-input _radius">
              <form action="" @submit.prevent="saveResult(keyword)">
                <input data-handle="_searchinput" ref="input" placeholder="搜索商品名称" v-model="keyword">
              </form>
              <label class="search-icon-front">
                <svg class="svg-search">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-search"></use>
                </svg>
              </label>
            </div>
          </div>
        </div>
        <a href="javascript:;" class="item-search-btn" @click="saveResult(keyword)">搜索</a>
      </div>

      <div class="main-tab">
        <nav class="main-tab-links">
          <div class="item" :class="{'_active': currentPage === 'SearchProduct'}" @click="changePage('SearchProduct')">
            商品
          </div>
          <div class="item" :class="{'_active': currentPage === 'SearchTopic'}" @click="changePage('SearchTopic')">
            话题
          </div>
          <div class="item" :class="{'_active': currentPage === 'SearchUser'}" @click="changePage('SearchUser')">
            用户
          </div>
        </nav>
      </div>

    </div>

    <div class="content" id="scrollContent">
      <transition :name="transitionName">
        <keep-alive>
          <component :is="currentPage" class="acce-3d child-sub-view" :keyword="propskKeyword" v-if="init" ref="infiniteLoading"></component>
        </keep-alive>
      </transition>
    </div>
    <ScrollTop :container="'#scrollContent'"></ScrollTop>
  </div>
</template>

<script type="text/ecmascript-6">
import store from '@/configs/store'
import ScrollTop from '../ScrollTop'
import SearchProduct from './SearchProduct'
import SearchTopic from './SearchTopic'
import SearchUser from './SearchUser'
export default {
  data() {
    return {
      keyword: store.get('lastKeyword') || this.$route.query.keyword, // 输入框初始要带入
      currentPage: 'SearchProduct', // 当前显示
      init: true,
      transitionName: 'slide-in',
      propskKeyword: store.get('lastKeyword') || this.$route.query.keyword // 初始值
    }
  },
  components: {
    SearchProduct,
    SearchTopic,
    SearchUser,
    ScrollTop
  },
  created() {
    this.currentPage = store.get('currentPage') || 'SearchProduct'
  },
  methods: {
    // 保存查询记录，并且跳转页面 热门词 | 历史搜索词 | 输入框
    saveResult(word) {
      if (word === '') {
        return
      }
      this.init = false
      this.$refs.input.blur()
      let history = store.get('searchHistory') || []
      if (history.length >= 10) {
        history.pop()
        history.unshift(word)
        history = this.unique(history)
        store.set('searchHistory', history)
      } else {
        history.unshift(word)
        history = this.unique(history)
        store.set('searchHistory', history)
      }
      this.propskKeyword = word
      store.set('lastKeyword', word)
      this.init = true
      // this.$refs.infiniteLoading.resetResult()
    },
    // 数组去重
    unique(history) {
      var res = []
      var json = {}
      for (var i = 0; i < history.length; i++) {
        if (!json[history[i]]) {
          res.push(history[i])
          json[history[i]] = 1
        }
      }
      return res
    },
    // 切换限时当前page
    changePage(value) {
      this.currentPage = value
      store.set('currentPage', value)
    }
  }
}
</script>

