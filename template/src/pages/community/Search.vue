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
              <input data-handle="_searchinput" placeholder="查找话题" v-model="keyword">
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
        历史搜索
      </div>
      <div class="tips-box" v-show="!searchHistory">
        <div class="tips-no-result">
          <p>没有历史记录</p>
        </div>
      </div>
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

<script>
import store from '@/configs/store'
export default {
  data() {
    return {
      searchHistory: true,
      searchHistoryList: [],
      keyword: ''
    }
  },
  created() {
    // 先拿到store里的历史搜索记录判断有没有
    this.searchHistoryList = store.get('searchTopicHistory') || []
    if (this.searchHistoryList.length > 0) {
      this.searchHistory = true
    } else {
      this.searchHistory = false
    }
  },
  methods: {
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
      let history = store.get('searchTopicHistory') || []
      if (history.length >= 10) {
        history.pop()
        history.unshift(word)
        history = this.unique(history)
        store.set('searchTopicHistory', history)
      } else {
        history.unshift(word)
        history = this.unique(history)
        store.set('searchTopicHistory', history)
      }
      this.keyword = word
      this.$router.push({ path: `/Index/Search/SearchResult?keyword=${word}` })
    },
    // 清空历史记录
    clearHistory() {
      store.remove('searchTopicHistory')
      this.searchHistoryList = []
      this.searchHistory = false
    }
  }
}
</script>
