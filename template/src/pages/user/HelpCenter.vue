<template>
  <div class="wrap wrap-help">
    <div class="bar bar-button bar-absolute-bottom _pd flex-wrap">
       <div class="text">在线客服请至公众号首页</div>
      <button class="btn-normal btn-primary _solid btn-xxl">电话客服（9:00-18:00）</button>
    </div>
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">客服与帮助</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <div class="list-help">
        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题一
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题二
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题三
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题四
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
      </div>
      <div class="space-20"></div>
      <div class="list-help">
        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题五
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题六
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题七
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题八
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题九
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>

        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题十
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>

        <a href="javascript:;" class="input-cloumn flex-between">
          <div class="item-label">
            问题十一
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
      </div>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
export default {
  mixins: [routerMixin],
  name: 'MineHelpCenter',
  methods: {
    // 路由跳转
    goRouter (name) {
      this.$router.push({
        // name: 'MineOrder' + name
      })
    }
  }
}
</script>

