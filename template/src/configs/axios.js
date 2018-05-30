import axios from 'axios'
import {
  Toast
} from 'rocoui'
import { ERROR as CODE_ERROR, NEED_LOGIN } from '@/constants/responseCode'
require('es6-promise/auto')
require('promise.prototype.finally').shim()
// const isDevEnv =
//   window.location.href.indexOf('http://192.168') !== -1 ||
//   window.location.href.indexOf('http://localhost') !== -1
// 在这里配好域名
// const baseURL = {
//   adm: process.env.baseAdmURL,
//   erp: process.env.baseErpURL,
//   forum: process.env.baseForumURL
// }

let cancel = null
let promiseMap = {}
const CancelToken = axios.CancelToken
axios.interceptors.request.use(
  function(config) {
    if (promiseMap[config.url]) {
      promiseMap[config.url]('操作取消')
      promiseMap[config.url] = null
    } else {
      promiseMap[config.url] = cancel
    }
    if (config.method === 'get') {
      if (!config.params) {
        config.params = {}
      }
      config.params._ = new Date().getTime()
    }
    // if (!isDevEnv) {

      // 匹配字符串添加前缀
    // try {
    //   let matchKey = config.url
    //     .match(/^\/api\/(adm|erp|forum)/gi)[0]
    //     .replace('/api/', '')
    //   if (!matchKey) {
    //     throw new Error(`没匹配到对应的路径${config.url}`)
    //   }
    //   config.baseURL = baseURL[matchKey]
    // } catch (e) {
    //   console.error(e.toString())
    // }
    // }
    return config
  },
  function(error) {
    console.log('error get')
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function(response) {
    if (response.data.code === CODE_ERROR) {
      Toast.fail(response.data.message, 2)
    } else if (response.data.code === NEED_LOGIN) {
      // 403 需要登录
      window.location = `login.html?_=${new Date().getTime()}`
    }
    return response
  },
  function(error) {
    let str = '网络不给力哦，请检查网络状态'
    if (error && error.response) {
      switch (error.response.status) {
        case 404:
          str = '访问地址不存在'
          break
        case 500:
          str = '访问地址出现异常'
          break
        case 502:
        case 504:
          str = '服务器不在服务区'
          break
        default:
          break
      }
      Toast.fail(str)
    }

    // return Promise.reject(error)
    // 不再返回0
    return Promise.resolve({ data: { code: '-1' } })
  }
)

// 默认导出这个对象
export default {
  get(url, params, type) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params,
        cancelToken: new CancelToken((c) => {
          cancel = c
        })
      }).then((res) => {
        resolve(res)
      })
    })
  },
  post(url, data, type) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data,
        cancelToken: new CancelToken((c) => {
          cancel = c
        })
      }).then((res) => {
        resolve(res)
      })
    })
  }
}
