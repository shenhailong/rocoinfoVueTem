<template>
  <!-- 专家服务 -->
  <div class="list-user">
    <div class=" item-goods item-horizontal">
      <div class="author-column flex-align-start">
        <div class="author-avatar">
          <img src="static/images/icon-check.png" alt="avatar">
        </div>
      </div>
      <!-- /.author -->
      <div class="item-inner">
        <div class="item-title _ellipsis">专家服务有求必应</div>
        <div class="item-subtitle _ellipsis">
          一对一解决您精油使用方面的难题
        </div>
        <!-- /.title -->
      </div>
      <!-- /.item-inner -->
      <div class="item-align-center">
        <a href="javascript:;" @click="callExpert"
          class="btn-normal btn-primary btn-sm _solid">call专家</a>
      </div>
    </div>
    <!--/.item-goods 水平摆放商品-->
  </div>
  <!-- /.list-user -->
</template>

<script>
import { Modal } from 'rocoui'
export default {
  methods: {
    // 专家服务
    callExpert () {
      Modal.confirm({
        title: '专家服务',
        okText: '拨打',
        cancelText: '取消',
        body: '<b>400-800-8008</b>',
        okCb: function(){
          // window.location.href = 'tel:123456789'
        }
      })
    }
  }
}
</script>
