<template>
  <div class="wrap wrap-logistics-info">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">物流信息</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <div  v-if="$route.query.total > 1" class="content-block-title _border">
        <div class="tag tag-primary">包裹{{ Math.floor($route.query.index) + 1 }}</div>
      </div>
      <!-- /.content-block-title -->
      <div class="logistics-info">
        <div class="item">物流公司：{{ logistics.expressType }}</div>
        <div class="item">快递单号：{{ logistics.expressNo }}</div>
      </div>
      <div class="space-20"></div>
      <div class="steps-column">
        <div v-for="(item, index) in logistics.expressFlows" :key="index"
          class="item" :class="{'_current': !index}">
          <div class="steps-time">
            <p>{{ item.flowTime }}</p>
          </div>
          <div class="steps-icon">
            <div class="svg-wrap">
              <svg class="svg-check">
                <use xlink:href="#svg-check" />
              </svg>
            </div>
          </div>
          <div class="steps-text">{{ item.flowInfo }}</div>
        </div>
      </div>
      <!-- /.steps-column -->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import store from '@/configs/store'
export default {
  mixins: [routerMixin],
  data () {
    return {
      logistics: {}
    }
  },
  mounted () {
    this.logistics = store.get('logisticsInfo')
  }
}
</script>

