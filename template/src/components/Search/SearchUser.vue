<template>
  <div>
    <div class="tips-box" v-show="lists.length === 0">
      <div class="tips-no-result">
        <div class="icon-area">
          <i class="icon icon-no-result">icon</i>
        </div>
        <p>很抱歉，没有找到</p>
        <p>“{{keyword}}”有关的用户</p>
      </div>
    </div>

    <div class="list-user">
      <div class=" item-goods item-horizontal" v-for="(items) in lists" :key="items.id" @click="personal(items.id)">
        <div class="author-column" >
          <div class="author-avatar">
            <img v-lazy="{src: items.profileImage ? items.profileImage : 'static/images/m/avatar.jpg',
                loading: 'static/images/m/avatar.jpg',
                error: 'static/images/m/avatar.jpg'}" alt="" class="lazy-img-fadein">
          </div>
        </div>
        <div class="item-inner">
          <div class="item-title _ellipsis">{{items.nickname}}</div>
          <div class="item-subtitle _ellipsis">
            {{items.signature}}
          </div>
        </div>
        <div class="item-align-center" v-show="items.id !== loggedUserId">
          <a href="javascript:;" class="btn-normal btn-sm" :class="{'btn-primary': items.addFollow}" @click.stop.prevent="followStatus(items)">{{items.addFollow ? '关注' : '取消关注'}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { followStatus } from '@/mixin/community'
export default {
  mixins: [followStatus],
  props: {
    keyword: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      lists: [],
      loggedUserId: '', // 获取当前登录用户id（跳转详情两种页面需要判断）
      onOff: true // 防止连击
    }
  },
  mounted() {
    this.loggedUserId = sessionStorage.getItem('oilmall_user') ? JSON.parse(sessionStorage.getItem('oilmall_user')).memberId : ''
    this.getUser()
  },
  methods: {
    // 获取用户
    getUser() {
      axios.get('/api/wap/members/search?keyword=' + this.keyword).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.lists = res.data.data
        } else {

        }
      })
    },
    resetResult() {
      this.lists = []
      this.getUser()
    },
    // 社群个人首页
    personal(id) {
      window.location.href = `community.html#/Index/${id === this.loggedUserId ? 'personalUser' : 'personalOthers'}?id=${id}&forward=${true}`
    }
  },
  watch: {
    keyword(val) {
      this.lists = []
      this.getUser()
    }
  }
}
</script>

