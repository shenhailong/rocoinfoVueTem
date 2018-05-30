<template>
  <div class="wrap wrap-search-record">
    <div class=" bar bar-search _border bar-absolute-top">
      <a href="javascript:history.back();" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="item-search">
        <div class="search clearfix" id="search">
          <div class="search-input _radius">
            <form action="" @submit.prevent="saveResult(keyword)">
              <input data-handle="_searchinput" placeholder="搜索商品/话题/用户" v-model="keyword">
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

    <div class="content">
      <div class="content-block-title">
        热门搜索
      </div>
      <div class="tag-block _random">
        <span class="tag tag-lg _ellipsis" v-for="item in hotList" :key="item" @click="saveResult(item)">{{item}}</span>
      </div>
      <div class="space-20"></div>
      <div class="content-block-title" v-show="searchHistory">
        历史搜索
      </div>
      <!-- <div class="tips-box" v-show="!searchHistory">
        <div class="tips-no-result">
          <p>没有历史记录</p>
        </div>
      </div> -->
      <div class="search-history" v-show="searchHistory">
        <ul class="list-search-history">
          <li @click="saveResult(item)" v-for="item in searchHistoryList" :key="item">
            <a href="javascript:;" class="item">{{item}}</a>
          </li>
        </ul>
        <div class="text-center">
          <a href="javascript:;" class="btn-normal btn-xxl btn-clearall" @click="clearHistory">清空历史记录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import CODE_SUCCESS from '@/constants/responseCode'
import store from '@/configs/store'
import axios from 'axios'
import { Toast, Modal } from 'rocoui'
export default {
  data() {
    return {
      searchHistory: true,
      searchHistoryList: [],
      hotList: [], // 热门关键词
      keyword: ''
    }
  },
  created() {
    // 先拿到store里的历史搜索记录判断有没有
    this.searchHistoryList = store.get('searchHistory') || []
    if (this.searchHistoryList.length > 0) {
      this.searchHistory = true
    } else {
      this.searchHistory = false
    }
    this.hotKeyWord()
  },
  methods: {
    // 获取热门关键词
    hotKeyWord() {
      let self = this
      let promise = axios.get('/api/wap/dictconstant/HOT_KEY').then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          self.hotList = res.data.data
        }
      })
      Toast.loading('正在加载...', promise)
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
    // 保存查询记录，并且跳转页面 热门词 | 历史搜索词 | 输入框
    saveResult(word) {
      if (word === '') {
        return
      }
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
      this.keyword = word
      store.remove('lastKeyword')
      store.set('currentPage', 'SearchProduct')
      this.$router.push({ path: `/main/search/searchResult?keyword=${word}` })
    },
    // 清空历史记录
    clearHistory() {
      Modal.confirm({
        title: '确定清空历史搜索记录？',
        okText: '确定',
        cancelText: '取消',
        okCb: () => {
          store.remove('searchHistory')
          this.searchHistoryList = []
          this.searchHistory = false
        }
      })
    }
  }
}
</script>

