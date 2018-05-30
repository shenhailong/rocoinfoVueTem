<template>
  <div class="wrap wrap-search">
    <!--/.bar-tab-->
    <div class="bar-box-top bar-absolute-top">
      <div class="bar bar-nav _border">
        <a href="javascript:;" @click="routerBackIndex" class="bar-item item-arrow">
          <svg class="svg-arrow _left">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <div class="bar-item">我的收藏</div>
      </div>
      <!--/.bar-nav-->
      <div class="main-tab">
        <nav class="main-tab-links">
          <div @click="changeCollect('commodity')" class="item" :class="{_active:currentType==='commodity'}">
            商品
          </div>
          <div @click="changeCollect('topic')" class="item" :class="{_active:currentType==='topic'}">
            话题
          </div>
        </nav>
      </div>
      <!-- /.main-tab -->
    </div>
    <!-- /.bar-box-top -->
    <div class="content" id="scrollContent">
      <component :is="currentType"></component>
      <!--返回顶部按钮-->
      <div class="float-window">
        <ScrollTop :container="'#scrollContent'"></ScrollTop>
      </div>
      <!-- /.float-window -->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import commodity from './collect/Commodity'
import topic from './collect/Topic'
import ScrollTop from '@/components/ScrollTop'
export default {
  name: 'MineCollect',
  data () {
    return {
      currentType: 'commodity'
    }
  },
  components: {
    commodity,
    topic,
    ScrollTop
  },
  created () {
    this.currentType = this.$route.query.value
  },
  methods: {
    // 切换商品和话题
    changeCollect (title) {
      this.currentType = title
      this.$router.push({
        name: 'MineCollect',
        query: {value: title}
      })
    },
    routerBackIndex () {
      this.$router.push({
        name: 'Index'
      })
    }
  }
}
</script>

