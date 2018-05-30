import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import InfiniteLoading from 'vue-infinite-loading'
import {
  Toast
} from 'rocoui'
export var communityMixin = {
  data() {
    return {
      onOff: true, // 防止连击
      loggedUserId: '' // 获取当前登录用户id（跳转详情两种页面需要判断）
    }
  },
  mounted() {
    this.loggedUserId = sessionStorage.getItem('oilmall_user') ? JSON.parse(sessionStorage.getItem('oilmall_user')).memberId : ''
  },
  methods: {
    // 话题详情详情
    detail(id) {
      this.$router.push({
        path: `/Index/topicDetail?id=${id}&forward=true`
      })
    },
    // 点赞
    addPraise(items) {
      // addPraise true是可以点赞
      if (!this.onOff) {
        return false
      }
      this.onOff = false
      axios.get(`/api/wap/topic/${items.id}/${items.addPraise ? 'addPraise' : 'delPraise'}`).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          items.praiseCount = items.addPraise ? items.praiseCount + 1 : items.praiseCount - 1
          items.addPraise = !items.addPraise
          this.onOff = true
        } else {
          this.onOff = true
        }
      })
    },
    // 社群个人首页
    personal(id) {
      this.$router.push({
        path: `/Index/${id === this.loggedUserId ? 'personalUser' : 'personalOthers'}?id=${id}`
      })
    },
    // 播放视频
    playVideo(index) {
      let videoPlayer = 'videoPlayer' + index
      this.$refs[videoPlayer][0].play()
    }
  }
}

// 关注方法
export var followStatus = {
  methods: {
    // 关注状态
    followStatus(items) {
      if (!this.onOff) {
        return false
      }
      this.onOff = false
      // addFollow true是可以关注
      axios.post(`/api/wap/forum/${items.addFollow ? 'addFollow' : 'delFollow'}`, {
        memberIds: [items.id]
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          items.addFollow = !items.addFollow
          this.onOff = true
        } else {
          this.onOff = true
        }
      })
    }
  }
}

// InfiniteLoading
export var InfiniteLoadingMixin = {
  components: {
    InfiniteLoading
  },
  data() {
    return {
      lists: [],
      total: 0,
      isEmpty: false
    }
  },
  methods: {
    onInfinite: function () {
      var self = this
      axios.get(this.url, {
        params: {
          ...this.params
        }
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.lists = self.lists.concat(res.data.data.rows)
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.params.offset += self.params.limit
            if (self.params.offset >= self.total) {
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
          self.isEmpty = true
          Toast.fail(res.data.message)
          self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
        }
      })
    }
  }
}
