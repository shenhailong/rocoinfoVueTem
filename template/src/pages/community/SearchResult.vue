<template>
  <div class="wrap wrap-search">
    <div class=" bar bar-search _border  bar-absolute-top">
      <a href="javascript:history.back();" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="item-search">
        <div class="search clearfix" id="search">
          <div class="search-input _radius">
            <form action="" @submit.prevent="saveResult(keyword)">
              <input data-handle="_searchinput" ref="input" placeholder="查找话题" v-model="keyword">
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

    <div class="content" id="scrollContent">
      <div class="list-topic" v-show="!isEmpty">
        <div class="item-goods item-horizontal" v-for="(items, index) in lists" :key="items.id">
          <div class="item-media" v-if="!items.videoPath" @click="detail(items.id)">
            <img v-lazy="{src: items.admTopicTags[0] ? items.admTopicTags[0].imagePath : 'static/images/lazyload/214x162.jpg',
                loading: 'static/images/lazyload/214x162.jpg',
                error: 'static/images/lazyload/214x162.jpg'}" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-media item-media-community" v-if="items.videoPath" @click="playVideo(index, items)">
            <video :src="items.videoPath" :ref="'videoPlayer' + index" x5-playsinline="" playsinline="" :poster="items.videoImage ? items.videoImage : ''" webkit-playsinline="" preload style="width:100%;height: 120px;"></video>
            <i class="community-list icon icon-play" v-show="items.showIcon">icon</i>
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis" @click="detail(items.id)">{{items.name}}</div>
            <div class="item-subtitle _ellipsis3" @click="detail(items.id)">
              {{items.contentText}}
            </div>

            <div class="author-column-box item-bottom" @click="personal(items.member.id)">
              <div class="author-column">
                <div class="author-avatar">
                  <img v-lazy="{src: items.member.profileImage ? items.member.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'}" alt="商品图片" class="lazy-img-fadein">
                  <svg class="svg-member-circle" v-if="items.type === 'OFFICIAL'">
                    <use xlink:href="#svg-member-circle" />
                  </svg>
                  <div class="member-grade" v-if="items.type !== 'OFFICIAL' && items.member.level">
                    <svg class="svg-member-grade">
                      <use xlink:href="#svg-member-grade"></use>
                    </svg>
                    <span class="num">{{items.member.level.levelNum - 1}}</span>
                  </div>
                </div>
                <div class="text _ellipsis">{{items.member.nickname}}</div>
              </div>
              <div class="tag tag-primary" v-show="items.status === 'FEATURED'">精选</div>
            </div>
          </div>
        </div>
      </div>

      <div class="tips-box" v-show="isEmpty">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-result">icon</i>
          </div>
          <p>很抱歉，没有找到</p>
          <p>“{{propskKeyword}}”有关的话题</p>
        </div>
      </div>
      <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
        <span slot="no-results" style="display:none;"></span>
        <div class="tips-txt" slot="no-more">
          <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片" v-if="lists.length >= 4">
        </div>
      </infinite-loading>
    </div>
    <div class="float-window">
      <ScrollTop :container="'#scrollContent'"></ScrollTop>
    </div>
  </div>
</template>

<script>
import store from '@/configs/store'
import ScrollTop from '@/components/ScrollTop'
import InfiniteLoading from 'vue-infinite-loading'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast } from 'rocoui'
import * as activityType from '@/constants/activityType'
import { communityMixin } from '@/mixin/community'
export default {
  mixins: [communityMixin],
  components: {
    InfiniteLoading,
    ScrollTop
  },
  data() {
    return {
      activityType,
      lists: [],
      offset: 0,
      limit: 10,
      isEmpty: false,
      total: 0,
      keyword: this.$route.query.keyword, // 输入框初始要带入
      init: true,
      transitionName: 'slide-out',
      propskKeyword: this.$route.query.keyword // 初始值
    }
  },
  methods: {
    // 保存查询记录，并且跳转页面 热门词 | 历史搜索词 | 输入框
    saveResult(word) {
      if (word === '') {
        return
      }
      this.$refs.input.blur()
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
      this.propskKeyword = word
      this.resetResult()
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
    onInfinite: function () {
      var self = this
      axios.get('/api/wap/topic', {
        params: {
          offset: self.offset,
          limit: self.limit,
          keyword: self.keyword,
          searchTag: 'HOT'
        }
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            res.data.data.rows.forEach(ele => {
              ele.showIcon = true
            })
            self.lists = self.lists.concat(res.data.data.rows)
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.lists.length) {
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          } else {
            self.isEmpty = true
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        } else {
          Toast.fail(res.data.message)
          self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
        }
      })
    },
    // 搜索
    resetResult() {
      this.lists = []
      this.offset = 0
      this.isEmpty = false
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
    },
    playVideo(index, items) {
      let videoPlayer = 'videoPlayer' + index
      items.showIcon = false
      this.$refs[videoPlayer][0].play()
    }
  }
}
</script>
