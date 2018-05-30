<template>
  <div class="wrap wrap-details-community">
    <div class=" bar-comment bar bar-tool bar-tool-horizontal bar-absolute-bottom">
      <div>
        <a href="javascript:;" class="bar-item" @click="addPraise(info)">
          <span class="tab-icon">
            <svg class="svg-praise" :class="{_active: !info.addPraise}">
              <use xlink:href="#svg-praise" />
            </svg>
            <span class="tab-text">{{info.praiseCount}}</span>
          </span>
        </a>
        <a href="javascript:;" class="bar-item" @click="collectStatus(info)">
          <span class="tab-icon">
            <svg class="svg-heart" :class="{_active: !info.addCollect}">
              <use xlink:href="#svg-heart" />
            </svg>
            <span class="tab-text">{{info.collectCount}}</span>
          </span>
        </a>
      </div>
      <a href="javascript:;" class="bar-item " @click="reply0">
        <span class="tab-icon">
          <svg class="svg-comment">
            <use xlink:href="#svg-comment" />
          </svg>
          <span class="tab-text">写评论</span>
        </span>
      </a>
    </div>

    <div class="content content-details">
      <a href="javascript:history.back();" class="back">
        <svg class="svg-arrow _left">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
        </svg>
      </a>
      <div class="swiper-container swiper-container-details" ref="labelSwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-if="info.videoPath" @click="playVideo()">
            <video :src="info.videoPath" ref="videoPlayer" x5-playsinline="" playsinline="" :poster="info.videoImage ? info.videoImage : ''" webkit-playsinline="" preload style="width:100%;height: 258px;" controls></video>
          </div>
          <div class="swiper-slide" v-for="items in info.admTopicTags" :key="items.id" v-else>
            <img :src="items.imagePath" alt="详情图">
            <label-canvas :effect="items.effect" :name="items.name" :isEdit="isEdit" v-if="items.name"></label-canvas>
          </div>
        </div>

        <div class="pagination"></div>
      </div>
      <div class="space-88" v-show="!info.videoPath && info.admTopicTags.length === 0"></div>
      <div class="details-box">
        <div class="author-column-box">
          <div class="author-column">
            <div class="author-avatar" @click="personal(info.member.id)">
              <img v-lazy="{src: info.member.profileImage ? info.member.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'}" alt="图片" class="lazy-img-fadein">
              <svg class="svg-member-circle" v-if="info.type === 'OFFICIAL'">
                <use xlink:href="#svg-member-circle" />
              </svg>
              <div class="member-grade" v-if="info.type !== 'OFFICIAL' && info.member.level">
                <svg class="svg-member-grade">
                  <use xlink:href="#svg-member-grade"></use>
                </svg>
                <span class="num">{{info.member.level.levelNum - 1}}</span>
              </div>
            </div>
            <div class="item-inner">
              <div class="item-title _ellipsis">{{info.member.nickname}}</div>
              <div class="item-subtitle">{{info.publishTime}}</div>
            </div>
          </div>
          <div v-show="loggedUserId !== info.member.id">
            <a href="javscript:;" class="btn-normal btn-primary btn-sm" @click="followStatus(info.member)">{{info.member.addFollow ? '关注' : '取消关注'}}</a>
          </div>
        </div>

        <div class="article-content">
          <div class="article-title-column">
            <div class="item-title _ellipsis2">{{info.name}}</div>
            <div class="tag tag-primary" v-show="info.status === 'FEATURED'">精选</div>
          </div>

          <div class="word-wrap" v-html="info.contentHtml" v-if="info.contentHtml"> </div>
          <div class="word-wrap" v-html="info.contentText" v-else> </div>
        </div>

      </div>

      <div class="card card-related mb-20" v-if="info.sku">
        <div class="card-header">
          相关商品
        </div>
        <div class="card-body">
          <div class=" item-goods item-horizontal">
            <div class="item-media">
              <img :src="info.sku.product.productImagePath">
            </div>
            <div class="item-inner">
              <div class="item-title _ellipsis">{{info.sku.name}}</div>
              <div class="item-subtitle _ellipsis">
                {{info.sku.product.subtitle}}
              </div>

              <div class="item-flex-between item-bottom">
                <div class="price-area">
                  <div class="item-price size-lg">
                    <em>¥</em>{{info.sku.salePrice}}</div>
                </div>
                <a href="javascript:;" class="btn-normal _solid btn-sm" :class="info.skuValid ? 'btn-primary' : 'btn-disabled'" @click="productDetail">{{info.skuValid ? '去购买' : '已下架'}}</a>
              </div>
            </div>

          </div>

        </div>
      </div>
      <div class="list-evaluation">
        <div class="content-block-title _border">
          <div class="text">
            评论
          </div>
          <a href="javascript:;" class="links" @click="reply0">
            <span class="text">共{{comments.total}}条评论</span>
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>

        <div class="item-goods" v-for="items in comments.rows" :key="items.id" v-if="comments.total > 0">
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
                <span @click="reply2(items, item)">{{item.sender.nickname}}</span> 回复{{item.receiver.nickname}}： {{item.text}}
              </p>
            </div>
          </div>

        </div>
        <div class="item-goods" v-if="comments.total == 0" style="text-align: center;padding:20px;font-size: 12px">还没有评论，还不快来抢沙发！</div>
      </div>
    </div>

  </div>
</template>

<script>
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast } from 'rocoui'
import Swiper from 'Swiper'
import labelCanvas from '@/components/Community/Canvas'
import { communityMixin, followStatus } from '@/mixin/community'
export default {
  mixins: [communityMixin, followStatus],
  data() {
    return {
      info: {
        admTopicTags: [],
        collectionNum: 9, // 收藏数量
        collectStatus: false, // 帖子被收藏的状态
        fabulousStatus: false, // 点赞状态
        fabulousNum: 20, // 点赞数量
        label: [],
        member: {},
        sku: {
          product: {}
        }
      },
      comments: {
        rows: [],
        total: 0
      },
      isEdit: false // 不是编辑，详情不现实X
    }
  },
  components: {
    'label-canvas': labelCanvas
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取详情数据
    getInfo() {
      let promise = axios.get(`/api/wap/topic/${this.$route.query.id}/get`).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.info = res.data.data.topic
          if (!res.data.data.topic) {
            Toast.info('该话题已经删除')
            setTimeout(() => {
              this.$router.back()
            }, 2000)
          }
          this.comments = res.data.data.comments
          this.initSwiper()
        } else {
          setTimeout(() => {
            this.$router.back()
          }, 2000)
        }
      })
      Toast.loading('正在加载...', promise)
    },
    initSwiper() {
      let self = this
      this.$nextTick(() => {
        this.labelSwiper = new Swiper(this.$refs.labelSwiper, {
          pagination: '.pagination',
          paginationType: 'fraction',
          lazyLoading: true,
          lazyLoadingOnTransitionStart: true,
          lazyLoadingInPrevNext: true,
          lazyLoadingInPrevNextAmount: 2,
          onSlideChangeEnd: function (swiper) {
            self.swiperIndex = swiper.activeIndex
          },
          paginationFractionRender: function (swiper, currentClassName, totalClassName) {
            return '<span class="' + currentClassName + '"></span>' + '/' + '<span class="' + totalClassName + '"></span>'
          }
        })
      })
    },
    // 收藏状态
    collectStatus(items) {
      // addCollect true是可以收藏
      if (!this.onOff) {
        return false
      }
      this.onOff = false
      axios.get(`/api/wap/topic/${items.id}/${items.addCollect ? 'addColl' : 'delColl'}`).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          items.collectCount = items.addCollect ? items.collectCount + 1 : items.collectCount - 1
          items.addCollect = !items.addCollect
          this.onOff = true
        } else {
          this.onOff = true
        }
      })
    },
    playVideo() {
      this.$refs.videoPlayer.play()
    },
    // 一层回复
    reply1(items) {
      let receiverType = 'MEMBER'
      if (this.info.member.type === 'OFFICIAL') {
        receiverType = 'ADMIN'
      }
      this.$router.push({ path: `/Index/topicDetail/comment?topicId=${this.info.id}&parentCommentId=${items.id}&prevCommentId=${items.id}&receiverId=${items.sender.id}&receiverType=${items.senderType}&level=${2}&placeholder=${'回复' + items.sender.nickname}&topicReceiverType=${receiverType}&topicReceiverId=${this.info.member.id}` })
    },
    // 一层回复
    reply2(items, item) {
      let receiverType = 'MEMBER'
      if (this.info.member.type === 'OFFICIAL') {
        receiverType = 'ADMIN'
      }
      this.$router.push({ path: `/Index/topicDetail/comment?topicId=${this.info.id}&parentCommentId=${items.id}&prevCommentId=${item.id}&receiverId=${item.sender.id}&receiverType=${item.senderType}&level=${2}&placeholder=${'回复' + item.sender.nickname}&topicReceiverType=${receiverType}&topicReceiverId=${this.info.member.id}` })
    },
    // 0层回复直接回复话题
    reply0() {
      let receiverType = 'MEMBER'
      if (this.info.member.type === 'OFFICIAL') {
        receiverType = 'ADMIN'
      }
      this.$router.push({ path: `/Index/topicDetail/comment?topicId=${this.info.id}&parentCommentId=${0}&prevCommentId=${0}&receiverId=${this.info.member.id}&receiverType=${receiverType}&level=${1}&placeholder=${'说出你的想法'}&topicReceiverType=${receiverType}&topicReceiverId=${this.info.member.id}` })
    },
    productDetail() {
      if (!this.info.skuValid) {
        return
      }
      // let type = this.info.sku.activityType === 'QUANTITY_LIMITED' ? 'CART' : this.info.sku.activityType
      window.location.href = `index.html#/product/${this.info.sku.product.id}?skuId=${this.info.sku.id}&placeOrderType=CART`
    }
  }
}
</script>
