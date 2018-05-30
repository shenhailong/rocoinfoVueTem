<template>
  <div class="wrap wrap-community-comment wrap-flex-column">

    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:history.back();" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">话题评论</div>
    </div>
    <div class="content content-column">
      <div class="list-evaluation">
        <div class="item-goods" v-for="items in lists" :key="items.id">
          <div class="author-column flex-between">
            <div class="item-left">
              <div class="author-avatar" @click="personal(items.sender.id)">
                <img v-lazy="{src: items.sender.profileImage ? items.sender.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'}" alt="图片" class="lazy-img-fadein">
              </div>
              <div class="item-inner">
                <div class="item-title _ellipsis">{{items.sender.nickname}}</div>
                <div class="item-subtitle">{{items.createTime}}</div>
              </div>
            </div>
            <a href="javascript:;" @click="reply1(items)">回复</a>
          </div>
          <div class="section-question">
            <div class="item-text">
              {{items.text}}
            </div>
            <div class="item-reply" v-show="items.admTopicComments.total">
              <p v-for="item in items.admTopicComments.rows" :key="item.id">
                <span @click="reply2(items, item)">{{item.sender.nickname}}</span>回复{{item.receiver.nickname}}： {{item.text}}
              </p>
            </div>
          </div>
        </div>

        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more">
            没有更多了
            <!-- <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片"> -->
          </div>
        </infinite-loading>
      </div>
    </div>

    <div class="bar bar-tool bar-bottom" ref="bar">
      <div class="bar-item rocoui-textarea-control">
        <textarea ref="textareaRef" :placeholder="placeholder" maxlength="1000" rows="1" style="" @blur="textareaBlur" v-model="content" @focus="focus" :style="{height: textareaHeight}"></textarea>
      </div>
      <form class="bar-item button-line bar-button-comment" @submit.prevent="saveReply()">
        <a class="btn-normal _solid btn-comment" href="javascript:;" :class="isOk ? ' btn-primary' : ''" @click="saveReply">评论</a>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import InfiniteLoading from 'vue-infinite-loading'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast } from 'rocoui'
import { communityMixin } from '@/mixin/community'
export default {
  mixins: [communityMixin],
  data() {
    return {
      lists: [],
      offset: 0,
      limit: 10,
      isEmpty: false,
      total: 0,
      placeholder: this.$route.query.placeholder,
      content: '',
      textareaHeight: '',
      maxRow: 3,
      oneLineHeight: 0, // 基础的textarea一行高度
      flag: true,
      rows: 1,
      replyData: {
        admTopic: {
          id: ''
        },
        parentComment: {
          id: ''
        },
        prevComment: {
          id: ''
        },
        receiver: {
          id: ''
        },
        receiverType: '',
        level: 1
      },
      isIOS: false
    }
  },
  components: {
    InfiniteLoading
  },
  mounted() {
    this.replyData = {
      admTopic: {
        id: this.$route.query.topicId
      },
      parentComment: {
        id: this.$route.query.parentCommentId
      },
      prevComment: {
        id: this.$route.query.prevCommentId
      },
      receiver: {
        id: this.$route.query.receiverId
      },
      receiverType: this.$route.query.receiverType,
      level: this.$route.query.level
    }
    this.oneLineHeight = this.$refs.textareaRef.offsetHeight
    this.textareaHeight = this.oneLineHeight + ''
    this.$refs.textareaRef.focus()
    var u = navigator.userAgent
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  },
  methods: {
    focus(e) {
      let self = this
      // 获得屏幕的高度
      var $windowHeight = document.documentElement.clientHeight
      // let a = this.$refs.a.offsetHeight
      // console.log('a' + a)
      // console.log('$windowHeight ' + $windowHeight)
      // vh的计算原理,这个要自己慢慢计算出来
      var bili = 50.8 / 100
      // 这个是input框应该显示的位置,应为全局变量
      var maxheight = Math.floor(bili * $windowHeight)
      // console.log('maxheight ' + maxheight)
      if (this.isIOS) {
        setTimeout(function () {
          // 框架自己自带的方法,主要用着鉴别设备
          // 获取页面卷去的高度
          var scrollPos = document.body.scrollTop
          // console.log('scrollPos ' + scrollPos)
          // 以防出现maxheight计算错误
          if (scrollPos > maxheight) {
            maxheight = scrollPos
          }
          // 出现了遮挡的情况,就把footer和主要内容上移
          if (scrollPos !== 0 && scrollPos < maxheight) {
            // 我自己项目的实际移动距离,根据实际情况移动
            self.$refs.bar.style.paddingBottom = '11.5vh'
          }
        }, 200)
      }
    },
    // 上拉加载
    onInfinite: function () {
      var self = this
      axios.get('/api/wap/topic/comment/queryTopicComments', {
        params: {
          offset: self.offset,
          limit: self.limit,
          topicId: self.$route.query.topicId
        }
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
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
          // Toast.fail(res.data.message)
          self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
        }
      })
    },
    // 一层回复
    reply1(items) {
      this.replyData = {
        admTopic: {
          id: items.admTopic.id
        },
        parentComment: {
          id: items.id
        },
        prevComment: {
          id: items.id
        },
        receiver: {
          id: items.sender.id
        },
        receiverType: items.senderType,
        level: 2
      }
      this.placeholder = '回复' + items.sender.nickname
      this.$refs.textareaRef.focus()
    },
    // 2层回复
    reply2(items, item) {
      this.replyData = {
        admTopic: {
          id: item.admTopic.id
        },
        parentComment: {
          id: items.id
        },
        prevComment: {
          id: item.id
        },
        receiver: {
          id: item.sender.id
        },
        receiverType: item.senderType,
        level: 2
      }
      this.placeholder = '回复' + item.sender.nickname
      this.$refs.textareaRef.focus()
    },
    // textareaBlur 失去焦点恢复评论状态就是回复话题
    textareaBlur() {
      if (this.content === '') {
        this.replyData = {
          admTopic: {
            id: this.$route.query.topicId
          },
          parentComment: {
            id: 0
          },
          prevComment: {
            id: 0
          },
          receiver: {
            id: this.$route.query.topicReceiverId
          },
          receiverType: this.$route.query.topicReceiverType,
          level: 1
        }
      }
      this.placeholder = '说出你的想法'
      if (this.isIOS) {
        setTimeout(() => {
          if (this.$refs.bar) {
            this.$refs.bar.style.paddingBottom = '5px'
          }
        }, 300)
      }
    },
    saveReply() { // 发表回复
      if (this.content.trim() === '') {
        return
      }
      if (!this.onOff) {
        return false
      }
      this.onOff = false
      let sendData = {
        admTopic: {
          id: this.replyData.admTopic.id
        },
        parentComment: {
          id: this.replyData.parentComment.id
        },
        prevComment: {
          id: this.replyData.prevComment.id
        },
        receiver: {
          id: this.replyData.receiver.id
        },
        receiverType: this.replyData.receiverType,
        level: this.replyData.level,
        text: this.content
      }
      axios.post('/api/wap/topic/comment/create', sendData).then(res => {
        if (res.data.code === '1') {
          Toast.success('回复成功')
          this.content = ''
          this.replyData = {
            admTopic: {
              id: this.$route.query.topicId
            },
            parentComment: {
              id: 0
            },
            prevComment: {
              id: 0
            },
            receiver: {
              id: this.$route.query.topicReceiverId
            },
            receiverType: this.$route.query.topicReceiverType,
            level: 1
          }
          this.placeholder = '说出你的想法'
          this.lists = []
          this.offset = 0
          this.isEmpty = false
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
          this.onOff = true
        } else {
          this.onOff = true
        }
      })
    }
  },
  computed: {
    isOk() {
      if (this.content && this.content.trim() !== '') {
        return true
      }
      return false
    }
  },
  watch: {
    'content'(val, oldValue) {
      const textareaDom = this.$refs.textareaRef
      let s = this.textareaHeight.replace('px', '')
      // if (this.flag) {
      //   this.oneLineHeight = textareaDom.scrollHeight / this.rows
      //   this.flag = false
      // }
      if (val && s / this.oneLineHeight === this.maxRow) {
        return
      } else if (val && textareaDom.scrollHeight >= this.oneLineHeight * this.maxRow) {
        this.textareaHeight = `${this.oneLineHeight * this.maxRow}px`
        return
      }
      if (val) {
        this.textareaHeight = `${textareaDom.scrollHeight}px`
      } else {
        this.textareaHeight = ''
      }
    }
  }
}
</script>

