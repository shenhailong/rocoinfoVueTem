<template>
  <div class="wrap wrap-invitation">
    <div class="mask-layer" :class="{'_in': inviteVisible}"></div>
    <div @click="inviteVisible=false" class="links-share-box" :class="{'_in': inviteVisible}">
      <div class="text">
        <img class="icon01" src="static/images/img-share.png" alt="分享img">
        <p class="text-column">点击这里转发链接</p>
        <p class="text-column">邀请好友哦</p>
      </div>
    </div>
    <div class="content">
      <div class="invitation-header"></div>
      <!-- /.invitation-header -->

      <div class="invitation-content">
        <div class="function-zone">
          <a href="javascript:;" v-if="canInvite" @click="inviteHandler" class="btn-normal btn-invitation">
            立即邀请好友
          </a>
          <div class="flex layout-column">
            <a class="item">
              <div class="num"><i>{{ inviteCount }}</i>人</div>
              <div class="text">成功邀请</div>
            </a>
            <a class="item">
              <div class="num"><i>{{ giftCount }}</i>件</div>
              <div class="text">累计获得</div>
            </a>
          </div>
          <!-- /.layout-column -->
          <a href="JavaScript:;" @click="goRouter" class="links">
            查看所获的精油
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>
        <!-- /.function-zone -->
        <template v-if="canInvite">
          <div class="space-20"></div>
          <div class="activity-rules-box">
            <div class="title-wrap">
              <div class="title">活动细则</div>
            </div>
            <article class="text-area">
              <section class="item">
                <h1>1、邀请好友得精油</h1>
                <p>转发商城链接给好友，好友打开连接通过手机号注册并
                    下单，分享者可在好友确认收货15天后，领取一瓶商城
                    随机赠送的IN ESSENCE正价精油。礼品领取时限为一
                    年，到期将自动失效。</p>
              </section>
              <section class="item">
                <h1>2、多邀多得不封顶</h1>
                <p>赠品无上限，可将商城链接转发至多个好友，凡好友通
                    过转发链接注册并下单，分享者可根据完成人数，收到
                    相应数量的正价精油。</p>
              </section>
              <section class="item">
                <h1>3、分享积分赚不停</h1>
                <p>好友通过邀请链接注册下单，则分享者可获得与好友实
                    付金额相对应的积分，即好友消费1元可获得1积分，以
                    此类推。</p>
              </section>
            </article>
          </div>
          <!-- /.activity-rules-box -->
          <p class="text-copyright">*此活动最终解释权归IN ESSENCE精油所有。</p>
        </template>
      </div>
      <!-- /.invitation-content -->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import userShare from '@/configs/share'
import { Toast, Modal } from 'rocoui'
import axios from 'axios'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  name: 'MineInvitingGift',
  data () {
    return {
      canInvite: false,
      inviteCount: 0,
      giftCount: 0,
      inviteVisible: false
    }
  },
  created() {
    // 判断邀请有礼活动是否开启&获取邀请人数和奖品数
    this.initInviteInfo()
  },
  methods: {
    // 判断邀请有礼活动是否开启&获取邀请人数和奖品数
    initInviteInfo () {
      let promise = axios.all([
        axios.get('/api/wap/activity/invites/checkCanInvite'),
        axios.get(`/api/wap/activity/invites/getInviteAndSuccessCount`)
      ]).then(axios.spread((flag, count) => {
        if (flag.data.code === CODE_SUCCESS) {
          this.canInvite = flag.data.data
        }
        if (count.data.code === CODE_SUCCESS) {
          this.inviteCount = count.data.data.inviteCount
          this.giftCount = count.data.data.giftCount
        }
      }))
      Toast.loading('加载中...', promise)
    },
    // 立即邀请好友
    inviteHandler () {
      this.inviteVisible = true
      axios.get(`/api/wap/activity/invites/generateInviteUrl`).then(res => {
        if (res.data.code === CODE_SUCCESS) {
          let configObj = userShare.userDefaultConfig()
          configObj.link = res.data.data
          // 分享有礼
          userShare.share(configObj)
        }
      })
    },
    // 路由跳转 - 查看所获得的精油
    goRouter () {
      let self = this
      if (this.giftCount > 0) {
        this.$router.push({
          name: 'MineInvitingGiftList'
        })
      } else {
        if (this.canInvite) {
          Modal.confirm({
            okText: '确定',
            cancelText: '取消',
            body: '<b>没有赠品，是否邀请好友？</b>',
            okCb: function(){
              self.inviteVisible = true
            }
          })
        } else {
          Toast.fail('您还没有赠品', 2)
        }
      }
    }
  }
}
</script>

