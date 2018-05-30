<template>
  <component :is="currentView" :typeName="types[routeParams.type].text" />
</template>

<script>
import * as ACTIVITY_TYPES from '@/constants/activityType'
import TIME_LIMITED from './activity/TimeLimited'              // 限时购
import QUANTITY_LIMITED from './activity/QuantityLimited'      // 限量试用
import Activities from './activity/Activities'                 // 其他活动
import {routerTransitionMixin} from '@/mixin/router'
export default {
  mixins: [routerTransitionMixin],
  data() {
    return {
      types: ACTIVITY_TYPES,
      routeParams: {},
      currentView: ''
    }
  },
  components: {
    TIME_LIMITED,
    QUANTITY_LIMITED,
    Activities
  },
  created () {
    // 通过路由参数判断当前的活动类型
    this.getCurrentType()
  },
  methods: {
    // 通过路由参数判断当前的活动类型
    getCurrentType () {
      this.routeParams = this.$route.params
      switch (this.routeParams.type) {
        case 'TIME_LIMITED':
          this.currentView = 'TIME_LIMITED'
          break
        case 'QUANTITY_LIMITED':
          this.currentView = 'QUANTITY_LIMITED'
          break
        default:
          this.currentView = 'Activities'
          break
      }
    }
  }
}
</script>
