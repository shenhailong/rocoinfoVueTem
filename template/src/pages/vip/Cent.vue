<template>
  <div class="wrap wrap-details-intergral">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">积分详情</div>
      <a href="javascript:;" class="bar-item links-text">积分说明</a>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <div class="intergral-header-box">
        <div class="intergral-value"><span class="num">{{ $route.query.centBalance }}</span>积分</div>
      </div>
      <div class="list-intergral" id="scrollContent">
        <div v-for="(item, index) in centInfo" :key="index" class="item-goods item-horizontal">
          <div class="item-inner">
            <template v-if="item.target">
              <div class="item-title _ellipsis">{{ item.target.type === 'CONSUME' ? item.target.description.text : item.target.description }}</div>
            </template>
            <div class="item-subtitle _ellipsis">{{ item.createTime }}</div>
            <!-- /.title -->
          </div>
          <!-- /.item-inner -->
          <div v-if="item.type==='OBTAIN'" class="item-intergral-num increace">
            +{{ item.quantity }}
          </div>
          <div v-else class="item-intergral-num decrease">
            {{ item.quantity }}
          </div>
        </div>
        <!-- /item-goods -->
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more">
            <span v-if="centInfo.length > 8">-已经到底了-</span>
          </div>
        </infinite-loading>
      </div>
      <!-- /.list-intergral -->
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
import axios from '@/configs/axios'
import InfiniteLoading from 'vue-infinite-loading'
import ScrollTop from '@/components/ScrollTop'
import { Toast } from 'rocoui'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'VipCent',
  data () {
    return {
      centInfo: [],
      offset: 0,
      limit: 15,
      total: 0,
      isEmpty: false
    }
  },
  components: {
    InfiniteLoading,
    ScrollTop
  },
  methods: {
    // 获取积分流水明细
    onInfinite: function () {
      var self = this
      let promise = axios.get('/api/wap/members/centDetail', {
        offset: self.offset,
        limit: self.limit
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.centInfo = self.centInfo.concat(res.data.data.rows)
            // 处理消费送积分的描述
            self.centInfo.forEach(item => {
              if (item.target && item.target.type === 'CONSUME') {
                item.target.description = JSON.parse(item.target.description)
              }
            })
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.centInfo.length) {
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
