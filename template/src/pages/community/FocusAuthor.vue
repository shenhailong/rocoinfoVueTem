<template>
  <div class="wrap wrap-start-pages wrap-focus-author">
    <!-- 按钮不可用状态请替换[ btn-primary ]为[ btn-disabled ] -->
    <div class="bar bar-button bar-absolute-bottom _pd-sm border-top">
      <button class="btn-normal btn-primary _solid btn-xxl" @click="goCommunity">进入社群</button>
    </div>

    <div class="content">
      <h1 class="content-title">关注你可能感兴趣的人</h1>
      <h2 class="content-subtitle">关注后可以看他们发布的精彩内容</h2>
      <div class="list-user">

        <div class=" item-goods item-horizontal" v-for="items in peopleLists" :key="items.id">
          <div class="author-column">
            <div class="author-avatar">
              <img v-lazy="{src: items.profileImage ? items.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'}" alt="" class="lazy-img-fadein">
              <svg class="svg-member-circle" v-if="items.type === 'OFFICIAL'">
                <use xlink:href="#svg-member-circle" />
              </svg>
            </div>
          </div>

          <div class="item-inner">
            <div class="item-title _ellipsis">{{items.name}}</div>
            <div class="item-subtitle _ellipsis">
              {{items.nickname}}
            </div>

          </div>

          <div class="item-align-center">
            <label class="label-checkbox">
              <input type="checkbox" name="my-radio" :disabled="items.type == 'OFFICIAL'" v-model="selectedPeople" :value="items.id">
              <i class="icon icon-form-checkbox">icon</i>
            </label>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
export default {
  data() {
    return {
      peopleLists: [],
      selectedPeople: []
    }
  },
  mounted() {
    this.getInterest()
  },
  methods: {
    // 获取感兴趣的人
    getInterest() {
      axios.get('/api/wap/forum/interest?limit=10').then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.peopleLists = res.data.data.rows
          this.peopleLists.forEach(ele => {
            this.selectedPeople.push(ele.id)
          })
        } else {

        }
      })
    },
    goCommunity() {
      axios.post('/api/wap/forum/addFollow', { memberIds: this.selectedPeople }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.$router.replace({ path: '/Index' })
        } else {
        }
      })
    }
  }
}
</script>
