<template>
  <div class="wrap wrap-center-mine-focus">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">我的关注</div>
    </div>
    <!--/.bar-nav-->
    <div class="content" id="scrollContent">
      <div v-if="isEmpty" class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-focus">icon</i>
          </div>
          <p>没有关注任何人</p>
        </div>
        <!-- /.tips-no-result -->
      </div>
      <!-- /.tips-box -->
      <div v-else class="list-user">
        <div v-for="(item, index) in focusInfo" :key="index"
          @click="goRouter(item.targetMember.id)" class="item-goods item-horizontal">
          <div class="author-column">
            <div class="author-avatar">
              <img v-lazy="{
                src: item.targetMember.profileImage ? item.targetMember.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'
              }" alt="avatar" class="lazy-img-fadein">
              <svg v-show="item.targetMember.type==='OFFICIAL'" class="svg-member-circle size-lg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-member-circle"></use>
              </svg>
            </div>
          </div>
          <!-- /.author -->
          <div class="item-flex-between item-right">
            <div class="item-inner">
              <div class="item-title _ellipsis">{{ item.targetMember.nickname }}</div>
              <div class="item-subtitle _ellipsis">{{ item.targetMember.signature }}</div>
              <!-- /.title -->
            </div>
            <!-- /.item-inner -->
            <div class="item-align-center">
              <a href="javascript:;"
              @click.stop="changeFocus(item.targetMember, item.targetMember.hasFollowMe?'del':'add')"
              :class="{'btn-primary':!item.targetMember.hasFollowMe}"
              class="btn-normal btn-sm">
              {{ item.targetMember.hasFollowMe?'取消关注':'关注' }}
            </a>
            </div>
          </div>
          <!-- /.item-right -->
        </div>
        <!--/.item-goods 水平摆放商品-->
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more">
            <span v-if="focusInfo.length > 8">-已经到底了-</span>
          </div>
        </infinite-loading>
      </div>
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
  name: 'MineFocus',
  data () {
    return {
      focusInfo: [],
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
    onInfinite: function () {
      var self = this
      let promise = axios.get('/api/wap/follow/myFollows', {
        offset: self.offset,
        limit: self.limit
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.focusInfo = self.focusInfo.concat(res.data.data.rows)
            self.focusInfo.forEach(item => {
              item.targetMember.hasFollowMe = true
            })
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.focusInfo.length) {
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
    },
    // 路由跳转
    goRouter (id) {
      if (id === this.loggedUserId) {
        window.location.href = `community.html#/Index/personalUser?id=${id}&forward=true`
      } else {
        window.location.href = `community.html#/Index/personalOthers?id=${id}&forward=true`
      }
    },
    // 关注或取消
    changeFocus (member, handle) {
      axios.post(`/api/wap/forum/${handle}Follow`, { memberIds: [member.id] })
      .then(res => {
        member.hasFollowMe = !member.hasFollowMe
        this.$forceUpdate()
      })
    }
  }
}
</script>

