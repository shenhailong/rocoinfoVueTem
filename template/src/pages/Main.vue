<template>
  <div style="height:100%;position:relative;">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
import { routerTransitionMixin } from '@/mixin/router'
import baseInfo from '@/mixin/baseInfo'
export default {
  mixins: [routerTransitionMixin, baseInfo]
}
</script>
