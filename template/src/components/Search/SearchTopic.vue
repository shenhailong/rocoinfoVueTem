<template>
  <div>
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
        <p>“{{keyword}}”有关的话题</p>
      </div>
    </div>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
      <span slot="no-results" style="display:none;"></span>
      <div class="tips-txt" slot="no-more">
        <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片" v-if="lists.length >= 4">
      </div>
    </infinite-loading>
  </div>
</template>

<script type="text/ecmascript-6">
import InfiniteLoading from 'vue-infinite-loading'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast } from 'rocoui'
export default {
  props: {
    keyword: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      lists: [],
      offset: 0,
      limit: 10,
      isEmpty: false,
      total: 0,
      loggedUserId: '' // 获取当前登录用户id（跳转详情两种页面需要判断）
    }
  },
  mounted() {
    this.loggedUserId = sessionStorage.getItem('oilmall_user') ? JSON.parse(sessionStorage.getItem('oilmall_user')).memberId : ''
  },
  components: {
    InfiniteLoading
  },
  methods: {
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
    resetResult() {
      this.lists = []
      this.offset = 0
      if (this.lists.length === 0) {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      }
    },
    // 详情
    detail(id) {
      window.location.href = `community.html#/Index/topicDetail?id=${id}&forward=${true}`
    },
    playVideo(index, items) {
      items.showIcon = false
      let videoPlayer = 'videoPlayer' + index
      this.$refs[videoPlayer][0].play()
    },
    // 社群个人首页
    personal(id) {
      window.location.href = `community.html#/Index/${id === this.loggedUserId ? 'personalUser' : 'personalOthers'}?id=${id}&forward=${true}`
    }
  },
  watch: {
    keyword(val) {
      this.lists = []
      this.resetResult()
    }
  }
}
</script>
