<template>
  <div>
    <div class="tips-box" v-show="pageData.noGoods">
      <div class="tips-no-result">
        <div class="icon-area">
          <i class="icon icon-no-result">icon</i>
        </div>
        <p>很抱歉，没有找到<br/>相关内容</p>
      </div>
      <!-- /.tips-no-result -->
    </div>
    <!-- /.tips-box -->
    <div class="list-product list-column2">
      <div class="item-goods" v-for="(item,index) in pageData.goods" :key="index" @click="$_goDetail(item)">
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
              <!-- 活动价和售价都存在 -->
            <div class="item-price-original" v-show="item.activityPrice&&item.salePrice">
              <em>¥</em>{{item.salePrice}}</div>
            <span class="tag tag-sm tag-primary" v-show="item.typeName">{{item.typeName}}</span>
          </div>
        </div>
      </div>
      <!--/.item-goods 商品-->
    </div>
  </div>
</template>
<script>
import productDetail from '@/mixin/productDetail'
export default {
  mixins: [productDetail],
  props: {
    pageData: {
      type: Object,
      default: function() {
        return {
          goods: [],
          noGoods: false
        }
      }
    }
  }
}
</script>
