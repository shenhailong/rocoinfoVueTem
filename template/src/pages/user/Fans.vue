<template>
  <div class="wrap wrap-center-mine-fans">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">我的粉丝</div>
    </div>
    <!--/.bar-nav-->
    <div class="content" id="scrollContent">
      <div v-if="isEmpty" class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-fans">icon</i>
          </div>
          <p>一大波粉丝正向你涌来</p>
        </div>
        <!-- /.tips-no-result -->
      </div>
      <!-- /.tips-box -->
      <div v-else class="list-user">
        <div v-for="(item, index) in fansInfo" :key="index"
          @click="goRouter(item.member.id)" class="item-goods item-horizontal">
          <div class="author-column">
            <div class="author-avatar">
              <img v-lazy="{
                src: item.member.profileImage ? item.member.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'
              }" alt="avatar" class="lazy-img-fadein">
              <svg v-show="item.member.type==='OFFICIAL'" class="svg-member-circle size-lg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-member-circle"></use>
              </svg>
            </div>
          </div>
          <!-- /.author -->
          <div class="item-inner">
            <div class="item-title _ellipsis">{{ item.member.nickname }}</div>
            <div class="item-subtitle _ellipsis">{{ item.member.signature }}</div>
            <!-- /.title -->
          </div>
          <!-- /.item-inner -->
          <div class="item-align-center">
            <a href="javascript:;"
              @click.stop="changeFocus(item.member, item.member.addFollow?'add':'del')"
              :class="{'btn-primary':item.member.addFollow}"
              class="btn-normal btn-sm">
              {{ item.member.addFollow?'关注':'取消关注' }}
            </a>
          </div>
        </div>
        <!--/.item-goods 水平摆放商品-->
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more">
            <span v-if="fansInfo.length > 8">-已经到底了-</span>
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
  name: 'MineFans',
  data () {
    return {
      fansInfo: [],
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
      let promise = axios.get('/api/wap/follow/myFans', {
        offset: self.offset,
        limit: self.limit
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.fansInfo = self.fansInfo.concat(res.data.data.rows)
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.fansInfo.length) {
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
        member.addFollow = !member.addFollow
      })
    }
  }
}
</script>

