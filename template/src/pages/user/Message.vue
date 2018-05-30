<template>
  <div class="wrap wrap-mine-message">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">我的消息</div>
    </div>
    <!--/.bar-nav-->
    <div class="content" id="scrollContent">
      <div v-if="isEmpty" class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-result">icon</i>
          </div>
          <p>您尚未收到任何消息</p>
        </div>
        <!-- /.tips-no-result -->
      </div>
      <div v-else class="message-box">
        <div v-for="(item, index) in messageInfo" :key="index">
          <div v-if="index === 0"
            class="message-time">{{ item.sendTime }}</div>
          <div v-if="index > 0 && messageInfo[index] && messageInfo[index-1]
            && messageInfo[index].sendTime !== messageInfo[index-1].sendTime"
            class="message-time">{{ item.sendTime }}</div>
          <div class="message-content-box">
            <div class="message-author">
              <img v-lazy="{
                src: item.sender.profileImage ? item.sender.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'
              }" alt="avatar" class="lazy-img-fadein">
            </div>
            <!-- 系统消息 -->
            <div v-if="item.type === 'SYSTEM'" class="message-content">
              <div class="item-goods">
                <div v-if="item.imgPath" class="item-media">
                  <img v-lazy="{
                    src: item.imgPath ? item.imgPath : 'static/images/m/img348x348.jpg',
                    loading: 'static/images/m/img348x348.jpg',
                    error: 'static/images/m/img348x348.jpg'
                  }" alt="avatar" class="lazy-img-fadein">
                </div>
                <div class="item-inner">
                  <div class="item-title _ellipsis2">{{ item.title }}</div>
                  <div class="item-subtitle">{{ item.content }}</div>
                </div>
              </div>
              <!-- /.item-goods -->
            </div>
            <!-- 非系统消息 -->
            <div v-else v-html="item.htmlContent" class="message-content"></div>
          </div>
          <!-- /.message-content-box -->
        </div>
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more">
            <img v-if="messageInfo.length > 10" class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
          </div>
        </infinite-loading>
      </div>
      <!-- /.message-box -->
      <div class="float-window">
        <ScrollTop :container="'#scrollContent'"></ScrollTop>
      </div>
      <!--返回顶部按钮-->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import { Toast } from 'rocoui'
import axios from '@/configs/axios'
import InfiniteLoading from 'vue-infinite-loading'
import ScrollTop from '@/components/ScrollTop'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'MineMessage',
  data () {
    return {
      messageInfo: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false
    }
  },
  components: {
    InfiniteLoading,
    ScrollTop
  },
  computed: {
    loggedUserId () {
      return sessionStorage.getItem('oilmall_user') ? JSON.parse(sessionStorage.getItem('oilmall_user')).memberId : ''
    }
  },
  methods: {
    // 获取实时消息
    onInfinite: function () {
      var self = this
      let promise = axios.get('/api/wap/message', {
        offset: self.offset,
        limit: self.limit
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.messageInfo = self.messageInfo.concat(res.data.data.rows)
            // 替换特殊文字
            self.messageInfo.forEach(item => {
              if (item.type === 'HAND') {
                item.htmlContent = item.content.replace(/{br}/g, '<br>')
                if (item.htmlContent.indexOf('{s}') !== -1) {
                  if (item.sender.id === self.loggedUserId) {
                    item.htmlContent = item.htmlContent.replace(/{s}/, '<a href="community.html#/Index/personalUser?id=' +
                        item.sender.id + '&forward=true" class="links">' + item.sender.nickname + '</a>')
                  } else {
                    item.htmlContent = item.htmlContent.replace(/{s}/, '<a href="community.html#/Index/personalOthers?id=' +
                        item.sender.id + '&forward=true" class="links">' + item.sender.nickname + '</a>')
                  }
                }
                if (item.htmlContent.indexOf('{t}') !== -1) {
                  item.htmlContent = item.htmlContent.replace(/{t}/, '<a href="community.html#/Index/topicDetail?id=' +
                      item.topic.id + '&forward=true" class="links">' + item.topic.name + '</a>')
                }
                if (item.htmlContent.indexOf('{g}') !== -1) {
                  item.htmlContent = item.htmlContent.replace(/{g}/, '<a href="vip.html" class="links">' + item.centRule.cent + '</a>')
                }
                if (item.htmlContent.indexOf('{c}') !== -1) {
                  item.htmlContent = item.htmlContent.replace(/{c}/, item.comment.text)
                }
              }
            })
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.messageInfo.length) {
            self.isEmpty = false
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
      Toast.loading('加载中...', promise)
    }
  }
}
</script>

