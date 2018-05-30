<template>
  <div>
    <div class="list-product list-column2" v-if="!isEmpty">
      <div class="item-goods" v-for="(items) in lists" :key="items.id" @click="goDetail(items)">
        <div class="item-media">
          <img v-lazy="{
            src: items.imgPath ? items.imgPath : 'static/images/lazyload/348x348.jpg',
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
        </div>
        <div class="item-inner">
          <div class="item-title _ellipsis2">{{items.name}}</div>
          <div class="item-subtitle _ellipsis">
            {{items.subtitle}}&ensp;
          </div>
          <div class="price-area">
            <div class="item-price" v-if="items.type === activityType.TIME_LIMITED.value">
              <em>¥</em>{{items.activityPrice}}
            </div>
            <div class="item-price" v-else>
              <em>¥</em>{{items.salePrice}}
            </div>
            <div class="item-price-original" v-if="items.type === activityType.TIME_LIMITED.value">
              <em>¥</em>{{items.salePrice}}
            </div>

          </div>
        </div>
      </div>
    </div>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
      <span slot="no-results" style="display:none;"></span>
      <div class="tips-txt" slot="no-more">
        <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
      </div>
    </infinite-loading>
    <div class="tips-box" v-show="isEmpty">
      <div class="tips-no-result">
        <div class="icon-area">
          <i class="icon icon-no-result">icon</i>
        </div>
        <p>很抱歉，没有找到</p>
        <p>“{{keyword}}”的相关商品</p>
      </div>
    </div>

    <section class="waterfal-flow list-hobby" v-if="isEmpty">
      <aside class="item aside-1">
        <div class="list-banner">
          <img src="static/images/img-hobby.jpg" alt="猜你喜欢">
        </div>
        <div class="item-goods" v-for="(items) in likeListLeft" :key="items.id" @click="goDetail(items)">
          <div class="item-media">
            <img v-lazy="{
            src: items.imgPath ? items.imgPath : 'static/images/lazyload/348x348.jpg',
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis2">{{items.name}}</div>
            <div class="item-subtitle _ellipsis">
              {{items.subtitle}}&ensp;
            </div>
            <div class="price-area">
              <div class="item-price" v-if="items.type === activityType.TIME_LIMITED.value">
                <em>¥</em>{{items.activityPrice}}
              </div>
              <div class="item-price" v-else>
                <em>¥</em>{{items.salePrice}}
              </div>
              <div class="item-price-original" v-if="items.type === activityType.TIME_LIMITED.value">
                <em>¥</em>{{items.salePrice}}
              </div>

            </div>
          </div>
        </div>
      </aside>

      <aside class="item aside-2">
        <div class="item-goods" v-for="(items) in likeListRight" :key="items.id" @click="goDetail(items)">
          <div class="item-media">
            <img v-lazy="{
            src: items.imgPath ? items.imgPath : 'static/images/lazyload/348x348.jpg',
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis2">{{items.name}}</div>
            <div class="item-subtitle _ellipsis">
              {{items.subtitle}}&ensp;
            </div>
            <div class="price-area">
              <div class="item-price" v-if="items.type === activityType.TIME_LIMITED.value">
                <em>¥</em>{{items.activityPrice}}
              </div>
              <div class="item-price" v-else>
                <em>¥</em>{{items.salePrice}}
              </div>
              <div class="item-price-original" v-if="items.type === activityType.TIME_LIMITED.value">
                <em>¥</em>{{items.salePrice}}
              </div>

            </div>
          </div>
        </div>
        <a href="javascript:;" class="btn-normal btn-more" @click="goList">
          查看更多
          <svg class="svg-arrow">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
      </aside>
    </section>
    <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片" v-show="isEmpty">

  </div>
</template>

<script type="text/ecmascript-6">
import InfiniteLoading from 'vue-infinite-loading'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast } from 'rocoui'
import * as activityType from '@/constants/activityType'
export default {
  props: {
    keyword: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      activityType,
      lists: [],
      offset: 0,
      limit: 10,
      isEmpty: false,
      total: 0,
      likeListLeft: [], // 猜你喜欢左侧
      likeListRight: [] // 猜你喜欢右侧
    }
  },
  created() {

  },
  components: {
    InfiniteLoading
  },
  methods: {
    // 跳转详情页
    goDetail(items) {
      let type = items.activityType === 'QUANTITY_LIMITED' ? 'CART' : items.activityType
      this.$router.push({
        name: 'ProductDetail',
        params: { pid: items.productId },
        query: { skuId: items.id, activityId: items.activityId, placeOrderType: type }
      })
    },
    // 获取猜你喜欢
    getLike() {
      let self = this
      let promise = axios.get('/api/wap/product/like?limit=5').then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          self.likeListRight = res.data.data.rows.filter((item, index) => index % 2 === 0)
          self.likeListLeft = res.data.data.rows.filter((item, index) => index % 2 === 1)
        }
      })
      Toast.loading('正在加载...', promise)
    },
    onInfinite: function () {
      var self = this
      axios.get('/api/wap/product/list', {
        params: {
          offset: self.offset,
          limit: self.limit,
          keyword: self.keyword
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
            if (self.likeListLeft.length === 0) {
              this.getLike()
            }
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
      if(this.lists.length === 0){
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      }
    },
    // 去猜你喜欢列表
    goList() {
      this.$router.push({ path: `/main/search/searchResult/commonList?title=猜你喜欢&from=like` })
      // this.$router.push({ path: `/search/searchResult/commonList?title=新品速递&from=new` })
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

