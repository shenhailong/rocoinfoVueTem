
import * as BASE_INFO from '@/store/types/baseInfo'
import { mapState } from 'vuex'
export default {
  // computed: {
  //   ...mapState({
  //     userInfo: state => state.baseInfo.userInfo
  //   })
  // },
  created() {
    try {
      let userInfo = sessionStorage.oilmall_user && JSON.parse(sessionStorage.oilmall_user)
      this.$store.commit(BASE_INFO.BASE_INFO_SET, userInfo)
      // this.$store.dispatch(BASE_INFO.BASE_INFO_GET)
      if (userInfo && !userInfo.selectedInterestTags) {
        // 未选兴趣标签
        window.location.href = 'interest.html'
      }
    } catch (e) {
      console.error(e)
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.baseInfo.userInfo
    })
  },
  watch: {
    // userInfo(val) {
    //   if (val && !val.selectedInterestTags) {
    //     // 未选兴趣标签
    //     window.location.href = 'interest.html'
    //   }
    //   console.log(val)
    // }
  }
}
