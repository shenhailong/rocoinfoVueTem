<template>
  <div>
    <div class="content">
      <h2>关于IE</h2>
      <div style="width:50%;margin:50px auto;">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MineAbout',
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

