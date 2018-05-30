<template>
  <div class="wrap wrap-center-topics">

    <div class="content" id="scrollContent">
      <div class=""></div>
      <div class="center-header">
        <a href="javascript:history.back();" class="back">
          <svg class="svg-arrow _left">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
          </svg>
        </a>
        <div class="center-header-content">
          <div class="author-avatar">
            <img v-lazy="{src: info.member.profileImage ? info.member.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'}" alt="" class="lazy-img-fadein">
            <svg class="svg-member-circle" v-if="info.member.type === 'OFFICIAL'">
              <use xlink:href="#svg-member-circle" />
            </svg>
            <div class="member-grade" v-if="info.member.type !== 'OFFICIAL' && info.member.level">
              <svg class="svg-member-grade">
                <use xlink:href="#svg-member-grade"></use>
              </svg>
              <span class="num">{{info.member.level.levelNum - 1 }}</span>
            </div>

          </div>
          <div class="item-title">{{info.member.nickname}}</div>
          <div class="item-subtitle">{{info.member.signature}}</div>
          <div class="flex layout-column">
            <a class="item">
              粉丝
              <span class="num">{{info.fansNumbers}}</span>
            </a>
            <a class="item">
              话题
              <span class="num">{{info.topicNumbers}}</span>
            </a>
            <a class="item">
              关注
              <span class="num">{{info.followNumbers}}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="button-column">
        <a href="javascript:;" class="btn-normal btn-sm" :class="{'btn-primary': info.member.addFollow,'_solid': info.member.addFollow}" @click="followStatus(info.member)">{{info.member.addFollow ? '关注' : '取消关注'}}</a>
      </div>
      <div class="space-20"></div>
      <div class="tips-box _pd-sm" v-show="isEmpty">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-topic">icon</i>
          </div>
          <p>还没有发布话题</p>
        </div>

      </div>
      <div class="card card-article" v-for="(items, index) in lists" :key="items.id" v-show="!isEmpty">
        <div class="card-header">
          <div class="author-column">
            <div class="author-avatar">
              <img v-lazy="{src: items.member.profileImage ? items.member.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'}" alt="商品图片" class="lazy-img-fadein">
            </div>
            <div class="item-title">{{items.member.nickname}}</div>
          </div>
          <div class="tag tag-primary" v-show="items.status === 'FEATURED'">精选</div>
        </div>

        <div class="card-body">
          <div class="item-goods">
            <div class="media-column" v-if="!items.videoPath && items.admTopicTags && items.admTopicTags.length >= 3" @click="detail(items.id)">
              <div class="item-media item-media-column1 ">
                <img v-lazy="{src: items.admTopicTags[0] ? items.admTopicTags[0].imagePath : 'static/images/lazyload/690x516.jpg',
                loading: 'static/images/lazyload/690x516.jpg',
                error: 'static/images/lazyload/690x516.jpg'}" alt="商品图片" class="lazy-img-fadein">
              </div>
              <div class="item-media item-media-column2">
                <img v-lazy="{src: items.admTopicTags[1] ? items.admTopicTags[1].imagePath : 'static/images/lazyload/214x162.jpg',
                loading: 'static/images/lazyload/214x162.jpg',
                error: 'static/images/lazyload/214x162.jpg'}" alt="商品图片" class="lazy-img-fadein">
                <img v-lazy="{src: items.admTopicTags[2] ? items.admTopicTags[2].imagePath : 'static/images/lazyload/214x162.jpg',
                loading: 'static/images/lazyload/214x162.jpg',
                error: 'static/images/lazyload/214x162.jpg'}" alt="商品图片" class="lazy-img-fadein">
              </div>
            </div>

            <div class="media-column" v-if="!items.videoPath && items.admTopicTags && items.admTopicTags.length === 2" @click="detail(items.id)">
              <div class="item-media">
                <img v-lazy="{src: items.admTopicTags[0] ? items.admTopicTags[0].imagePath : 'static/images/lazyload/214x162.jpg',
                loading: 'static/images/lazyload/214x162.jpg',
                error: 'static/images/lazyload/214x162.jpg'}" alt="商品图片" class="lazy-img-fadein">
              </div>
              <div class="item-media">
                <img v-lazy="{src: items.admTopicTags[1] ? items.admTopicTags[1].imagePath : 'static/images/lazyload/214x162.jpg',
                loading: 'static/images/lazyload/214x162.jpg',
                error: 'static/images/lazyload/214x162.jpg'}" alt="商品图片" class="lazy-img-fadein">
              </div>
            </div>

            <div class="media-column" v-if="!items.videoPath && items.admTopicTags && items.admTopicTags.length === 1" @click="detail(items.id)">
              <div class="item-media">
                <img v-lazy="{src: items.admTopicTags[0] ? items.admTopicTags[0].imagePath : 'static/images/lazyload/336x252.jpg',
                loading: 'static/images/lazyload/336x252.jpg',
                error: 'static/images/lazyload/336x252.jpg'}" alt="商品图片" class="lazy-img-fadein">
              </div>
            </div>

            <div class="media-column" v-if="items.videoPath" @click="playVideo(index)">
              <div class="item-media">
                <video :src="items.videoPath" :ref="'videoPlayer' + index" x5-playsinline="" playsinline="" :poster="items.videoImage ? items.videoImage : ''" webkit-playsinline="" preload style="width:100%;height: 258px;" controls></video>
              </div>
            </div>
            <div class="item-inner">
              <div class="item-flex-between">
                <div class="item-title" @click="detail(items.id)">
                  {{items.name}}
                </div>
                <span class="tab-icon">
                  <svg class="svg-praise" :class="{'_active': !items.addPraise}" @click="addPraise(items)">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-praise"></use>
                  </svg>
                  <span class="tab-text">{{items.praiseCount}}</span>
                </span>
              </div>
              <div class="item-subtitle _ellipsis2" @click="detail(items.id)">
                {{items.contentText}}
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
    </div>

    <div class="float-window">
      <ScrollTop :container="'#scrollContent'"></ScrollTop>
    </div>

  </div>
</template>

<script>
import ScrollTop from '@/components/ScrollTop'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast } from 'rocoui'
import { communityMixin, followStatus, InfiniteLoadingMixin } from '@/mixin/community'
export default {
  mixins: [communityMixin, followStatus, InfiniteLoadingMixin],
  data() {
    return {
      info: {
        member: {
          level: {}
        }
      },
      url: '/api/wap/topic/home',
      params: {
        offset: 0,
        limit: 10,
        searchTag: 'TOPIC',
        memberId: this.$route.query.id
      }
    }
  },
  components: {
    ScrollTop
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取他人详情数据
    getInfo() {
      let promise = axios.get(`/api/wap/forum/home?memberId=` + this.$route.query.id).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.info = res.data.data
        }
      })
      Toast.loading('正在加载...', promise)
    }
  }
}
</script>
