<template>
  <component :is="currentView" />
</template>

<script>
import Equities from './equities/List'
export default {
  name: 'VipEquities',
  data() {
    return {
      currentView: ''
    }
  },
  components: {
    Equities
  },
  created () {
    this.currentView = 'Equities'
  }
}
</script>
