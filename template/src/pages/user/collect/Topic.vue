<template>
  <div v-if="isEmpty" class="tips-box">
    <div class="tips-no-result">
      <div class="icon-area">
        <i class="icon icon-no-collect">icon</i>
      </div>
      <p>还未收藏任何内容</p>
    </div>
    <!-- /.tips-no-result -->
  </div>
  <!-- /.tips-box -->
  <div v-else class="list-topic">
    <div v-for="(item, index) in info" :key="index"
      @click="goTopicRouter(item)" class="item-goods item-horizontal">
      <div class="item-media">
        <video v-if="item.admTopic.videoPath" :src="item.admTopic.videoPath"
          :poster="item.admTopic.videoImage?item.admTopic.videoImage:''"
          :ref="'topicVideo'+index" @click.stop="togglePlay(index)"></video>
        <img v-else v-lazy="{
          src: item.admTopic && item.admTopic.admTopicTags[0] && item.admTopic.admTopicTags[0].imagePath ? item.admTopic.admTopicTags[0].imagePath : 'static/images/lazyload/348x348.jpg',
          loading: 'static/images/lazyload/348x348.jpg',
          error: 'static/images/lazyload/348x348.jpg'
        }" alt="avatar" class="lazy-img-fadein">
      </div>
      <div class="item-inner">
        <div class="item-title _ellipsis">{{ item.admTopic.name }}</div>
        <div class="item-subtitle _ellipsis3">{{ item.admTopic.contentText }}</div>
        <!-- /.title -->
        <div class="author-column-box item-bottom">
          <div class="author-column">
            <div class="author-avatar">
              <img v-lazy="{
                src: item.admTopic.member.profileImage ? item.admTopic.member.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'
              }" alt="avatar" class="lazy-img-fadein">
              <svg v-show="item.admTopic.member.type==='OFFICIAL'" class="svg-member-circle">
                <use xlink:href="#svg-member-circle" />
              </svg>
            </div>
            <div class="text _ellipsis">{{ item.admTopic.member.nickname }}</div>
          </div>
          <!-- /.author -->
          <div v-if="item.admTopic.status === 'FEATURED'" class="tag tag-primary">精选</div>
        </div>
        <!-- /.author-column-box -->
      </div>
      <!-- /.item-inner -->
    </div>
    <!--/.item-goods 水平摆放商品-->
    <infinite-loading :on-infinite="getTopic" ref="topicInfinite" spinner="circles" key="topic">
      <span slot="no-results" style="display:none;"></span>
      <div class="tips-txt" slot="no-more">
        <img v-if="info.length > 4" class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
      </div>
    </infinite-loading>
  </div>
  <!-- 收藏的话题end -->
</template>

<script>
import { Toast } from 'rocoui'
import axios from '@/configs/axios'
import InfiniteLoading from 'vue-infinite-loading'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  data () {
    return {
      info: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false
    }
  },
  components: {
    InfiniteLoading
  },
  methods: {
    getTopic: function () {
      var self = this
      let promise = axios.get('/api/wap/collection/topic', {
        offset: self.offset,
        limit: self.limit,
        useStatus: 'topic'
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.info = self.info.concat(res.data.data.rows)
            self.$refs.topicInfinite.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.topicInfinite.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.info.length) {
            self.isEmpty = false
            self.$refs.topicInfinite.$emit('$InfiniteLoading:complete')
          } else {
            self.isEmpty = true
            self.$refs.topicInfinite.$emit('$InfiniteLoading:complete')
          }
        } else {
          Toast.fail(res.data.message)
          self.$refs.topicInfinite.$emit('$InfiniteLoading:complete')
        }
      })
      Toast.loading('加载中...', promise)
    },
    togglePlay (index) {
      let video = 'topicVideo' + index
      let player = this.$refs[video][0]
      player.paused ? player.play() : player.pause()
    },
    goTopicRouter (item) {
      window.location.href = `community.html#/Index/topicDetail?id=${item.admTopic.id}&forward=true`
    }
  }
}
</script>
