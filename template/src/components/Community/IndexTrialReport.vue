<template>
  <div>
    <div class="card card-article" v-for="(items, index) in lists" :key="items.id" v-show="!isEmpty">
      <div class="card-header">
        <div class="author-column" @click="personal(items.member.id)">
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
              <div class="item-title _ellipsis2" @click="detail(items.id)">
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
    <div class="tips-box" v-show="isEmpty">
      <div class="tips-no-result">
        <div class="icon-area">
          <i class="icon icon-no-result">icon</i>
        </div>
        <p>很抱歉，没有找到</p>
        <p>相关话题</p>
      </div>
    </div>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
      <span slot="no-results" style="display:none;"></span>
      <div class="tips-txt" slot="no-more">
        <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片" v-if="lists.length >= 4">
      </div>
    </infinite-loading>
  </div>
</template>
<script>
import { communityMixin, InfiniteLoadingMixin } from '@/mixin/community'
export default {
  mixins: [communityMixin, InfiniteLoadingMixin],
  data() {
    return {
      url: '/api/wap/topic',
      params: {
        offset: 0,
        limit: 10,
        searchTag: 'REPORT'
      }
    }
  }
}
</script>
