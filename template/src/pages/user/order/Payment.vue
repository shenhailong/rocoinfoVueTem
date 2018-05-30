<template>
  <component :is="currentView"></component>
</template>

<script>
import Success from '@/pages/order/Success'
import Failure from '@/pages/order/Failure'
export default {
  name: 'MineOrderPayment',
  components: {
    Success,
    Failure
  },
  computed: {
    currentView () {
      return this.$route.params.res
    }
  },
  created () {
    sessionStorage.setItem('curHasPaiedId', this.$route.query.orderId)
  }
}
</script>
