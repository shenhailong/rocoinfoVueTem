import axios from 'axios'

// let rootUrl = window.location.origin + '/static/picc'

// 分享数据
let shareObj = {}

let CancelToken = axios.CancelToken
let cancel

// 请求配置数据
function RegisterWeiXin() {
  cancel && cancel()
  axios.get('/api/jssdk', {
    cancelToken: new CancelToken(function executor(c) {
      cancel = c
    }),
    params: {
      url: window.location.href
    }
  }).then((res) => {
    if (res.data.code === '1') {
      registerWx(res.data.data)
    }
  })
}

// 注册微信
function registerWx(config) {
  window.wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: config.appId, // 必填，公众号的唯一标识
    timestamp: config.timestamp, // 必填，生成签名的时间戳
    nonceStr: config.nonceStr, // 必填，生成签名的随机串
    signature: config.signature, // 必填，签名，见附录1
    jsApiList: [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'translateVoice',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'
    ]
    // jsApiList: ['scanQRCode', 'shareMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'hideAllNonBaseMenuItem', 'showMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  })

  window.wx.ready(() => {
    initMenu()
  })
  window.wx.error((res) => {
    console.log(JSON.stringify(res))
  })
}

function initShareMenu(obj) {
  shareObj = obj
  initMenu()
}

function initMenu() {
  // 按钮显示隐藏处理
  buttonHandle()
  // 朋友圈
  shareMenuShareTimeline()
  // 发送给朋友
  shareMenuShareAppMessage()
}

// 分享给朋友圈
function shareMenuShareTimeline() {
  window.wx.onMenuShareTimeline({
    title: shareObj.shareTimelineTitle, // 分享标题
    link: makeLink(), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: shareObj.imgUrl, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  })
}

// 分享给朋友
function shareMenuShareAppMessage() {
  window.wx.onMenuShareAppMessage({
    title: shareObj.shareAppMessageTitle, // 分享标题
    desc: shareObj.shareAppMessageDesc, // 分享描述
    link: makeLink(), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: shareObj.imgUrl, // 分享图标
    // type: '', // 分享类型,music、video或link，不填默认为link
    // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  })
}

// 按钮隐藏显示处理
function buttonHandle() {
  // 隐藏所有非基础按钮接口
  // window.wx.hideAllNonBaseMenuItem()

  // 批量隐藏功能按钮接口
  // window.wx.hideMenuItems({
  //   menuList: [] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
  // })

  // 批量显示功能按钮接口
  // window.wx.showMenuItems({
  //   // 分享到朋友圈，发送给朋友
  //   menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项，所有menu项见附录3
  // })
}

/**
 * title, link, imgUrl, desc
 * @param {*} obj 对象
 */
function share(obj) {
  shareObj = obj
  RegisterWeiXin()
}

function makeLink() {
  console.log(`${window.location.origin}/share/redirect?redirect=${encodeURIComponent(shareObj.link)}`)
  return `${window.location.origin}/share/redirect?redirect=${encodeURIComponent(shareObj.link)}`
}

function defaultConfig() {
  return {
    shareAppMessageTitle: '快来注册下单，和我一起享受美好芳疗生活！',
    shareAppMessageDesc: '快来注册下单，和我一起享受美好芳疗生活！',
    shareTimelineTitle: '快来注册下单，和我一起享受美好芳疗生活！',
    link: window.location.origin + '/wap/html/wap/index.html',
    imgUrl: window.location.origin + '/wap/html/wap/static/images/touch-icon/180x180.png'
  }
}

function userDefaultConfig() {
  return {
    shareAppMessageTitle: '快来注册下单，和我一起享受美好芳疗生活！',
    shareAppMessageDesc: '快来注册下单，和我一起享受美好芳疗生活！',
    shareTimelineTitle: '快来注册下单，和我一起享受美好芳疗生活！',
    link: window.location.origin + '/wap/html/wap/index.html',
    imgUrl: window.location.origin + '/wap/html/wap/static/images/touch-icon/180x180.png'
  }
}

export default { share, initShareMenu, defaultConfig, userDefaultConfig }
