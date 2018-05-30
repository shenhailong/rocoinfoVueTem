<template>
  <div class="wrap wrap-product-evaluation">
    <div class="bar bar-nav _border bar-absolute-top">
      <a @click="routerBack" href="javascript:;" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">商品口碑</div>
    </div>
    <div class="content">
      <div class="list-evaluation">
        <div v-for="eva in lists" :key="eva.id" class="item-goods">
          <div class="author-column flex-between">
            <div class="item-left">
              <div class="author-avatar">
                <img :src="eva.header" alt="avatar">
              </div>
              <div class="item-title">{{eva.name}}</div>
            </div>
            <div class="text">{{eva.evaluateTime|eva-time-filter}}</div>
          </div>
          <!-- /.author -->
          <div class="item-text">
            {{eva.content}}
          </div>
          <div v-if="eva.imgs" class="media-multiple">
            <div class="item-media">
              <div v-for="(img, $index) in eva.imgs" :key="img.path" @click.stop="imgClickHandler(eva.imgs, $index)" class="img">
                <img :src="img.path">
              </div>

            </div>
          </div>
          <!-- 回复在图片下面 -->
          <div v-if="eva.replyContent" class="item-reply">
            In Essence回复：{{eva.replyContent}}
          </div>
        </div>
      </div>
      <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
        <span slot="no-results" style="display:none;"></span>
        <div class="tips-txt" slot="no-more">
          <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
        </div>
      </infinite-loading>
    </div>
  </div>
</template>
<script>
// import ScrollTop from '@/components/ScrollTop'
import { Toast } from 'rocoui'
import InfiniteLoading from 'vue-infinite-loading'
import routerMixin from '@/mixin/router'
import createSwiperDialog from '@/components/SwiperDialog'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import moment from 'moment'
export default {
  mixins: [routerMixin],
  components: {
    InfiniteLoading
  },
  data() {
    return {
      lists: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false
    }
  },
  filters: {
    'eva-time-filter'(value) {
      return moment(value).format('YYYY.MM.DD HH.mm')
    }
  },
  created() {},
  methods: {
    onInfinite: function() {
      var self = this
      axios
        .get(`/api/wap/product/evaluate/${this.$route.params.skuId}`, {
          params: {
            offset: self.offset,
            limit: self.limit
          }
        })
        .then((res) => {
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
            Toast.fail(res.data.message)
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
    },
    imgClickHandler(imgs, index) {
      createSwiperDialog({ imgs, initialSlide: index })
    }
  }
}
</script>
