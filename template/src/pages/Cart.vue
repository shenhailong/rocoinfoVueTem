<template>
  <div id="app" style="height:100%;position:relative;">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
import {routerTransitionMixin} from '@/mixin/router'
export default {
  mixins: [routerTransitionMixin]
}
</script>

