<template>
  <div>
    <!-- banner有数据 -->
    <BannerSwiper :banners="banners" v-if="banners&&banners.length" />
    <div class="brand-mark">
      <div class="item">
        <i class="icon icon-brand-mark-1"></i>
        <span>澳洲进口</span>
      </div>
      <div class="item">
        <i class="icon icon-brand-mark-2"></i>
        <span>100%纯精油</span>
      </div>
      <div class="item">
        <i class="icon icon-brand-mark-3"></i>
        <span>TGA认证</span>
      </div>
    </div>
    <!-- /.brank-mark -->
    <!-- 限时购 -->
    <!-- 限时购有数据,且有活动商品 -->
    <div class="group-show" v-if="limitedActivity&&limitedActivity.timeLimitedActivity&&limitedActivity.timeLimitedActivity.actSkuDtoList&&limitedActivity.timeLimitedActivity.actSkuDtoList.length">
      <div class="group-title">
        <span class="text">限时优惠</span>
      </div>
      <div class="time-countdown">
        <span class="text">距离活动结束</span>
        <em class="num">{{runTime.fullH}}</em>
        <span class="text">时</span>
        <em class="num">{{runTime.m}}</em>
        <span class="text">分</span>
        <em class="num">{{runTime.s}}</em>
        <span class="text">秒</span>
      </div>
      <!-- 限时购swiper -->
      <TimeLimitedSwiper :timeLimited="limitedActivity.timeLimitedActivity" />
    </div>
    <!-- /.group-show -->
    <!-- 人气爆款,有人气爆款商品 -->
    <div class="group-show group-hot" v-if="recommend&&recommend.faddishProducts&&recommend.faddishProducts.length">
      <div class="group-title">
        <span class="text">甄选商品人气爆款</span>
      </div>
      <!-- /.group-title -->
      <div class=" item-goods item-horizontal" v-for="(item,index) in recommend.faddishProducts" :key="index" :class="{ '_img-right':index%2===0}" @click="$_goDetail(item)">
        <!-- index偶数,文字信息在左 -->
        <div class="item-inner" v-if="index%2===0">
          <div class="item-slogan _ellipsis2">{{item.promotion||'买精油到 IN ESSENCE'}}</div>
          <div class="item-title _ellipsis">{{item.name}}</div>
          <div class="item-subtitle _ellipsis">{{item.subtitle}}&ensp;</div>
          <div class="item-price size-lg">
            <em>¥</em>{{item.salePrice}}</div>
        </div>
        <div class="item-media">
          <img v-lazy="{
            src: item.imgPath,
            loading: 'static/images/lazyload/324x324.jpg',
            error: 'static/images/lazyload/324x324.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
          <div class="tag">热销推荐</div>
        </div>
        <!-- index奇数,文字信息在右 -->
        <div class="item-inner" v-if="index%2===1">
          <div class="item-slogan _ellipsis2">{{item.promotion||'买精油到 IN ESSENCE'}}</div>
          <div class="item-title _ellipsis">{{item.name}}</div>
          <div class="item-subtitle _ellipsis">{{item.subtitle}}&ensp;</div>
          <div class="item-price size-lg">
            <em>¥</em>{{item.salePrice}}</div>
        </div>
      </div>
    </div>
    <!-- /.group-show -->
    <!-- 限量试用,有限量试用信息显示 -->
    <div class="group-show group-probation" v-if="limitedActivity&&limitedActivity.quantityLimitedActivity">
      <div class="group-title">
        <span class="text">限量试用</span>
      </div>
      <!-- /.group-title -->
      <div class="probation-wrap" @click="goActivity">
        <!-- <div class="item-goods">
          <div class="item-inner">
            <div class="item-title _ellipsis">澳洲本土系列薰衣草单方精油 25ML</div>
            <div class="line"></div>
            <div class="_ellipsis">
              <span class="item-subtitle">
                澳洲限量特供商品
              </span>
              <span class="item-subtitle">
                提交试用报告可享半价
              </span>
            </div>
            <div class="price-area flex-center">
              <sapn class="item-price size-lg">
                <em>¥</em>118</sapn>
            </div>
            <div class="text-center">
              <a href="javascript:;" class="btn-normal btn-primary _solid btn-xxs">立即试用</a>
            </div>
          </div>
        </div> -->
        <!--/.item-goods-->
        <img :src="limitedActivity.quantityLimitedActivity.coverImgPath" />
      </div>
    </div>
    <!-- /.group-show -->
    <!-- 猜你喜欢 -->
    <section class="waterfal-flow list-hobby" v-if="likeShow.show">
      <aside class="item aside-1">
        <div class="list-banner" @click="likeAndNew('猜你喜欢','like')">
          <img src="static/images/img-hobby.jpg" alt="猜你喜欢">
        </div>
        <div class="item-goods" v-for="(item,index) in likeLeft" :key="index" @click="$_goDetail(item)">
          <div class="item-media">
            <img v-lazy="{
            src: item.imgPath,
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis2">{{item.name}}</div>
            <div class="item-subtitle _ellipsis">{{item.subtitle}}&ensp;</div>
            <div class="price-area">
              <div class="item-price">
                <!-- 优先显示活动价 -->
                <em>¥</em>{{item.activityPrice||item.salePrice}}</div>
              <!-- 售价活动价都存在显示 -->
              <div class="item-price-original" v-show="item.activityPrice&&item.salePrice">
                <em>¥</em>{{item.salePrice}}</div>
              <span class="tag tag-sm tag-primary" v-show="item.typeName">{{item.typeName}}</span>
            </div>
          </div>
        </div>
      </aside>
      <aside class="item aside-2">
        <div class="item-goods" v-for="(item,index) in likeRight" :key="index" @click="$_goDetail(item)">
          <div class="item-media">
            <img v-lazy="{
            src: item.imgPath,
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis2">{{item.name}}</div>
            <div class="item-subtitle _ellipsis">{{item.subtitle}}&ensp;</div>
            <div class="price-area">
              <div class="item-price">
                <em>¥</em>{{item.activityPrice||item.salePrice}}</div>
              <div class="item-price-original" v-show="item.activityPrice&&item.salePrice">
                <em>¥</em>{{item.salePrice}}</div>
              <span class="tag tag-sm tag-primary" v-show="item.typeName">{{item.typeName}}</span>
            </div>
          </div>
        </div>
        <a href="javascript:;" class="btn-normal btn-more" v-show="likeShow.more" @click="likeAndNew('猜你喜欢','like')">
          查看更多
          <svg class="svg-arrow">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
      </aside>
    </section>
    <!--/.waterfal-flow-->
    <!-- 新品速递 -->
    <section class="waterfal-flow list-hobby" v-if="newShow.show">
      <aside class="item aside-1">
        <div class="list-banner" @click="likeAndNew('新品速递','new')">
          <img src="static/images/img-new-express.jpg" alt="新品速递">
        </div>
        <div class="item-goods" v-for="(item,index) in newProductsLeft" :key="index" @click="$_goDetail(item)">
          <div class="item-media">
            <img v-lazy="{
            src: item.imgPath,
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis2">{{item.name}}</div>
            <div class="item-subtitle _ellipsis">{{item.subtitle}}&ensp;</div>
            <div class="price-area">
              <div class="item-price">
                <em>¥</em>{{item.activityPrice||item.salePrice}}</div>
              <div class="item-price-original" v-show="item.activityPrice&&item.salePrice">
                <em>¥</em>{{item.salePrice}}</div>
              <span class="tag tag-sm tag-primary" v-show="item.typeName">{{item.typeName}}</span>
            </div>
          </div>
        </div>
      </aside>
      <aside class="item aside-2">
        <div class="item-goods" v-for="(item,index) in newProductsRight" :key="index" @click="$_goDetail(item)">
          <div class="item-media">
            <img v-lazy="{
            src: item.imgPath,
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis2">{{item.name}}</div>
            <div class="item-subtitle _ellipsis">{{item.subtitle}}&ensp;</div>
            <div class="price-area">
              <div class="item-price">
                <em>¥</em>{{item.activityPrice||item.salePrice}}</div>
              <div class="item-price-original" v-show="item.activityPrice&&item.salePrice">
                <em>¥</em>{{item.salePrice}}</div>
              <span class="tag tag-sm tag-primary" v-show="item.typeName">{{item.typeName}}</span>
            </div>
          </div>
        </div>
        <a href="javascript:;" class="btn-normal btn-more" v-show="newShow.more" @click="likeAndNew('新品速递','new')">
          查看更多
          <svg class="svg-arrow">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
      </aside>
    </section>
    <!--/.waterfal-flow-->
    <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
  </div>
  <!-- /.content -->
</template>
<script>
import BannerSwiper from './subpage/BannerSwiper'
import TimeLimitedSwiper from './subpage/TimeLimitedSwiper'
import productDetail from '@/mixin/productDetail'
import runTime from '@/mixin/runTime'
import { QUANTITY_LIMITED } from '@/constants/activityType'
import moment from 'moment'
export default {
  mixins: [productDetail, runTime],
  props: {
    banners: {
      type: Array,
      default: function() {
        return []
      }
    },
    limitedActivity: {// 限时购 限量试用
      type: Object,
      default: function() {
        return {
          timeLimitedActivity: { endTime: 0 },
          quantityLimitedActivity: null
        }
      }
    },
    recommend: {// 推荐系列
      type: Object,
      default: function() {
        return {
          like: [], // 猜你喜欢
          newProducts: [], // 新品速递
          faddishProducts: [] // 人气爆款
        }
      }
    },
    runTimeLimit: {
      type: Boolean
    }
  },
  computed: {
    likeShow() {
      let data = this.recommend.like || []
      return {
        // 有数据显示
        show: data.length > 0,
        // 大于4个显示更多
        more: data.length > 4
      }
    },
    newShow() {
      let data = this.recommend.newProducts || []
      return {
        // 有数据显示
        show: data.length > 0,
        // 大于4个显示更多
        more: data.length > 4
      }
    },
    // 猜你喜欢左侧
    likeLeft() {
      if (this.recommend.like && this.recommend.like.length) {
        return this.recommend.like.filter((item, index) => index % 2)
      } else {
        return []
      }
    },
    // 猜你喜欢右侧
    likeRight() {
      if (this.recommend.like && this.recommend.like.length) {
        return this.recommend.like.filter((item, index) => !(index % 2))
      } else {
        return []
      }
    },
    // 新品速递左侧
    newProductsLeft() {
      if (this.recommend.newProducts && this.recommend.newProducts.length) {
        return this.recommend.newProducts.filter((item, index) => index % 2)
      } else {
        return []
      }
    },
    // 新品速递右侧
    newProductsRight() {
      if (this.recommend.newProducts && this.recommend.newProducts.length) {
        return this.recommend.newProducts.filter((item, index) => !(index % 2))
      } else {
        return []
      }
    },
    // 倒计时结束时间戳
    endTime() {
      if (this.limitedActivity.timeLimitedActivity && this.limitedActivity.timeLimitedActivity.endTime) {
        return +moment(this.limitedActivity.timeLimitedActivity.endTime)
      } else {
        clearInterval(this.runTime)
        return 0
      }
    }
  },
  created() {
    // 是否进行倒计时
    this.running = this.runTimeLimit
  },
  methods: {
    // 猜你喜欢或者新品速递列表
    likeAndNew(title, from) {
      this.$router.push({
        path: '/main/commonList',
        query: { title, from }
      })
    },
    // 限量试用列表
    goActivity() {
      this.$router.push({
        path: '/activity/' + QUANTITY_LIMITED.value + '/' + this.limitedActivity.quantityLimitedActivity.id
      })
    }
  },
  components: {
    BannerSwiper,
    TimeLimitedSwiper
  }
}
</script>
